import { cancellationTemplate } from "../templates/deleteEventEmailTemplates.js";
import { getNewEventTemplate } from "../templates/newEventTemplate.js";
import { updateEventTemplate } from "../templates/updateEventTemplate.js";
import PastEvent from "../models/PastEvent.js";
import { sendEmail } from "../utils/sendEmail.js";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE EVENT (Admin Only)

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      date,
      time,
      location,
      maxSeats,
      targetDepartment, // Destructure the new field
    } = req.body;

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
      targetDepartment: targetDepartment || "", // Save department (empty string means All)
      image: imageUrl,
      imagePublicId,
      createdBy: req.user.id,
    });

    // 2. Build the query to find students
    let studentQuery = { role: "student" };

    // If a specific department is mentioned and it's not "All Departments" (empty string)
    if (targetDepartment && targetDepartment !== "") {
      studentQuery.department = targetDepartment;
    }

    // 3. Find target students
    const students = await User.find(studentQuery).select("email");
    const emailList = students.map((s) => s.email);

    if (emailList.length > 0) {
      const html = getNewEventTemplate({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
      });

      // Send to the filtered email list
      sendEmail({
        email: emailList,
        subject: `New Event: ${event.title}`,
        message: html,
      }).catch((err) => console.error("Broadcast Email Error:", err));
    }

    res.status(201).json({
      message: targetDepartment
        ? `Event created and ${targetDepartment} students notified`
        : "Event created and all students notified",
      event,
    });
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

// export const getEventById = async (req, res, next) => {
//   try {
//     const event = await Event.findById(req.params.id).populate("category");

//     if (!event) {
//       const err = new Error("Event not found");
//       err.statusCode = 404;
//       return next(err);
//     }

//     res.json(event);
//   } catch (error) {
//     next(error);
//   }
// };

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
    const reservations = await Reservation.find({ event: event._id }).populate(
      "user",
    );

    const emailPromises = reservations.map((booking) => {
      if (booking.user && booking.user.email) {
        const html = updateEventTemplate({
          name: booking.user.name,
          eventTitle: event.title,
          eventDate: new Date(event.date).toDateString(),
        });

        return sendEmail({
          email: booking.user.email,
          subject: `Update Notice: ${event.title}`,
          message: html,
        });
      }
    });

    // Send all emails in parallel (using allSettled so one failed email doesn't stop the rest)
    await Promise.allSettled(emailPromises);

    // 4. Respond to the admin
    res.json({
      message: "Event updated and registered students notified successfully.",
      event,
    });
  } catch (error) {
    next(error);
  }
};
// export const deleteEvent = async (req, res, next) => {
//   try {
//     const id = req.params.id;

//     // 1. Find the event
//     const event = await Event.findById(id);
//     if (!event) {
//       const err = new Error("Event not found");
//       err.statusCode = 404;
//       return next(err);
//     }

//     // 2. Find all reservations to get student names and emails
//     const reservations = await Reservation.find({ event: id }).populate("user");

//     // 3. Process the emails
//     const emailPromises = reservations.map((booking) => {
//       if (booking.user && booking.user.email) {
//         // Prepare the personalized HTML for this specific student
//         const html = cancellationTemplate({
//           name: booking.user.name,
//           eventTitle: event.title,
//           eventDate: new Date(event.date).toDateString(),
//         });

//         return sendEmail({
//           email: booking.user.email,
//           subject: "Event Cancellation Notice",
//           message: html,
//         });
//       }
//     });

//     // Send all emails in parallel
//     await Promise.allSettled(emailPromises);

//     // 4. Clean up Cloudinary and DB
//     if (event.imagePublicId) {
//       await cloudinary.uploader.destroy(event.imagePublicId);
//     }

//     await Reservation.deleteMany({ event: id });
//     await Event.findByIdAndDelete(id);

//     res.json({
//       message: "Event deleted and students notified successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getMyPastEvents = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split("T")[0];

    // --- PART 1: GET ARCHIVED EVENTS ---
    // Look for PastEvents where the student's ID is in the registrationsSnapshot
    const archivedRecords = await PastEvent.find({
      "registrationsSnapshot.user": userId,
    }).sort({ "eventSnapshot.date": -1 });

    // Format archived data to look like regular events
    const archivedData = archivedRecords.map((record) => {
      // Find this specific student's registration status from the snapshot
      const myRegistration = record.registrationsSnapshot.find(
        (r) => r.user.toString() === userId.toString(),
      );

      return {
        ...record.eventSnapshot,
        attendanceStatus: myRegistration
          ? myRegistration.attendanceStatus
          : "N/A",
        isArchived: true, // Tag to identify it's from history
      };
    });

    // --- PART 2: GET ACTIVE PAST EVENTS (NOT YET CRON-JOBBED) ---
    // This handles events that finished today but the 2:31 AM cron hasn't run yet
    const activeReservations = await Reservation.find({
      user: userId,
    }).populate("event");

    const activePastData = activeReservations
      .filter((resv) => resv.event && resv.event.date < todayStr)
      .map((resv) => ({
        ...resv.event.toObject(),
        attendanceStatus: resv.attendanceStatus,
        isArchived: false,
      }));

    // --- PART 3: COMBINE BOTH ---
    const allPastEvents = [...activePastData, ...archivedData];

    res.status(200).json({
      success: true,
      count: allPastEvents.length,
      data: allPastEvents,
    });
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

    // 2. Check for existing reservations
    const reservationCount = await Reservation.countDocuments({ event: id });

    if (reservationCount > 0) {
      const err = new Error(
        `Cannot delete event: There are ${reservationCount} active reservation(s).`,
      );
      err.statusCode = 400;
      return next(err);
    }

    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }
    await Event.findByIdAndDelete(id);

    res.json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
