import mongoose from "mongoose";

const RegionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    destination: { type: String, required: true, lowercase: true, index: true },
    line: String,
    scene: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

RegionSchema.index({ destination: 1, slug: 1 }, { unique: true });

export default mongoose.models.Region || mongoose.model("Region", RegionSchema);
