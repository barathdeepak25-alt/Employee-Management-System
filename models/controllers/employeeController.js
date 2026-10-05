import Employee from "../models/Employee.js";

const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: "An employee with this email already exists" });
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

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("category", "name").sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    handleError(res, error);
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("category", "name");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    handleError(res, error);
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // same rules apply when editing
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    handleError(res, error);
  }
};
