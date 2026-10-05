import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Same vague error for wrong email or wrong password (safer)
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.json({ token, user: { id: admin._id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};
