const express = require("express");
const router = express.Router();

const {
  sendNotification,
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// SEND NOTIFICATION (Admin only)
router.post("/", protect, adminOnly, sendNotification);

// GET MY NOTIFICATIONS (Student)
router.get("/my", protect, getMyNotifications);

// MARK AS READ
router.put("/read/:id", protect, markAsRead);

module.exports = router;
