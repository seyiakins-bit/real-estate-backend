// src/controllers/contactController.js
// const { PrismaClient } = require("../../generated/prisma");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Submit a contact message
const createContact = async (req, res) => {
  try {
    const { name, email, message, propertyId } = req.body;

    if (!name || !email || !message || !propertyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
        property: { connect: { id: Number(propertyId) } },
      },
      include: { property: true },
    });

    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (error) {
    console.error("Create contact error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createContact };
