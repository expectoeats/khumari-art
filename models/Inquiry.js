import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, trim: true },
    phone:      { type: String, default: "" },          // WhatsApp number
    message:    { type: String, required: true },
    artworkId:  { type: String },          // optional — which artwork
    artworkTitle: { type: String },
    status:     { type: String, enum: ["new", "read", "replied"], default: "new" },
    source:     { type: String, enum: ["contact_form", "artwork", "whatsapp"], default: "contact_form" },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry ||
  mongoose.model("Inquiry", InquirySchema);
