import express from "express";
import {
  getAdminStats,
  getUnverifiedStudents,
  verifyStudent,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminStats);
router.get("/unverified-students", protect, adminOnly, getUnverifiedStudents);
router.patch("/verify-student/:id", protect, adminOnly, verifyStudent);

export default router;
