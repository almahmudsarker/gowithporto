import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    description: { type: String },
    price: { type: Number, required: true },

    currency: { type: String, default: "EUR" },

    images: [{ type: String }],

    category: {
      type: String,
      enum: ["ceramics", "wine", "textile", "stationery", "souvenir"],
      required: true,
    },

    tags: [{ type: String }], // for AI + filtering

    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    stock: { type: Number, default: 0 },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);
