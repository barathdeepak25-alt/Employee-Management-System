import jwt from "jsonwebtoken";

// Reads "Authorization: Bearer <token>" and lets valid requests continue
const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default protect;
