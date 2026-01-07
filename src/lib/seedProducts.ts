import Product from "@/models/Product";
import Store from "@/models/Store";
import { connectDB } from "./mongodb";

export async function seedProducts() {
  await connectDB();

  let store = await Store.findOne({ slug: "mm-souvenirs" });

  if (!store) {
    store = await Store.create({
      name: "M&M Souvenirs",
      slug: "mm-souvenirs",
      location: "Rua de Santa Catarina, Porto",
    });
  }

  await Product.deleteMany({}); // Clear existing products

  const products = [
    {
      title: "Azulejo Ceramic Tile",
      slug: "azulejo-ceramic-tile",
      price: 12.5,
      category: "ceramics",
      tags: ["porto", "traditional", "tile"],
      stock: 50,
      storeId: store._id,
      images: ["https://via.placeholder.com/300x200?text=Azulejo"],
    },
    {
      title: "Port Wine Notebook",
      slug: "port-wine-notebook",
      price: 9.9,
      category: "stationery",
      tags: ["wine", "gift"],
      stock: 40,
      storeId: store._id,
      images: ["https://via.placeholder.com/300x200?text=Notebook"],
    },
  ];

  for (const p of products) {
    await Product.updateOne({ slug: p.slug }, p, { upsert: true });
  }

  console.log("✅ Products seeded");
}
