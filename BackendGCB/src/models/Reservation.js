import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Prevent a student from registering for the same event twice
reservationSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Reservation", reservationSchema);