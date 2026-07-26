import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { overallLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// import "./cron/deleteOldEvents.js";
import "./cron/remainderJob.js";
import "./cron/archieveCron.js";
const app = express();

const allowedOrigins = [
  "https://gcb-fest-frontend.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(errorHandler);
app.use(overallLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);

app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);

export default app;
