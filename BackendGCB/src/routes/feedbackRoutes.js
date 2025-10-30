const express = require("express");
const router = express.Router();
const {
  addFeedback,
  getFeedbackByEvent,
  getFeedbackByStudent,
  deleteFeedback,
} = require("../controllers/feedbackController");

// @route   POST /api/feedback
// @desc    Add feedback for an event
router.post("/", addFeedback);

// @route   GET /api/feedback/event/:eventId
// @desc    Get all feedback for a specific event
router.get("/event/:eventId", getFeedbackByEvent);

// @route   GET /api/feedback/student/:studentId
// @desc    Get all feedback given by a specific student
router.get("/student/:studentId", getFeedbackByStudent);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (Admin only)
router.delete("/:id", deleteFeedback);

module.exports = router;
