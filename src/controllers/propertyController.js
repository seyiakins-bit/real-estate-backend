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
  const { title, description, price, location, ownerId, images, image, isAdmin } = req.body;

  if (!title || !description || !price || !location) {
    return res.status(400).json({ message: "Title, description, price, and location are required" });
  }

  let finalOwnerId;

  try {
    // Admin bypass: no authentication required
    if (isAdmin && ownerId) {
      finalOwnerId = Number(ownerId);
    } else {
      // Regular user must be authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: login required" });
      }

      // Only USER role allowed
      if (req.user.role !== "USER") {
        return res.status(401).json({ message: "Unauthorized: only regular users allowed" });
      }

      finalOwnerId = req.user.id;
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        owner: { connect: { id: finalOwnerId } },
        images: images || (image ? [image] : []),
      },
      include: { owner: true },
    });

    res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, images, image, isAdmin } = req.body;

  try {
    const existingProperty = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProperty) return res.status(404).json({ message: "Property not found" });

    // Admin can update any property
    // Regular users can only update their own properties
    if (!isAdmin) {
      if (!req.user) return res.status(401).json({ message: "Unauthorized: login required" });
      if (req.user.role !== "USER") return res.status(401).json({ message: "Unauthorized: only regular users allowed" });
      if (existingProperty.ownerId !== req.user.id)
        return res.status(403).json({ message: "Forbidden: cannot update others' properties" });
    }

    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        title: title || existingProperty.title,
        description: description || existingProperty.description,
        price: price ? parseFloat(price) : existingProperty.price,
        location: location || existingProperty.location,
        images: images || (image ? [image] : existingProperty.images),
      },
      include: { owner: true },
    });

    res.json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
