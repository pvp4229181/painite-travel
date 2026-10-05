import mongoose from "mongoose";
import GalleryItemSchema from "./GalleryItem.js";

// A Service is a signature experience: heritage, wildlife, wellness, etc.
const ServiceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    line: String,
    body: String,
    moments: [String],
    scene: String,
    video: String,
    gallery: [GalleryItemSchema],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
