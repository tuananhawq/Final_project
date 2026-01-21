import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myapp_db";

// Old -> New logo URL mappings
const logoMappings = [
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Coca-Cola-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/800px-Coca-Cola_logo.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Pepsi-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/800px-Pepsi_logo_2014.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/06/Samsung-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/800px-Samsung_Logo.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/800px-Logo_NIKE.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/800px-Adidas_Logo.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/800px-McDonald%27s_Golden_Arches.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/800px-Starbucks_Corporation_Logo_2011.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Unilever-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Unilever_Logo.svg/800px-Unilever_Logo.svg.png"
  },
  {
    old: "https://logos-world.net/wp-content/uploads/2020/04/Loreal-Logo.png",
    new: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/L%27Or%C3%A9al_logo.svg/800px-L%27Or%C3%A9al_logo.svg.png"
  }
];

async function updateLogos() {
  try {
    console.log("Đang kết nối MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    const db = mongoose.connection.db;

    // Collections to update
    const collections = ["users", "brands", "banners", "partners"];

    for (const mapping of logoMappings) {
      console.log(`\n🔄 Đang cập nhật: ${mapping.old.split('/').pop()}`);
      
      for (const collectionName of collections) {
        try {
          const collection = db.collection(collectionName);
          
          // Update avatar field
          const avatarResult = await collection.updateMany(
            { avatar: mapping.old },
            { $set: { avatar: mapping.new } }
          );
          if (avatarResult.modifiedCount > 0) {
            console.log(`  ✅ ${collectionName}.avatar: ${avatarResult.modifiedCount} updated`);
          }

          // Update logo field
          const logoResult = await collection.updateMany(
            { logo: mapping.old },
            { $set: { logo: mapping.new } }
          );
          if (logoResult.modifiedCount > 0) {
            console.log(`  ✅ ${collectionName}.logo: ${logoResult.modifiedCount} updated`);
          }

          // Update image field
          const imageResult = await collection.updateMany(
            { image: mapping.old },
            { $set: { image: mapping.new } }
          );
          if (imageResult.modifiedCount > 0) {
            console.log(`  ✅ ${collectionName}.image: ${imageResult.modifiedCount} updated`);
          }
        } catch (err) {
          // Collection might not exist, skip
        }
      }
    }

    console.log("\n🎉 Cập nhật logo hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
}

updateLogos();
