import express from "express";
const router = express.Router();
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
} from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
// Public: Get all categories
router.get("/", getCategories);

// Admin Only Routes
router.post("/", protect, adminOnly, createCategory);

router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);
export default router;
