const express = require("express");
const cors = require("cors"); // <-- import cors
const app = express();
const errorHandler = require("./middleware/errorHandler");

// 1️⃣ CORS middleware (must be BEFORE routes)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true, // allow cookies/jwt if needed
  }),
);

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));

app.use(errorHandler);

module.exports = app;
