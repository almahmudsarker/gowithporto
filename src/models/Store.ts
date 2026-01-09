import mongoose, { Document, Schema, models } from "mongoose";

export interface IStore extends Document {
  name: string;
  slug: string;
  location: string;
  active: boolean;

  // 🔐 Store Owner Auth
  storeCode: string;
  passwordHash: string;
  role: "STORE_OWNER";

  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    active: { type: Boolean, default: true },

    // 🔐 Store Owner Auth
    storeCode: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "STORE_OWNER" },
  },
  { timestamps: true }
);

export default models.Store || mongoose.model<IStore>("Store", StoreSchema);
