const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate basic fields
    if (!name || !email || !password) {
      const err = new Error("Name, email and password are required");
      err.statusCode = 400;
      return next(err);
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      const err = new Error("Email already registered");
      err.statusCode = 400;
      return next(err);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student", // default student
    });

    // Optionally generate token on register
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN USER
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      return next(err);
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 400;
      return next(err);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid email or password");
      err.statusCode = 400;
      return next(err);
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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
