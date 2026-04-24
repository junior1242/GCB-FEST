import mongoose from "mongoose";
const pastEventSchema = new mongoose.Schema(
  {
    // Store the event data as a plain object, NOT a reference
    eventSnapshot: {
      type: Object,
      required: true,
    },
    registrationsSnapshot: [Object],
    stats: {
      totalRegistered: Number,
      totalArrived: Number,
      totalAbsent: Number,
    },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const PastEvent = mongoose.model("PastEvent", pastEventSchema);
export default PastEvent;