const Feedback = require("../models/Feedback");
const Event = require("../models/Event");
const Student = require("../models/Student");

// @desc    Add feedback for an event
// @route   POST /api/feedback
const addFeedback = async (req, res) => {
  try {
    const { eventId, studentId, rating, comments } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existing = await Feedback.findOne({
      event: eventId,
      student: studentId,
    });
    if (existing)
      return res.status(400).json({ message: "Feedback already submitted" });

    const feedback = await Feedback.create({
      event: eventId,
      student: studentId,
      rating,
      comments,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all feedback for an event
// @route   GET /api/feedback/event/:eventId
const getFeedbackByEvent = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate("student", "name email department roll_no")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all feedback by a student
// @route   GET /api/feedback/student/:studentId
const getFeedbackByStudent = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.params.studentId })
      .populate("event", "title date venue")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete feedback (Admin only)
// @route   DELETE /api/feedback/:id
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback)
      return res.status(404).json({ message: "Feedback not found" });

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addFeedback,
  getFeedbackByEvent,
  getFeedbackByStudent,
  deleteFeedback,
};
