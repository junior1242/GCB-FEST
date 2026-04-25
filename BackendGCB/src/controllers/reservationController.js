import { sendEmail } from "../utils/sendEmail.js";
import { registrationTemplate } from "../templates/registerEventTemplate.js";
import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Reservation.find()
      // 1. Populate the event details
      .populate("event", "title date time location")
      // 2. Populate the user details (student name and email)
      .populate("user", "name email")
      // 3. Sort by newest first
      .sort({ createdAt: -1 });

    // The 'status' and 'attendanceStatus' are part of the Reservation object
    // so they are automatically included in the JSON response.
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching all registrations:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id || req.user?._id; // Try both common names


    const reservation = await Reservation.findById(id).populate("event");

    if (!reservation) {
      console.log("FAILED: No reservation found with this ID");
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found in DB" });
    }

    console.log("Reservation Owner in DB:", reservation.user.toString());

    if (reservation.user.toString() !== userId.toString()) {
      console.log("FAILED: ID Mismatch");
      return res
        .status(404)
        .json({ success: false, message: "Not authorized (ID mismatch)" });
    }

    // 2. If re-confirming, check if event is full
    if (status === "confirmed" && reservation.status !== "confirmed") {
      const activeCount = await Reservation.countDocuments({
        event: reservation.event._id,
        status: "confirmed",
      });
      if (activeCount >= reservation.event.maxSeats) {
        return res
          .status(400)
          .json({ success: false, message: "Event is now full!" });
      }
    }

    const updated = await Reservation.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true },
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
