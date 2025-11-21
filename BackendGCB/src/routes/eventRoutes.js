const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// CREATE EVENT (Admin)
router.post("/", protect, adminOnly, upload.single("image"), createEvent);

// GET ALL EVENTS
router.get("/", getEvents);

// GET SINGLE EVENT
router.get("/:id", getEventById);

// UPDATE EVENT (Admin)
router.put("/:id", protect, adminOnly, upload.single("image"), updateEvent);

// DELETE EVENT (Admin)
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
