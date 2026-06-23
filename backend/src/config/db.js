import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Dish from "../models/Dish.js";

let mongod = null;

const connectDB = async () => {
  try {
    console.log("Spinning up mongodb-memory-server...");
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected (in-memory): ${conn.connection.host}`);
    
    await autoSeed();
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const autoSeed = async () => {
  const count = await Dish.countDocuments();
  if (count === 0) {
    console.log("🌱 Auto-seeding in-memory database...");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const raw = readFileSync(join(__dirname, "..", "seed", "dishes.json"), "utf-8");
    const dishes = JSON.parse(raw);
    await Dish.insertMany(dishes);
    console.log("✅ Auto-seed complete");
  }
}

export default connectDB;
