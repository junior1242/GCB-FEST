const express = require("express");
const router = express.Router();

const {
  bookEvent,
  getMyBookings,
  cancelBooking,
} = require("../controllers/reservationController");

const { protect } = require("../middleware/authMiddleware");

// BOOK EVENT
router.post("/book", protect, bookEvent);

// GET USER BOOKINGS
router.get("/my-bookings", protect, getMyBookings);

// CANCEL BOOKING
router.delete("/cancel/:id", protect, cancelBooking);

module.exports = router;
