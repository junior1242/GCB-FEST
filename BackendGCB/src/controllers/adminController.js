import User from "../models/User.js";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, pendingStudents, activeEvents, totalReservations] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "student", isVerified: false }),
        Event.countDocuments(),
        Reservation.countDocuments(),
      ]);

    // 2. Fetch all events and calculate reservation counts for each
    const events = await Event.find().select("title date maxSeats");

    const eventStats = await Promise.all(
      events.map(async (event) => {
        const count = await Reservation.countDocuments({ event: event._id });
        return {
          _id: event._id,
          title: event.title,
          date: event.date,
          maxSeats: event.maxSeats,
          reservationsCount: count,
        };
      }),
    );
    res.status(200).json({
      totalStudents,
      pendingStudents,
      activeEvents,
      totalReservations,
      eventStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnverifiedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student", isVerified: false })
      .select("name email createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isVerified: true });
    res.status(200).json({ message: "Student verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};