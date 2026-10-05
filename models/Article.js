import mongoose from "mongoose";
import GalleryItemSchema from "./GalleryItem.js";

// A journal article. `body` is stored as an array of paragraphs.
const ArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: String,
    date: { type: String, required: true }, // YYYY-MM-DD
    readTime: String,
    scene: String,
    gallery: [GalleryItemSchema],
    excerpt: String,
    body: [String],
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);
