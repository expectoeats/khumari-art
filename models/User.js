import mongoose from "mongoose";
import bcrypt    from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
    password:  { type: String, required: true },
    wishlist:  [{ type: String }], // artwork IDs (mongo _id strings)
    avatar:    { type: String, default: "" },
    phone:     { type: String, default: "" },
    whatsapp:  { type: String, default: "" },
    address:   { type: String, default: "" },
    city:      { type: String, default: "" },
    country:   { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Never expose password
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
