import { Schema, model, models } from "mongoose";

const GlobalConfigSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "AI_SETTINGS", "PLATFORM_SETTINGS"
    value: { type: Schema.Types.Mixed }, // Flexible JSON storage
  },
  { timestamps: true }
);

export default models.GlobalConfig || model("GlobalConfig", GlobalConfigSchema);
