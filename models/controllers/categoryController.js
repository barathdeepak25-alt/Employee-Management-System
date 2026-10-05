import Category from "../models/Category.js";
import Employee from "../models/Employee.js";

// Turns Mongoose/Mongo errors into readable messages
const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: "Category already exists" });
  }
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }
  res.status(500).json({ message: "Server error" });
};

export const getCategories = async (req, res) => {
  try {
    res.json(await Category.find().sort({ name: 1 }));
  } catch (error) {
    handleError(res, error);
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.status(201).json(category);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true } // return updated doc + run validation
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    // Block deleting a category that employees still use
    const inUse = await Employee.exists({ category: req.params.id });
    if (inUse) {
      return res.status(400).json({ message: "Cannot delete: employees use this category" });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    handleError(res, error);
  }
};
