const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// POST - Create a new event (Admin only)
router.post("/", createEvent);

// GET - Fetch all events (Admin or Student)
router.get("/", getAllEvents);

// GET - Fetch a single event by ID
router.get("/:id", getEventById);

// PUT - Update event details (Admin only)
router.put("/:id", updateEvent);

// DELETE - Delete an event (Admin only)
router.delete("/:id", deleteEvent);

module.exports = router;
