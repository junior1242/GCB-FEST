const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Event = require("../models/Event");

// BOOK AN EVENT
exports.bookEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // 1️⃣ Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      const err = new Error("Event not found");
      err.statusCode = 404;
      return next(err);
    }

    // 2️⃣ Check seat availability
    const totalBookings = await Reservation.countDocuments({ event: eventId });
    if (totalBookings >= event.maxSeats) {
      const err = new Error("Event is fully booked");
      err.statusCode = 400;
      return next(err);
    }

    // 3️⃣ Prevent double booking
    const alreadyBooked = await Reservation.findOne({
      user: userId,
      event: eventId,
    });
    if (alreadyBooked) {
      const err = new Error("You already booked this event");
      err.statusCode = 400;
      return next(err);
    }

    // 4️⃣ Create reservation
    const reservation = await Reservation.create({
      user: userId,
      event: eventId,
    });

    const user = await User.findById(userId);

    // 5️⃣ Send booking email
    await sendEmail(
      user.email,
      "Event Booking Confirmation",
      `You have successfully booked your seat for: ${event.title}`
    );

    res.status(201).json({
      message: "Event booked successfully",
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

// GET USER BOOKINGS
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Reservation.find({ user: req.user.id }).populate(
      "event"
    );

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// CANCEL BOOKING
exports.cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    const reservation = await Reservation.findOneAndDelete({
      _id: bookingId,
      user: req.user.id,
    });

    if (!reservation) {
      const err = new Error("Booking not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    next(error);
  }
};
