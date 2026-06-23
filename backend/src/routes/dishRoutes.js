import { Router } from "express";
import { getAllDishes, toggleDishPublished, addDish } from "../controllers/dishController.js";

const router = Router();

router.get("/", getAllDishes);
router.post("/", addDish);
router.patch("/:dishId", toggleDishPublished);

export default router;
