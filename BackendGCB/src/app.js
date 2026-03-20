import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
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

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);

export default app;
