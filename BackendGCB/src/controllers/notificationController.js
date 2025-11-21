const Notification = require("../models/Notification");
const User = require("../models/User");

// SEND NOTIFICATION (ADMIN)
exports.sendNotification = async (req, res, next) => {
  try {
    const { title, message, userId } = req.body;

    if (!title || !message) {
      const err = new Error("Title and message are required");
      err.statusCode = 400;
      return next(err);
    }

    // If specific user
    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        return next(err);
      }

      const notif = await Notification.create({
        title,
        message,
        user: userId,
      });

      return res.status(201).json({
        message: "Notification sent to selected user",
        notif,
      });
    }

    // Otherwise send to all students
    const students = await User.find({ role: "student" });

    if (students.length === 0) {
      const err = new Error("No students found");
      err.statusCode = 404;
      return next(err);
    }

    const notifications = students.map((student) => ({
      title,
      message,
      user: student._id,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Notification sent to all students",
    });
  } catch (error) {
    next(error);
  }
};

// GET MY NOTIFICATIONS (STUDENT)
exports.getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// MARK AS READ
exports.markAsRead = async (req, res, next) => {
  try {
    const notifId = req.params.id;

    const notif = await Notification.findOneAndUpdate(
      { _id: notifId, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notif) {
      const err = new Error("Notification not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({
      message: "Notification marked as read",
      notif,
    });
  } catch (error) {
    next(error);
  }
};
