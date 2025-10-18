// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerAdmin,
} = require("../controllers/authController");

// ✅ Admin registration route
router.post("/register-admin", registerAdmin);

// ✅ Normal user routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
