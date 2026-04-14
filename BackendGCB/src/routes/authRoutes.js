import express from "express";
import {
  register,
  login,
  verifyEmail,
  getAllStudents,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  authLimiter,
  forgotPasswordLimiter,
} from "../middleware/rateLimiter.js";
const router = express.Router();

router.post("/register", authLimiter, register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", authLimiter, login);
router.get("/students", protect, adminOnly, getAllStudents);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", forgotPasswordLimiter, resetPassword);

export default router;
