import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import jwt from "jsonwebtoken";

//^  REGISTER USER (STUDENT ONLY)
const register = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, department, semester } =
      req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      const err = new Error("Name, email and password are required");
      err.statusCode = 400;
      return next(err);
    }

    // 2. Student-specific validation
    if (!rollNumber || !department || !semester) {
      const err = new Error("Student details are required");
      err.statusCode = 400;
      return next(err);
    }

    // 3. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      const err = new Error("Email already registered");
      err.statusCode = 400;
      return next(err);
    }

    // 4. Create USER (role forced to student)
    const user = await User.create({
      name,
      email,
      password, // hashed by schema
      role: "student",
    });

    // 5. Create STUDENT PROFILE
    await StudentProfile.create({
      userId: user._id,
      rollNumber,
      department,
      semester,
    });

    // 6. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "Student registered successfully",
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

// LOGIN USER (ADMIN OR STUDENT)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 400;
      return next(err);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const err = new Error("Invalid email or password");
      err.statusCode = 400;
      return next(err);
    }

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

export { register, login };
