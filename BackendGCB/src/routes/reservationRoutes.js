import express from "express";
import {
  createReservation,
  getAllRegistrations,
  getMyBookings,
  updateReservationStatus,
} from "../controllers/reservationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student routes
router.post("/register", protect, createReservation);
router.get("/my-bookings", protect, getMyBookings);

// Admin route
router.get("/admin/all", protect, adminOnly, getAllRegistrations);

router.put("/:id/status", protect, updateReservationStatus);

export default router;
