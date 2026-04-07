import { Schema, model, models } from "mongoose";

const WebsiteSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  vibe: { type: String, default: "sleek" },
  html: { type: String, required: true },
  css: { type: String },
  js: { type: String },
  assets: [{ url: String, type: String }],
}, { timestamps: true });

const Website = models.Website || model("Website", WebsiteSchema);

export default Website;
