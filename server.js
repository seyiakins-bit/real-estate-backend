// // server.js
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const { PrismaClient } = require("./generated/prisma");
// const cloudinary = require("cloudinary").v2;

// dotenv.config();

// // 1️⃣ Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// const app = express();

// // 2️⃣ Initialize Prisma
// let prisma;
// try {
//   prisma = new PrismaClient();
//   console.log("✅ Prisma Client initialized successfully");
// } catch (err) {
//   console.error("❌ Prisma initialization failed:", err);
// }

// // 3️⃣ CORS Middleware
// // Make suree the frontend URL matches your dev server (CRA = 3000, Vite = 5174)
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://real-estate-frontend-nu-one.vercel.app/"], // allow both Vite & CRA
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// // 4️⃣ JSON parser and static files
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // 5️⃣ Import routes
// const authRoutes = require("./src/routes/authRoutes");
// const propertyRoutes = require("./src/routes/propertyRoutes");
// const contactRoutes = require("./src/routes/contactRoutes");

// // 6️⃣ Use routes
// app.use("/api/auth", authRoutes);
// app.use("/api/properties", propertyRoutes);
// app.use("/api/contact", contactRoutes);

// // 7️⃣ Test route
// app.get("/", (req, res) => {
//   res.json({ message: "Akins Luxury Backend is running!" });
// });

// // 8️⃣ Global error handler
// app.use((err, req, res, next) => {
//   console.error("Global error:", err.stack);
//   res.status(500).json({ error: err.message || "Somethingg went wrong!" });
// });

// // 9️⃣ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client"); // ✅ FIXED import

const cloudinary = require("cloudinary").v2;

dotenv.config();

// 1️⃣ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();

// 2️⃣ Initialize Prisma
let prisma;
try {
  prisma = new PrismaClient();
  console.log("✅ Prisma Client initialized successfully");
} catch (err) {
  console.error("❌ Prisma initialization failed:", err);
}

// 3️⃣ CORS Middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173", // local dev
//       "https://real-estate-frontend-nu-one.vercel.app", // ✅ no trailing slash
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );


// 3️⃣ CORS Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://real-estate-frontend-nu-one.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests explicitly
app.options(/.*/, cors());



// 4️⃣ JSON parser and static files
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 5️⃣ Import routes
const authRoutes = require("./src/routes/authRoutes");
const propertyRoutes = require("./src/routes/propertyRoutes");
const contactRoutes = require("./src/routes/contactRoutes");

// 6️⃣ Use routes
app.use("/", authRoutes);
app.use("/", propertyRoutes);
app.use("/", contactRoutes);

// 7️⃣ Test route
app.get("/", (req, res) => {
  res.json({ message: "Akins Luxury Backend is running!" });
});

// 8️⃣ Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// 9️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
