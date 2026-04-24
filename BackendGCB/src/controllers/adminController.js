import User from "../models/User.js";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import PastEvent from "../models/PastEvent.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, pendingStudents, activeEvents, totalReservations] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "student", status: "pending" }),
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

// Get all verified students waiting for admin approval
export const getPendingStudents = async (req, res, next) => {
  try {
    // We only want users who verified their email but are still pending
    const students = await User.find({
      role: "student",
      isVerified: true,
      status: "pending",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

export const handleStudentStatus = async (req, res, next) => {
  try {
    const { studentId, status } = req.body;

    if (status === "active") {
      const student = await User.findByIdAndUpdate(
        studentId,
        { status: "active" },
        { new: true },
      );

      if (!student)
        return res.status(404).json({ message: "Student not found" });

      return res.status(200).json({
        success: true,
        message: "Student registration approved successfully!",
      });
    }

    if (status === "rejected") {
      const student = await User.findByIdAndDelete(studentId);

      if (!student)
        return res.status(404).json({ message: "Student not found" });

      return res.status(200).json({
        success: true,
        message: "Student rejected and record removed from system.",
      });
    }

    res.status(400).json({ message: "Invalid status" });
  } catch (error) {
    next(error);
  }
};

export const getTodaysEvents = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    // console.log("Searching for string match with:", todayStr);

    const events = await Event.find({
      date: { $regex: `^${todayStr}` },
      isArchived: { $ne: true },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching today's events" });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { reservationId, status } = req.body;

    const updated = await Reservation.findByIdAndUpdate(
      reservationId,
      { attendanceStatus: status },
      { new: true }, // Return the updated document
    ).populate("user", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEventReservations = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Find all reservations for this specific event
    // 2. .populate("user", "name email") swaps the User ID for the actual Name and Email
    const reservations = await Reservation.find({ event: eventId }).populate(
      "user",
      "name email",
    );

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Error fetching student list" });
  }
};
// adminController.js

export const getPastEvents = async (req, res) => {
  try {
    // We remove .populate() because the data is now inside the snapshot objects
    const archives = await PastEvent.find().sort({ createdAt: -1 });

    // Important: Your frontend expects { data: [...] }
    res.status(200).json({
      success: true,
      data: archives,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch archives" });
  }
};

export const getPastEventDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // We remove .populate() here too.
    // All details (user names, emails, event title) are already inside the snapshots.
    const details = await PastEvent.findById(id);

    if (!details) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading details" });
  }
};
