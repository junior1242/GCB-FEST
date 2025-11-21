const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));


app.use(errorHandler);

module.exports = app;
