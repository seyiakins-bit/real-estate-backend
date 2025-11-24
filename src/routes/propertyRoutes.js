const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// Optional: authentication middleware for regular users
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Allow admin bypass: if isAdmin=true in body, skip auth
  if (req.body.isAdmin) return next();

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // TODO: Add JWT verification logic here to populate req.user
  // e.g., req.user = decodedToken.user;

  next();
};

// GET all properties (no restriction)
router.get("/", getProperties);

// GET single property by ID (no restriction)
router.get("/:id", getPropertyById);

// POST new property
router.post("/", createProperty); // controller handles admin or user auth

// PUT update property
router.put("/:id", updateProperty); // controller handles admin or user auth

// DELETE property
router.delete("/:id", deleteProperty); // controller handles admin or user auth

module.exports = router;
