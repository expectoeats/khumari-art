import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);