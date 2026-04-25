import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    date: { type: String, required: true }, 

    time: { type: String, required: true },

    location: { type: String, required: true },

    targetDepartment: { type: String, default: ""},

    maxSeats: { type: Number, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: {
      type: String, 
      default: null,
    },

    imagePublicId: {
      type: String, 
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);


export default mongoose.model("Event", eventSchema);

