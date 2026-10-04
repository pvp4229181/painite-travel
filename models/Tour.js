import mongoose from "mongoose";

const DaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    title: { type: String, required: true },
    text: String,
    stay: String,
    scene: String,
  },
  { _id: false },
);

const TourSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    region: String,
    destinations: [{ type: String, lowercase: true, index: true }],
    days: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 0 },
    scene: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    summary: String,
    glance: {
      destinations: String,
      style: String,
      season: String,
      idealFor: String,
      accommodation: String,
    },
    introTitle: String,
    intro: String,
    itinerary: [DaySchema],
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Tour || mongoose.model("Tour", TourSchema);
