// src/controllers/propertyController.js
// const { PrismaClient } = require("../../generated/prisma");
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
// CREATE property
const createProperty = async (req, res) => {
  const { title, description, price, location, ownerId, image } = req.body;

  console.log("reqbody", req.body);
  

  // if (!title || !description || !price || !location || !ownerId) {
  //   return res
  //     .status(400)
  //     .json({ message: "All fields including ownerId are required" });
  // }

  if (!title) {
    return res
      .status(400)
      .json({ message: "Tittle field required" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ message: "Description field required" });
  }
  if (!price) {
    return res
      .status(400)
      .json({ message: " Price field required" });
  }
  if (!location) {
    return res
      .status(400)
      .json({ message: " Location field required" });
  }
  if (!ownerId) {
    return res
      .status(400)
      .json({ message: " OwnerId field required" });
  }

  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        owner: { connect: { id: Number(ownerId) } },
        image: image || (req.file ? `/uploads/${req.file.filename}` : null), // accept Cloudinary URL or uploaded file
      },
      include: { owner: true },
    });

    res
      .status(201)
      .json({ message: "Property created successfully", property });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location } = req.body;

  try {
    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        location,
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
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
