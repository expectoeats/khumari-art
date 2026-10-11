import mongoose from "mongoose";

const ContentBlockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["paragraph", "quote", "heading", "image"], required: true },
    text: { type: String },
    src:  { type: String }, // for image blocks
  },
  { _id: false }
);

const BlogPostSchema = new mongoose.Schema(
  {
    slug:      { type: String, required: true, unique: true, trim: true },
    title:     { type: String, required: true, trim: true },
    category:  { type: String, required: true },
    excerpt:   { type: String, required: true },
    cover:     { type: String, required: true },
    content:   [ContentBlockSchema],
    readTime:  { type: String, default: "5 min" },
    published: { type: Boolean, default: false },
    views:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);
