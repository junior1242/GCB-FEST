const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAllStudents,
  getAllEvents,
  getAllFeedback,
} = require("../controllers/adminController");

// @route   POST /api/admin/register
// @desc    Register new admin (college staff)
router.post("/register", registerAdmin);

// @route   POST /api/admin/login
// @desc    Admin login
router.post("/login", loginAdmin);

// @route   GET /api/admin/students
// @desc    Get all students (Admin only)
router.get("/students", getAllStudents);

// @route   GET /api/admin/events
// @desc    Get all events (Admin only)
router.get("/events", getAllEvents);

// @route   GET /api/admin/feedback
// @desc    Get all event feedback (Admin only)
router.get("/feedback", getAllFeedback);

module.exports = router;
