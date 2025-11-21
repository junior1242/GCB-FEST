const cron = require("node-cron");
const Event = require("../models/Event");
const Reservation = require("../models/Reservation");

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily auto-delete old events job...");

  const today = new Date().toISOString().split("T")[0];

  try {
    // Find events older than today
    const oldEvents = await Event.find({ date: { $lt: today } });

    for (let event of oldEvents) {
      console.log("Deleting expired event:", event.title);

      // Delete all reservations for this event
      await Reservation.deleteMany({ event: event._id });

      // Delete the event
      await Event.findByIdAndDelete(event._id);
    }

    console.log("Old events cleanup completed.");
  } catch (error) {
    console.log("Error in auto-delete job:", error);
  }
});
