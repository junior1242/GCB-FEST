const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
    },
    userType: { type: String, enum: ["Admin", "Student"], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["sent", "read"], default: "sent" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
