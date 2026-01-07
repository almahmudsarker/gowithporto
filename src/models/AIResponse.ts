import mongoose, { Schema } from "mongoose";

const AIResponseSchema = new Schema(
  {
    userEmail: { type: String, required: true, index: true },
    prompt: { type: Object, required: true },
    response: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AIResponse ||
  mongoose.model("AIResponse", AIResponseSchema);
