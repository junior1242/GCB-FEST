import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { overallLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; 
// import "./cron/deleteOldEvents.js";  //* This line ensures the cron job for deleting old events runs in the background  
// import "./cron/remainderJob.js";   //* uncomment this line to use the cron job for sending reminder
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(errorHandler);
app.use(overallLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);

export default app;
