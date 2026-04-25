import express from "express";
const router = express.Router();
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getMyPastEvents,
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

// CREATE EVENT (Admin)
// router.post("/", protect, adminOnly, upload.single("image"), createEvent);
router.post(
  "/",
  protect,
  adminOnly,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createEvent,
);

router.get("/", getAllEvents);

router.put("/:id", protect, adminOnly, upload.single("image"), updateEvent);

router.delete("/:id", protect, adminOnly, deleteEvent);

router.get("/my-past-events", protect, getMyPastEvents);


export default router;
