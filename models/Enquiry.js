import mongoose from "mongoose";

export const ENQUIRY_STATUSES = ["new", "contacted", "proposal", "booked", "closed"];

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: String,
    destination: String,
    journey: String,
    dates: String,
    travellers: String,
    style: String,
    interests: [String],
    message: String,
    status: { type: String, enum: ENQUIRY_STATUSES, default: "new", index: true },
    notes: String,
    emailDelivered: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
