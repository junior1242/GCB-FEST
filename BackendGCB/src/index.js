import dotenv from "dotenv";
import app from "./app.js";
import {connectDB} from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

// import("./cron/reminderJob");
// import("./cron/deleteOldEvents");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
