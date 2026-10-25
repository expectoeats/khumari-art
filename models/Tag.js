import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    color: { type: String, default: "#C9A96E" },
  },
  { timestamps: true }
);

TagSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);