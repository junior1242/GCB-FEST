import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; // Your auth helpers

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getAdminStats);

export default router;
