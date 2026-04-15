import mongoose from "mongoose";

const pastEventSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    registrations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    ],
    stats: {
      totalRegistered: Number,
      totalArrived: Number,
      totalAbsent: Number,
    },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("PastEvent", pastEventSchema);
