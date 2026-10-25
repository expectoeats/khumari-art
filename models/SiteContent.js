import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true, index: true }, // e.g. "hero", "artist", "announcement", "story"
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);
