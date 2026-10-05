import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true, // prevents duplicate names
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name must be under 50 characters"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
