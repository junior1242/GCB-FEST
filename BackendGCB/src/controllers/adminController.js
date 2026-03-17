import User from "../models/User.js";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, pendingStudents, activeEvents, totalReservations] = await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "student", isVerified: false }),

        Event.countDocuments(),
        Reservation.countDocuments(),
    ]);

    res.status(200).json({
        totalStudents,
        pendingStudents,
        activeEvents,
        totalReservations,

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
