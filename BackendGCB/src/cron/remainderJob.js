import cron from "node-cron";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getReminderTemplate } from "../utils/reminderTemplate.js";

cron.schedule("0 9 * * *", async () => {
  console.log("Running: Daily Event Reminder Job...shahid");

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0"); 
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const tomorrowString = `${year}-${month}-${day}`;
    console.log(`Searching for events on date: ${tomorrowString}`);
    const events = await Event.find({ date: tomorrowString });

    if (events.length === 0) {
      console.log("No events found for:", tomorrowString);
      return;
    }

    for (let event of events) {
      const reservations = await Reservation.find({
        event: event._id,
      }).populate("user");

      console.log(
        `Found ${reservations.length} reservations for ${event.title}`,
      );

      const emailPromises = reservations.map((booking) => {
        if (!booking.user || !booking.user.email) return Promise.resolve();

        
        const html = getReminderTemplate({
          name: booking.user.name,
          eventTitle: event.title,
          eventDate: event.date, 
          eventTime: event.time, 
          eventLocation: event.location,
        });

        return sendEmail({
          email: booking.user.email,
          subject: `Reminder: ${event.title} is Tomorrow!`,
          message: html,
        }).catch((err) =>
          console.error(`Email failed for ${booking.user.email}:`, err),
        );
      });

      await Promise.all(emailPromises);
    }

    console.log("All reminders for tomorrow have been processed.");
  } catch (error) {
    console.error("Error in Cron Job:", error);
  }
});
