// src/controllers/propertyController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET all properties
const getProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: { owner: true, contacts: true },
    });
    res.json(properties);
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single property by ID
const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { owner: true, contacts: true },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE property
const createProperty = async (req, res) => {
  const { title, description, price, location, ownerId, images } = req.body;

  if (!title || !description || !price || !location || !ownerId) {
    return res.status(400).json({ message: "All fields including ownerId are required" });
  }

  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        owner: { connect: { id: Number(ownerId) } },
        images: images || (req.file ? [`/uploads/${req.file.filename}`] : []),
      },
      include: { owner: true },
    });

    res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, images } = req.body;

  try {
    // Get existing property to preserve existing images if needed
    const existingProperty = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProperty) return res.status(404).json({ message: "Property not found" });

    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        title: title || existingProperty.title,
        description: description || existingProperty.description,
        price: price ? parseFloat(price) : existingProperty.price,
        location: location || existingProperty.location,
        images: images || existingProperty.images,
      },
      include: { owner: true },
    });

    res.json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE property
const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.property.delete({ where: { id: Number(id) } });
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
