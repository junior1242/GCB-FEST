import {sendEmail} from "../utils/sendEmail.js";
import { registrationTemplate } from "../utils/registerEventTemplate.js";
import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

// 1. FOR ADMIN: View all registrations (Agenda Item #1)
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Reservation.find()
      .populate("event", "title date time location")
      .populate("user", "name email");
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. FOR STUDENT: View "My Bookings" (Agenda Item #2)
export const getMyBookings = async (req, res) => {
  try {
    // req.user.id comes from the login token
    const bookings = await Reservation.find({ user: req.user.id }).populate(
      "event",
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};



export const createReservation = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const bookedCount = await Reservation.countDocuments({ event: eventId });
    if (bookedCount >= event.maxSeats) {
      return res.status(400).json({ message: "No seats remaining." });
    }

    const reservation = new Reservation({ event: eventId, user: userId });
    await reservation.save();

    // --- PREPARE DATA FOR TEMPLATE ---
    const dateObj = new Date(event.date);

    const emailHtml = registrationTemplate({
      name: user.name,
      eventTitle: event.title,
      eventDate: dateObj.toLocaleDateString(), // e.g. "10/24/2023"
      eventTime: dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // e.g. "02:00 PM"
      eventLocation: event.location || "Main Campus Hall",
    });

    // --- SEND EMAIL ---
    try {
      await sendEmail({
        email: user.email,
        subject: `Confirmation: ${event.title}`,
        message: emailHtml,
      });
    } catch (err) {
      console.error("Email failed to send", err);
    }

    res.status(201).json({ message: "Successfully registered", reservation });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already registered." });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reservations for the logged-in student
// @route   GET /api/reservations/my-bookings
// THIS IS THE MISSING EXPORT
// export const getMyReservations = async (req, res, next) => {
//   try {
//     const userId = req.user?._id || req.user?.id;

//     // Find reservations and "populate" the event details so we see titles, dates, etc.
//     const reservations = await Reservation.find({ user: userId })
//       .populate("event")
//       .sort("-createdAt"); // Show newest first

//     res.status(200).json(reservations);
//   } catch (error) {
//     next(error);
//   }
// };
