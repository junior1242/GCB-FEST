// const express = require("express");
import express from "express";
const router = express.Router();
import { sendNotification,getMyNotifications,markAsRead } from "../controllers/notificationController.js"; 
import { protect, adminOnly } from "../middleware/authMiddleware.js";

// SEND NOTIFICATION (Admin only)
router.post("/", protect, adminOnly, sendNotification);

// GET MY NOTIFICATIONS (Student)
router.get("/my", protect, getMyNotifications);

// MARK AS READ
router.put("/read/:id", protect, markAsRead);

export default router;