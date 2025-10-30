const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Student = require("../models/Student");

// @desc    Register a student for an event
// @route   POST /api/registrations
const registerForEvent = async (req, res) => {
  try {
    const { eventId, studentId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Prevent duplicate registrations
    const existing = await Registration.findOne({
      event: eventId,
      student: studentId,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Already registered for this event" });

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      student: studentId,
    });
    res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all registrations for an event (Admin View)
// @route   GET /api/registrations/event/:eventId
const getRegistrationsByEvent = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
    }).populate("student", "name email department roll_no");
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all registrations of a student
// @route   GET /api/registrations/student/:studentId
const getRegistrationsByStudent = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.params.studentId,
    }).populate("event", "title date venue status");
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    await registration.deleteOne();
    res.json({ message: "Registration cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerForEvent,
  getRegistrationsByEvent,
  getRegistrationsByStudent,
  cancelRegistration,
};
