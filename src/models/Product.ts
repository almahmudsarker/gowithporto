import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    images: [String],
    category: String,
    quantity: { type: Number, default: 0 },

    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);
