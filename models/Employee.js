import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    role: { type: String, required: [true, "Role is required"], trim: true },
    // Reference to a Category document; populate() swaps the ID for the full object
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: { values: ["Male", "Female", "Other"], message: "Invalid gender" },
    },
    address: { type: String, required: [true, "Address is required"], trim: true },
    joiningDate: { type: Date, required: [true, "Joining date is required"] },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
