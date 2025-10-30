const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roll_no: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
