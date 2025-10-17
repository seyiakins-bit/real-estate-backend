// src/routes/propertyRoutes.js
const express = require("express");
const router = express.Router();
const { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } = require("../controllers/propertyController");

// GET all properties
router.get("/", getProperties);

// GET single property by ID
router.get("/:id", getPropertyById);

// POST new property
router.post("/", createProperty);

// PUT update property
router.put("/:id", updateProperty);

// DELETE property
router.delete("/:id", deleteProperty);

module.exports = router;
