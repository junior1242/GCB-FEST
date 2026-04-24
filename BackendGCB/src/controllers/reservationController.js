import { sendEmail } from "../utils/sendEmail.js";
import { registrationTemplate } from "../templates/registerEventTemplate.js";
import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

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

export const getMyBookings = async (req, res) => {
  try {
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
    if (!user) return res.status(404).json({ message: "User not found" });

    // --- NEW: DEPARTMENT VALIDATION LOGIC ---
    // Check if the event is restricted to a specific department
    // and if the user's department matches it.
    if (
      event.targetDepartment &&
      event.targetDepartment !== "Open" &&
      event.targetDepartment !== user.department
    ) {
      return res.status(403).json({
        message: `Registration failed. This event is restricted to the ${event.targetDepartment} department student only`,
      });
    }
    // ----------------------------------------

    const bookedCount = await Reservation.countDocuments({ event: eventId });
    if (bookedCount >= event.maxSeats) {
      return res.status(400).json({ message: "No seats remaining." });
    }

    const reservation = new Reservation({ event: eventId, user: userId });
    await reservation.save();

    const [hours, minutes] = event.time.split(":");
    const hourInt = parseInt(hours);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const displayHour = hourInt % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;

    const emailHtml = registrationTemplate({
      name: user.name,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: formattedTime,
      eventLocation: event.location || "Main Campus Hall",
    });

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
