import mongoose from "mongoose";

// One photo or video in a content item's gallery (uploaded through the admin).
const GalleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    caption: String,
  },
  { _id: false },
);

export default GalleryItemSchema;
