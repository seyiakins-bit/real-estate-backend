// src/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const { createContact } = require("../controllers/contactController");

// POST contact form
router.post("/", createContact);

module.exports = router;
