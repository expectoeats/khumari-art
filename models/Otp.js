import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["signup", "forgot-password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    userData: {
      type: Object, // { name, password } during signup
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 900, // MongoDB TTL index: automatically deletes document 15 minutes after creation
    },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
