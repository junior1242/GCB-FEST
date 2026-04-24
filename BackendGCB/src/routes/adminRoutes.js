import express from "express";
import {
  getAdminStats,
  getPendingStudents,
  handleStudentStatus,
  getTodaysEvents,
  getEventReservations,
  markAttendance,
  getPastEvents,
  getPastEventDetails,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminStats);
// router.get("/unverified-students", protect, adminOnly, getUnverifiedStudents);
// router.patch("/verify-student/:id", protect, adminOnly, verifyStudent);

router.get("/pending-students", protect, adminOnly, getPendingStudents);
router.patch("/approve-student", protect, adminOnly, handleStudentStatus);

router.get("/todays-events", protect, adminOnly, getTodaysEvents);
// Add this line
router.get(
  "/event-reservations/:eventId",
  protect,
  adminOnly,
  getEventReservations,
);
// routes/adminRoutes.js
router.patch("/mark-attendance", protect, adminOnly, markAttendance);
export default router;

router.get("/past-events", protect, adminOnly, getPastEvents);
router.get("/past-events/:id", protect, adminOnly, getPastEventDetails);
