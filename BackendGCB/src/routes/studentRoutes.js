const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

// @route   POST /api/students/register
// @desc    Register new student
router.post("/register", registerStudent);

// @route   POST /api/students/login
// @desc    Student login
router.post("/login", loginStudent);

// @route   GET /api/students/profile/:id
// @desc    Get student profile
router.get("/profile/:id", getStudentProfile);

// @route   PUT /api/students/profile/:id
// @desc    Update student profile
router.put("/profile/:id", updateStudentProfile);

module.exports = router;
