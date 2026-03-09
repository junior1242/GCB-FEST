import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../utils/sendEmail.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cancellationTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/cancellationTemplate.html"),
  "utf-8",
);

// CREATE EVENT (Admin Only)
export const createEvent = async (req, res, next) => {
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
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("category");
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc Get all events with remaining seats count
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("category", "name");

    // Calculate remaining seats for each event
    const eventsWithSeats = await Promise.all(
      events.map(async (event) => {
        const bookedCount = await Reservation.countDocuments({ event: event._id });
        return {
          ...event._doc,
          remainingSeats: event.maxSeats - bookedCount,
        };
      })
    );

    res.status(200).json(eventsWithSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE EVENT
export const getEventById = async (req, res, next) => {
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
export const updateEvent = async (req, res, next) => {
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
export const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;

    const event = await Event.findById(id);
    if (!event) {
      const err = new Error("Event not found");
      err.statusCode = 404;
      return next(err);
    }

    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    const reservations = await Reservation.find({ event: id }).populate("user");

    for (let booking of reservations) {
      const html = cancellationTemplate
        .replace("{{name}}", booking.user.name)
        .replace("{{eventTitle}}", event.title)
        .replace("{{eventDate}}", event.date);

      await sendEmail(booking.user.email, "Event Cancellation Notice", html);
    }

    //  Remove event
    await Event.findByIdAndDelete(id);

    //  Remove all bookings
    await Reservation.deleteMany({ event: id });

    res.json({
      message: "Event deleted, image removed, emails sent",
    });
  } catch (error) {
    next(error);
  }
};
