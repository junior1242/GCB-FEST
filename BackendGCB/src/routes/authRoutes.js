import express from "express";
import { register, login, verifyEmail, getAllStudents,getProfile } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

// Auth routes
router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/students", protect, adminOnly, getAllStudents);
router.get('/profile', protect, getProfile); 

// Default export (so we can import it easily in app.js)
export default router;
