import User from "../models/User.js";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";

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

<<<<<<< HEAD
<<<<<<< Updated upstream
export const getUnverifiedStudents = async (req, res) => {
=======
// Get all verified students waiting for admin approval
export const getPendingStudents = async (req, res, next) => {
>>>>>>> Stashed changes
=======
// export const getUnverifiedStudents = async (req, res) => {
//   try {
//     const students = await User.find({ role: "student", isVerified: false })
//       .select("name email createdAt")
//       .sort({ createdAt: -1 });
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const verifyStudent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await User.findByIdAndUpdate(id, { isVerified: true });
//     res.status(200).json({ message: "Student verified successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get all verified students waiting for admin approval
export const getPendingStudents = async (req, res, next) => {
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c
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

// Approve or Reject a student
// Approve or Reject a student
export const handleStudentStatus = async (req, res, next) => {
  try {
<<<<<<< HEAD
<<<<<<< Updated upstream
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isVerified: true });
    res.status(200).json({ message: "Student verified successfully" });
=======
    const { studentId, status } = req.body;

    if (status === "active") {
      const student = await User.findByIdAndUpdate(
        studentId,
        { status: "active" },
        { new: true },
      );

      if (!student)
        return res.status(404).json({ message: "Student not found" });
=======
    const { studentId, status } = req.body;

    if (status === 'active') {
      const student = await User.findByIdAndUpdate(
        studentId,
        { status: 'active' },
        { new: true }
      );
      
      if (!student) return res.status(404).json({ message: "Student not found" });
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c

      return res.status(200).json({
        success: true,
        message: "Student registration approved successfully!",
      });
<<<<<<< HEAD
    }

    if (status === "rejected") {
      const student = await User.findByIdAndDelete(studentId);

      if (!student)
        return res.status(404).json({ message: "Student not found" });
=======
    } 

    if (status === 'rejected') {
      const student = await User.findByIdAndDelete(studentId);
      
      if (!student) return res.status(404).json({ message: "Student not found" });
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c

      return res.status(200).json({
        success: true,
        message: "Student rejected and record removed from system.",
      });
    }

    res.status(400).json({ message: "Invalid status" });
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c
  } catch (error) {
    next(error);
  }
};
