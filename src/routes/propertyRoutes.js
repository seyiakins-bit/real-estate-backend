const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// Middleware placeholder for authentication (optional but recommended)
const authenticate = (req, res, next) => {
  // Example: check JWT token in Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Add token verification logic here...
  next();
};

// GET all properties
router.get("/", authenticate, getProperties);

// GET single property by ID
router.get("/:id", authenticate, getPropertyById);

// POST new property
router.post("/", authenticate, createProperty);

// PUT update property
router.put("/:id", authenticate, updateProperty);

// DELETE property
router.delete("/:id", authenticate, deleteProperty);

module.exports = router;
