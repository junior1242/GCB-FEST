const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register new student
// @route   POST /api/students/register
const registerStudent = async (req, res) => {
  try {
    const { name, roll_no, department, email, password } = req.body;

    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      roll_no,
      department,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      department: student.department,
      token: generateToken(student._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login student
// @route   POST /api/students/login
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      department: student.department,
      token: generateToken(student._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile/:id
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile/:id
const updateStudentProfile = async (req, res) => {
  try {
    const { name, department, password } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    student.name = name || student.name;
    student.department = department || student.department;
    if (password) {
      student.password = await bcrypt.hash(password, 10);
    }

    const updated = await student.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      department: updated.department,
      token: generateToken(updated._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
};
