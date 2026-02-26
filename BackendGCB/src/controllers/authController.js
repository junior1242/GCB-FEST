import User from "../models/User.js";
// import StudentProfile from "../models/StudentProfile.js";
import jwt from "jsonwebtoken";

//& REGISTER USER (ADMIN OR STUDENT)
const register = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, department, semester } =
      req.body;

    if (!name || !email || !password) {
      const err = new Error("Name, email and password are required");
      err.statusCode = 400;
      return next(err);
    }

    // 2️⃣ Student-specific validation
    if (!rollNumber || !department || !semester) {
      const err = new Error("Student details are required");
      err.statusCode = 400;
      return next(err);
    }

    // 3️⃣ Pre-check for existing email or rollNumber (friendly UX)
    const userExists = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (userExists) {
      if (userExists.email === email) {
        const err = new Error("The Student already registered with this email");
        err.statusCode = 400;
        return next(err);
      }
      if (userExists.rollNumber === rollNumber) {
        const err = new Error(
          "The Student already registered with this roll number",
        );
        err.statusCode = 400;
        return next(err);
      }
    }

    // 4️⃣ Create USER with safety for unique indexes
    let user;
    try {
      user = await User.create({
        name,
        email,
        rollNumber,
        department,
        semester,
        password, // hashed in schema
        role: "student",
      });
    } catch (err) {
      // Catch MongoDB duplicate key error (E11000)
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // email or rollNumber
        const errorMessage = `The Student already registered with this ${field}`;
        const error = new Error(errorMessage);
        error.statusCode = 400;
        return next(error);
      }
      return next(err); // other errors
    }

    // 5️⃣ Create STUDENT PROFILE
    // await StudentProfile.create({
    //   userId: user._id,
    //   rollNumber,
    //   department,
    //   semester,
    // });

    // 6️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 7️⃣ Send success response
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
    next(error); // send to your errorHandler.js
  }
};


//& LOGIN USER (ADMIN OR STUDENT)
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
