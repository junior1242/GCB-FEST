import express from "express";
import { register, login, verifyEmail, getAllStudents } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

// Auth routes
router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/students", protect, adminOnly, getAllStudents);

// Default export (so we can import it easily in app.js)
export default router;
