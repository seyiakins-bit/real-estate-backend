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

// ✅ Admin login route (for your frontend toggle)
router.post("/admin/login", loginUser);  // <--- ADD THIS LINE

// ✅ Normal user routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
