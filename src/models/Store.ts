import mongoose, { Schema, models } from "mongoose";

const StoreSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    ownerEmail: { type: String },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Store || mongoose.model("Store", StoreSchema);
