import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  sitesCount: { type: Number, default: 0 },
  maxSites: { type: Number, default: 5 },
  isPremium: { type: Boolean, default: false },
}, { timestamps: true });

const User = models.User || model("User", UserSchema);

export default User;
