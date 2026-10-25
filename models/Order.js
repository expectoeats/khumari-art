import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, default: "" },
    customerAddress: { type: String, default: "" },

    artworkId: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork" },
    artworkTitle: { type: String, required: true },
    artworkImage: { type: String, default: "" },

    quantity: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: { type: String, default: "" },
    paymentId: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);