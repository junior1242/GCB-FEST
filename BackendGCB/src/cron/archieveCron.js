// utils/archiveCron.js
import cron from "node-cron";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import PastEvent from "../models/PastEvent.js";
import User from "../models/User.js"; // <--- 1. MUST BE IMPORTED

cron.schedule("0 0 * * *", async () => {
  console.log("Starting Archive & Delete Job");

  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const allEvents = await Event.find({});
    const expiredEvents = allEvents.filter((event) => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return !isNaN(eventDate.getTime()) && eventDate < now;
    });

    if (expiredEvents.length === 0) return console.log("No events to archive.");

    for (const event of expiredEvents) {
      try {
        // 2. We populate with EXPLICIT model reference
        const registrations = await Reservation.find({ event: event._id })
          .populate({
            path: "user",
            model: "User", // Explicitly naming the model
            select: "name email rollNumber department", // Make sure these fields exist in your User.js
          })
          .lean();

        // 3. Create the archive
        await PastEvent.create({
          eventSnapshot: event.toObject(),
          registrationsSnapshot: registrations,
          stats: {
            totalRegistered: registrations.length,
            totalArrived: registrations.filter(
              (r) => r.attendanceStatus === "Arrived",
            ).length,
            totalAbsent:
              registrations.length -
              registrations.filter((r) => r.attendanceStatus === "Arrived")
                .length,
          },
          completedAt: new Date(),
        });

        // 4. Delete active data
        await Reservation.deleteMany({ event: event._id });
        await Event.findByIdAndDelete(event._id);

        console.log(`Archived successfully: ${event.title}`);
      } catch (innerErr) {
        console.error(`Error processing ${event._id}:`, innerErr);
      }
    }
  } catch (err) {
    console.error("Global Cron Error:", err);
  }
});
