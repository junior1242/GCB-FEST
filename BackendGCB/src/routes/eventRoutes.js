import express from "express";
const router = express.Router();
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, adminOnly} from "../middleware/authMiddleware.js";
// const upload = require("../middleware/upload");
import { upload } from '../middleware/upload.js';

// CREATE EVENT (Admin)
router.post("/", protect, adminOnly, upload.single("image"), createEvent);

// GET ALL EVENTS
router.get("/", getAllEvents);

// GET SINGLE EVENT
router.get("/:id", getEventById);

// UPDATE EVENT (Admin)
router.put("/:id", protect, adminOnly, upload.single("image"), updateEvent);

// DELETE EVENT (Admin)
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;
