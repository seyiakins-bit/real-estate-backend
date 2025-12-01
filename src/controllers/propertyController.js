// src/controllers/propertyController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("cloudinary").v2;

// ----------------------------
// GET ALL PROPERTIES
// ----------------------------
exports.getProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ message: "Server error fetching properties" });
  }
};

// ----------------------------
// GET ONE PROPERTY
// ----------------------------
exports.getPropertyById = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("❌ Error fetching property:", error);
    res.status(500).json({ message: "Server error fetching property" });
  }
};

// ----------------------------
// CREATE PROPERTY
// ----------------------------
exports.createProperty = async (req, res) => {
  try {
    let imageUrl = "";

    // If frontend uploads file through Multer
    if (req.file) {
      const cloud = await cloudinary.uploader.upload(req.file.path, {
        folder: "akins_luxury/properties",
      });
      imageUrl = cloud.secure_url;
    }

    const { title, description, price, location, ownerId } = req.body;

    // VALIDATION
    if (!title || !price || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        price: parseInt(price),   // Ensure Prisma gets a number
        location,
        image: imageUrl,          // empty string if missing
        ownerId: parseInt(ownerId) || 1, // fallback for now
      },
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error("❌ Error creating property:", error);
    res.status(500).json({ message: "Server error creating property" });
  }
};

// ----------------------------
// UPDATE PROPERTY
// ----------------------------
exports.updateProperty = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    const updated = await prisma.property.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        price: price ? parseInt(price) : undefined,
        location,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating property:", error);
    res.status(500).json({ message: "Server error updating property" });
  }
};

// ----------------------------
// DELETE PROPERTY
// ----------------------------
exports.deleteProperty = async (req, res) => {
  try {
    await prisma.property.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(200).json({ message: "Property deleted" });
  } catch (error) {
    console.error("❌ Error deleting property:", error);
    res.status(500).json({ message: "Server error deleting property" });
  }
};
