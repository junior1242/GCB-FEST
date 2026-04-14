import express from "express";
import {
  getAdminStats,
  getPendingStudents,
  handleStudentStatus,
  // getUnverifiedStudents,
  // verifyStudent,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminStats);
// router.get("/unverified-students", protect, adminOnly, getUnverifiedStudents);
// router.patch("/verify-student/:id", protect, adminOnly, verifyStudent);
router.get(
  "/pending-students",
  protect,
  adminOnly,
  getPendingStudents,
);
router.patch(
  "/approve-student",
  protect,
  adminOnly,
  handleStudentStatus,
);

export default router;
