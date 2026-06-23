import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "../config/db.js";
import Dish from "../models/Dish.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seed = async () => {
  try {
    await connectDB();

    const raw = readFileSync(join(__dirname, "dishes.json"), "utf-8");
    const dishes = JSON.parse(raw);

    let inserted = 0;
    let skipped = 0;

    for (const dish of dishes) {
      const exists = await Dish.findOne({ dishId: dish.dishId });
      if (exists) {
        console.log(`⏭️  Skipping duplicate: dishId=${dish.dishId} (${dish.dishName})`);
        skipped++;
        continue;
      }
      await Dish.create(dish);
      console.log(`✅ Inserted: dishId=${dish.dishId} (${dish.dishName})`);
      inserted++;
    }

    console.log(`\n🌱 Seed complete — inserted: ${inserted}, skipped: ${skipped}`);
  } catch (error) {
    console.error(`❌ Seed failed: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
};

seed();
