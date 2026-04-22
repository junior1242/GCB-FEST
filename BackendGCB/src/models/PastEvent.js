const pastEventSchema = new mongoose.Schema(
  {
    // Store the event data as a plain object, NOT a reference
    eventSnapshot: {
      type: Object,
      required: true,
    },
    // Store the registration data as plain objects
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
