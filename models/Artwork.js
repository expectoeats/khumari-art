import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    artist:   { type: String, default: "Nancy Sikri" },
    medium:   { type: String, required: true },
    category: { type: String, enum: ["Paintings", "Prints", "Photography"], required: true },
    year:     { type: Number, required: true },
    size:     { type: String },
    color:    { type: String },
    desc:     { type: String },
    src:      { type: String, required: true },   // image path or URL
    featured: { type: Boolean, default: false },
    sold:     { type: Boolean, default: false },
    order:    { type: Number, default: 0 },       // for manual sorting
    images:   [{ src: String, alt: String, isPrimary: { type: Boolean, default: false } }],
    tags:     [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Artwork ||
  mongoose.model("Artwork", ArtworkSchema);
