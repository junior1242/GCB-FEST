const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getRegistrationsByEvent,
  getRegistrationsByStudent,
  cancelRegistration,
} = require("../controllers/registrationController");

// @route   POST /api/registrations
// @desc    Student registers for an event
router.post("/", registerForEvent);

// @route   GET /api/registrations/event/:eventId
// @desc    Get all students registered for a specific event (Admin)
router.get("/event/:eventId", getRegistrationsByEvent);

// @route   GET /api/registrations/student/:studentId
// @desc    Get all events a student registered for
router.get("/student/:studentId", getRegistrationsByStudent);

// @route   DELETE /api/registrations/:id
// @desc    Cancel a registration
router.delete("/:id", cancelRegistration);

module.exports = router;
