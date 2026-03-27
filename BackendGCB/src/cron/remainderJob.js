import cron from "node-cron";
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getReminderTemplate } from "../templates/reminderTemplate.js";

// Runs every day at 00:00 (Midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Running: Daily Event Reminder Job for TODAY...");

  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    console.log(`Searching for events happening TODAY: ${todayString}`);

    const events = await Event.find({ date: todayString });

    if (events.length === 0) {
      console.log("No events scheduled for today:", todayString);
      return;
    }

    for (let event of events) {
      const reservations = await Reservation.find({
        event: event._id,
      }).populate("user");

      console.log(
        `Found ${reservations.length} students registered for today's event: ${event.title}`,
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
          subject: `Reminder: ${event.title} is Today!`, 
          message: html,
        }).catch((err) =>
          console.error(`Email failed for ${booking.user.email}:`, err),
        );
      });

      await Promise.all(emailPromises);
    }

    console.log("-> All today's reminders have been sent successfully.");
  } catch (error) {
    console.error("Error in Today's Reminder Cron Job:", error);
  }
});
