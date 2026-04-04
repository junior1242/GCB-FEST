import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
// REGISTER USER
export const register = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, department, semester } =
      req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email and password required" });

    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });
    if (existingUser)
      return res.status(400).json({ message: "Student already exists" });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash the token for the database (Security best practice)
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await User.create({
      name,
      email,
      password,
      rollNumber,
      department,
      semester,
      role: "student",
      verificationToken: hashedToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Link sent to user (contains RAW token)
    const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const message = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Account Verification</h2>
          <p>Thank you for registering. Please click the button below to verify your email:</p>
          <a href="${verifyURL}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          <p>This link expires in 24 hours.</p>
        </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Verify Your Account",
        message: message,
      });

      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    } catch (err) {
      // If email fails, delete the user so they can try again
      await User.findByIdAndDelete(user._id);
      return res
        .status(500)
        .json({ message: "Email could not be sent. Please try again." });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Link is invalid or has expired." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 1. Check if user is verified before allowing login
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Your email is not verified. Please check your inbox.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, rollNumber, department, semester } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (semester) user.semester = semester;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, rollNumber, newPassword } = req.body;
    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
      rollNumber: rollNumber?.trim(),
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid Email or Roll Number" });
    }
    if (user.lastPasswordReset) {
      const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
      const timeSinceLastReset =
        Date.now() - new Date(user.lastPasswordReset).getTime();

      if (timeSinceLastReset < SEVEN_DAYS_IN_MS) {
        const remainingMs = SEVEN_DAYS_IN_MS - timeSinceLastReset;
        const daysRemaining = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

        return res.status(429).json({
          message: `Password was recently reset. Please wait ${daysRemaining} day(s) before trying again.`,
        });
      }
    }

    user.password = newPassword;
    user.lastPasswordReset = Date.now();

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully! You can now login with your new password.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
