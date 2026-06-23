import Dish from "../models/Dish.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Get all dishes
 * @route   GET /api/dishes
 * @access  Public
 */
export const getAllDishes = asyncHandler(async (req, res) => {
  const dishes = await Dish.find({}).sort({ dishId: 1 });

  res.status(200).json(dishes);
});

/**
 * @desc    Toggle the published status of a dish
 * @route   PATCH /api/dishes/:dishId
 * @access  Public
 */
export const toggleDishPublished = asyncHandler(async (req, res) => {
  const { dishId } = req.params;
  const parsedDishId = parseInt(dishId, 10);

  if (isNaN(parsedDishId)) {
    res.status(400);
    throw new Error("Invalid dish ID. Must be a number.");
  }

  const dish = await Dish.findOne({ dishId: parsedDishId });

  if (!dish) {
    res.status(404);
    throw new Error(`Dish with ID ${parsedDishId} not found.`);
  }

  dish.isPublished = !dish.isPublished;
  const updatedDish = await dish.save();

  // Emit real-time update to all connected socket clients
  const io = req.app.get("io");
  if (io) {
    io.emit("dishUpdated", updatedDish);
  }

  res.status(200).json({
    success: true,
    data: updatedDish,
  });
});

/**
 * @desc    Create a new dish
 * @route   POST /api/dishes
 * @access  Public
 */
export const addDish = asyncHandler(async (req, res) => {
  const { dishName, imageUrl } = req.body;

  if (!dishName || !imageUrl) {
    res.status(400);
    throw new Error("Please provide both dishName and imageUrl.");
  }

  // Find highest dishId to auto-increment
  const maxDish = await Dish.findOne().sort({ dishId: -1 });
  const nextDishId = maxDish ? maxDish.dishId + 1 : 1;

  const dish = await Dish.create({
    dishId: nextDishId,
    dishName,
    imageUrl,
    isPublished: true, // Default to published
  });

  // Emit real-time update to all connected socket clients
  const io = req.app.get("io");
  if (io) {
    io.emit("dishAdded", dish);
  }

  res.status(201).json({
    success: true,
    data: dish,
  });
});
