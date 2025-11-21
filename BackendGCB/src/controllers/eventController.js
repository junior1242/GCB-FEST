const Event = require("../models/Event");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/sendEmail");

// Load cancellation email template
const cancellationTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/cancellationTemplate.html"),
  "utf-8"
);

// CREATE EVENT (Admin Only)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, category, description, date, time, location, maxSeats } =
      req.body;

    // Cloudinary uploaded image
    const imageUrl = req.file ? req.file.path : null;
    const imagePublicId = req.file ? req.file.filename : null;

    const event = await Event.create({
      title,
      category,
      description,
      date,
      time,
      location,
      maxSeats,
      image: imageUrl,
      imagePublicId,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    next(error);
  }
};

// GET ALL EVENTS
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("category");
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE EVENT
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate("category");

    if (!event) {
      const err = new Error("Event not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

// UPDATE EVENT (Admin Only)
exports.updateEvent = async (req, res, next) => {
  try {
    const imageUrl = req.file ? req.file.path : undefined;
    const imagePublicId = req.file ? req.file.filename : undefined;

    const updatedData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
      ...(imagePublicId && { imagePublicId }),
    };

    const event = await Event.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!event) {
      const err = new Error("Event not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: "Event updated", event });
  } catch (error) {
    next(error);
  }
};

// DELETE EVENT (Admin Only)
exports.deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;

    const event = await Event.findById(id);
    if (!event) {
      const err = new Error("Event not found");
      err.statusCode = 404;
      return next(err);
    }

    // 1️⃣ Delete image from Cloudinary
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    // 2️⃣ Find all reservations for this event
    const reservations = await Reservation.find({ event: id }).populate("user");

    // 3️⃣ Send cancellation emails
    for (let booking of reservations) {
      const html = cancellationTemplate
        .replace("{{name}}", booking.user.name)
        .replace("{{eventTitle}}", event.title)
        .replace("{{eventDate}}", event.date);

      await sendEmail(booking.user.email, "Event Cancellation Notice", html);
    }

    // 4️⃣ Remove event
    await Event.findByIdAndDelete(id);

    // 5️⃣ Remove all bookings
    await Reservation.deleteMany({ event: id });

    res.json({
      message: "Event deleted, image removed, emails sent",
    });
  } catch (error) {
    next(error);
  }
};
