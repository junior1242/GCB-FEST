import express from "express";
import { register, login, verifyEmail } from "../controllers/authController.js";
const router = express.Router();

// Auth routes
router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);

// Default export (so we can import it easily in app.js)
export default router;
