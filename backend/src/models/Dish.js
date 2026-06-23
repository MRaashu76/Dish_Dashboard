import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    dishId: {
      type: Number,
      unique: true,
      required: [true, "Dish ID is required"],
    },
    dishName: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
