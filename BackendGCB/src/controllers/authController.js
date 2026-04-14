import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import { PasswordResetTemplate } from "../templates/forgotPassword.js";

// REGISTER USER
export const register = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, department, semester } =
      req.body;

    if (!name || !email || !password || !rollNumber || !department || !semester)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingUser)
      return res.status(400).json({
        message: "Student with this email or roll number already exists",
      });

    const verificationToken = crypto.randomBytes(32).toString("hex");
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
      status: "pending",
      isVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const message = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Account Verification</h2>
          <p>Thank you for registering. Please click the button below to verify your email:</p>
          <a href="${verifyURL}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          <p>After verification, an admin will review your details to grant system access.</p>
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
          "Registration successful. Please verify your email via the link sent to your inbox.",
      });
    } catch (err) {
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

    // Changed message to reflect that admin approval is still needed
    res.json({
      message:
        "Email verified successfully! Your account is now waiting for admin approval. You will be able to login once approved.",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 1. Check Email Verification
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Your email is not verified. Please check your inbox.",
      });
    }

    // 2. Check Admin Approval Status
    if (user.status === "pending") {
      return res.status(403).json({
        message:
          "Your account is pending admin approval. Please wait for the administrator to verify your details.",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message:
          "Your registration request was rejected. Please contact the department office.",
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
        status: user.status,
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

// 1. FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token for DB storage
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // FORCE SAVE to DB bypassing validation (This fixes the 'Invalid/Expired' error)
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 3600000, // 1 hour
    });

    const resetUrl = `${process.env.CLIENT_URL.replace(/\/$/, "")}/reset-password/${resetToken}`;
    const html = PasswordResetTemplate(resetUrl);
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message: html,
      });

      res.status(200).json({ message: "Reset link sent to your email!" });
    } catch (mailError) {
      // If mail fails, clear the tokens we just saved
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      });
      return res
        .status(500)
        .json({ message: "Error sending email. Please try again." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 2. RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user and check if token is still valid (not expired)
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Link is invalid or has expired" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(password, salt);

    // Update user and clear reset fields
    await User.findByIdAndUpdate(user._id, {
      password: newHashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
