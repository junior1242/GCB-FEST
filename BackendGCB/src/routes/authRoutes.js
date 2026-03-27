import express from "express";
import {
  register,
  login,
  verifyEmail,
  getAllStudents,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

router.post("/register", authLimiter, register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", authLimiter, login);
router.get("/students", protect, adminOnly, getAllStudents);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
