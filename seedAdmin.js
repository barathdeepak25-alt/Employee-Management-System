import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import Category from "./models/Category.js";

dotenv.config();

// One-time script: creates the first admin and starter categories
const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!exists) {
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    console.log("Admin created");
  } else {
    console.log("Admin already exists");
  }

  for (const name of ["Developer", "Designer", "HR", "Marketing", "Finance", "Testing"]) {
    await Category.updateOne({ name }, { name }, { upsert: true });
  }
  console.log("Categories ready");

  await mongoose.disconnect();
};

run();
