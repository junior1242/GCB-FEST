import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";

// @desc    Register a student for an event
// @route   POST /api/reservations/register
export const createReservation = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Check if student is already registered
    const existing = await Reservation.findOne({ event: eventId, user: userId });
    if (existing) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // 3. Check seat availability
    const count = await Reservation.countDocuments({ event: eventId });
    if (count >= event.maxSeats) {
      return res.status(400).json({ message: "This event is fully booked" });
    }

    // 4. Create Reservation
    const reservation = await Reservation.create({ 
      event: eventId, 
      user: userId 
    });

    res.status(201).json({ 
      message: "Successfully registered!", 
      reservation 
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }
    next(error);
  }
};

// @desc    Get all reservations for the logged-in student
// @route   GET /api/reservations/my-bookings
// THIS IS THE MISSING EXPORT
export const getMyReservations = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;

    // Find reservations and "populate" the event details so we see titles, dates, etc.
    const reservations = await Reservation.find({ user: userId })
      .populate("event")
      .sort("-createdAt"); // Show newest first

    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};