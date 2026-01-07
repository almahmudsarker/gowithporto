import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    image: String,
    credits: { type: Number, default: 0 },
    freeUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
