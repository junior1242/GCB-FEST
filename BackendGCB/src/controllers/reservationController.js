import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";

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
    const bookings = await Reservation.find({ user: req.user.id }).populate("event");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// 3. REGISTRATION LOGIC: Check seats before saving (Agenda Item #4)
export const createReservation = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    const bookedCount = await Reservation.countDocuments({ event: eventId });

    if (bookedCount >= event.maxSeats) {
      return res
        .status(400)
        .json({ message: "No seats remaining for this event." });
    }

    const reservation = new Reservation({ event: eventId, user: userId });
    await reservation.save();

    // We will add the Email trigger here in Step 5 later
    res.status(201).json({ message: "Successfully registered", reservation });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event." });
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