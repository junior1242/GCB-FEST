const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    reg_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
