import Category from "../models/Category.js";

// CREATE CATEGORY (Admin Only)
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const exists = await Category.findOne({ name });
    if (exists) {
      const err = new Error("Category already exists");
      err.statusCode = 400;
      return next(err);
    }

    const category = await Category.create({ name });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    next(error); // pass error to global handler
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// UPDATE CATEGORY (Admin Only)
export const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );

    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: "Category updated", category });
  } catch (error) {
    next(error);
  }
};

// DELETE CATEGORY (Admin Only)
export const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};
