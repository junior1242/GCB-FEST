// utils/archiveCron.js
import cron from "node-cron";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import PastEvent from "../models/PastEvent.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running Archive Cron Job ");
  try {
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0); 

    // 1. Find active events that happened before today
    const expiredEvents = await Event.find({
      date: { $lt: yesterday },
      isArchived: false,
    });

    for (const event of expiredEvents) {
      const registrations = await Reservation.find({ event: event._id });

      const stats = {
        totalRegistered: registrations.length,
        totalArrived: registrations.filter(
          (r) => r.attendanceStatus === "Arrived",
        ).length,
        totalAbsent: registrations.filter(
          (r) => r.attendanceStatus !== "Arrived",
        ).length,
      };

      // 2. Create Archive Record
      await PastEvent.create({
        event: event._id,
        registrations: registrations.map((r) => r._id),
        stats,
      });

      // 3. Mark original event as archived
      event.isArchived = true;
      await event.save();
    }
    console.log(`Cron Job: Archived ${expiredEvents.length} events.`);
  } catch (err) {
    console.error("Archive Error:", err);
  }
});
