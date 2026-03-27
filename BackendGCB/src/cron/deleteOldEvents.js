import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import cron from "node-cron";

// Runs every day at 00:00 (Midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Running: Daily Auto-Delete Old Events Job...");

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;
    console.log(`Checking for events occurring before: ${todayString}`);

    const expiredEvents = await Event.find({
      date: { $lt: todayString },
    }).select("_id title");

    if (expiredEvents.length === 0) {
      console.log("No expired events found to clean up.");
      return;
    }
    const expiredIds = expiredEvents.map((event) => event._id);

    console.log(
      `Found ${expiredEvents.length} expired events. Starting cleanup...`,
    );
    const resResult = await Reservation.deleteMany({
      event: { $in: expiredIds },
    });
    const eventResult = await Event.deleteMany({
      _id: { $in: expiredIds },
    });

    console.log(`Cleanup Summary:`);
    console.log(`-> Events Deleted: ${eventResult.deletedCount}`);
    console.log(`-> Reservations Cleared: ${resResult.deletedCount}`);
    console.log("Cleanup job finished successfully.");
  } catch (error) {
    console.error("Error in Auto-Delete Cron Job:", error);
  }
});
