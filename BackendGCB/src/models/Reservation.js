import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    seatNumber: {
      type: Number,
      required: true
    },

    attendanceStatus: {
      type: String,
      enum: ["pending", "yes", "no"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
