import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    deviceInfo: {
      type: String, // Optional: tracking browser/OS details
      default: "Unknown Device",
    },
  },
  { timestamps: true },
);

export const Session = mongoose.model("Session", sessionSchema);
