import express from "express";
const router = express.Router();
import { createReservation, getMyReservations } from "../controllers/reservationController.js";
import { protect } from "../middleware/authMiddleware.js";

// Use protect middleware so req.user is available
router.post("/register", protect, createReservation);
router.get("/my-bookings", protect, getMyReservations);

export default router;
