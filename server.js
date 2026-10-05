import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config(); // load values from .env
connectDB(); // connect to MongoDB

const app = express();

// Allow the React app to call this API
app.use(cors({ origin: process.env.CLIENT_URL }));
// Let Express read JSON sent in request bodies
app.use(express.json());

// Each group of routes lives in its own file
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/categories", categoryRoutes);

// Handles URLs that don't exist
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Catches any error thrown in the app
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
