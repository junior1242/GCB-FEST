import { cancellationTemplate } from "../templates/deleteEventEmailTemplates.js";
import { getNewEventTemplate } from "../templates/newEventTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE EVENT (Admin Only)

export const createEvent = async (req, res, next) => {
  try {
    const { title, category, description, date, time, location, maxSeats } =
      req.body;

    // Cloudinary uploaded image
    const imageUrl = req.file ? req.file.path : null;
    const imagePublicId = req.file ? req.file.filename : null;

    // 1. Create the event in the Database
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

    const students = await User.find({ role: "student" }).select("email");
    const emailList = students.map((s) => s.email);
    if (emailList.length > 0) {
      const html = getNewEventTemplate({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
      });

      // Send to all students using BCC for privacy
      // We don't 'await' this so the Admin doesn't have to wait for 100s of emails to send
      sendEmail({
        email: emailList,
        subject: `New Event: ${event.title}`,
        message: html,
      }).catch((err) => console.error("Broadcast Email Error:", err));
    }

    res
      .status(201)
      .json({ message: "Event created and students notified", event });
  } catch (error) {
    next(error);
  }
};


export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("category");
    res.json(events);
  } catch (error) {
    next(error);
  }
};


export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("category", "name");

    // Calculate remaining seats for each event
    const eventsWithSeats = await Promise.all(
      events.map(async (event) => {
        const bookedCount = await Reservation.countDocuments({
          event: event._id,
        });
        return {
          ...event._doc,
          remainingSeats: event.maxSeats - bookedCount,
        };
      }),
    );

    res.status(200).json(eventsWithSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;

    // 1. Find the event
    const event = await Event.findById(id);
    if (!event) {
      const err = new Error("Event not found");
      err.statusCode = 404;
      return next(err);
    }

    // 2. Find all reservations to get student names and emails
    const reservations = await Reservation.find({ event: id }).populate("user");

    // 3. Process the emails
    const emailPromises = reservations.map((booking) => {
      if (booking.user && booking.user.email) {
        // Prepare the personalized HTML for this specific student
        const html = cancellationTemplate({
          name: booking.user.name,
          eventTitle: event.title,
          eventDate: new Date(event.date).toDateString(),
        })

  
        return sendEmail({
          email: booking.user.email,
          subject: "Event Cancellation Notice",
          message: html,
        });
      }
    });

    // Send all emails in parallel
    await Promise.allSettled(emailPromises);

    // 4. Clean up Cloudinary and DB
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    await Reservation.deleteMany({ event: id });
    await Event.findByIdAndDelete(id);

    res.json({
      message: "Event deleted and students notified successfully.",
    });
  } catch (error) {
    next(error);
  }
};
