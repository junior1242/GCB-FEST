// utils/archiveCron.js
import cron from "node-cron";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import PastEvent from "../models/PastEvent.js";

cron.schedule("0 0 * * *", async () => {
  console.log("--- Starting Archive & Delete Job ---");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Find expired events that haven't been archived yet
    const expiredEvents = await Event.find({
      date: { $lt: todayStr },
      isArchived: false,
    }).session(session);

    if (expiredEvents.length === 0) {
      console.log("No events to archive.");
      await session.commitTransaction();
      return;
    }

    for (const event of expiredEvents) {
      // 2. Fetch registrations for this event
      // We only need the ID and attendanceStatus for stats
      const registrations = await Reservation.find({ event: event._id })
        .select("_id attendanceStatus")
        .lean()
        .session(session);

      const totalRegistered = registrations.length;
      const totalArrived = registrations.filter(
        (r) => r.attendanceStatus === "Arrived",
      ).length;

      const stats = {
        totalRegistered: totalRegistered,
        totalArrived: totalArrived,
        totalAbsent: totalRegistered - totalArrived,
      };

      // 3. Create the Archive Record in PastEvent
      // IMPORTANT: Your current schema uses Refs. These will point to null once deleted.
      await PastEvent.create(
        [
          {
            event: event._id,
            registrations: registrations.map((r) => r._id),
            stats,
          },
        ],
        { session },
      );

      // 4. DELETE original Reservations associated with this event
      await Reservation.deleteMany({ event: event._id }).session(session);

      // 5. DELETE the original Event
      await Event.findByIdAndDelete(event._id).session(session);

      console.log(`Archived & Deleted Event: ${event._id}`);
    }

    // Commit all changes
    await session.commitTransaction();
    console.log(`Successfully processed ${expiredEvents.length} events.`);
  } catch (err) {
    // If anything fails, nothing is deleted and nothing is archived
    await session.abortTransaction();
    console.error("Archive Error - Changes Rolled Back:", err);
  } finally {
    session.endSession();
    console.log("--- Job Finished ---");
  }
});
