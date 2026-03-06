import cron from 'node-cron';
import Event from "../models/Event.js";
import Reservation from "../models/Reservation.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/sendEmail.js";

// Load reminder HTML template
const templatePath = path.join(__dirname, "../templates/reminderTemplate.html");
const reminderTemplate = fs.readFileSync(templatePath, "utf-8");

// Run every day at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running: Daily Event Reminder Job...");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  const events = await Event.find({ date: tomorrowDate });

  for (let event of events) {
    const reservations = await Reservation.find({ event: event._id }).populate(
      "user"
    );

    for (let booking of reservations) {
      const html = reminderTemplate
        .replace("{{name}}", booking.user.name)
        .replace("{{eventTitle}}", event.title)
        .replace("{{eventDate}}", event.date)
        .replace("{{eventTime}}", event.time)
        .replace("{{eventLocation}}", event.location);

      await sendEmail(
        booking.user.email,
        "Reminder: Your Event is Tomorrow",
        html
      );
    }
  }
});
