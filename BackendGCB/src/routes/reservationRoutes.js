import express from "express";
const router = express.Router();

import {
  bookEvent,
  getMyBookings,
  cancelBooking,
} from "../controllers/reservationController.js";

import { protect } from "../middleware/authMiddleware.js";

// BOOK EVENT
router.post("/book", protect, bookEvent);

// GET USER BOOKINGS
router.get("/my-bookings", protect, getMyBookings);

// CANCEL BOOKING
router.delete("/cancel/:id", protect, cancelBooking);

export default router;
