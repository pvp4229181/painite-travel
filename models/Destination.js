import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: String,
    heroLine: String,
    homeLine: String,
    scene: String,
    cardScene: String,
    homeScene: String,
    introTitle: String,
    introText: String,
    quote: String,
    bestTime: String,
    experiences: [{ type: String, lowercase: true }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);
