import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a user (owner)
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword123", // ⚠️ In real app, hash this
      role: "USER",
    },
  });

  // Create first property
  const property1 = await prisma.property.create({
    data: {
      title: "Luxury Beach House",
      description: "A stunning beach house with ocean views.",
      price: 750000,
      location: "Ilashe, Lagos",
      bedrooms: 4,
      bathrooms: 5,
      size: 350.5,
      isAvailable: true,
      image: "https://via.placeholder.com/600x400",
      ownerId: user.id,
    },
  });

  // Create second property
  const property2 = await prisma.property.create({
    data: {
      title: "Modern Smart Apartment",
      description: "Fully automated smart apartment in Eko Atlantic.",
      price: 450000,
      location: "Eko Atlantic, Lagos",
      bedrooms: 3,
      bathrooms: 3,
      size: 210.0,
      isAvailable: true,
      image: "https://via.placeholder.com/600x400",
      ownerId: user.id,
    },
  });

  // Add contact inquiries
  await prisma.contact.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+2348012345678",
      message: "I’m very interested in the Luxury Beach House. Can I schedule a viewing?",
      propertyId: property1.id,
    },
  });

  await prisma.contact.create({
    data: {
      name: "Michael Johnson",
      email: "michael.j@example.com",
      phone: "+2348098765432",
      message: "Is the Smart Apartment still available? What’s the payment plan?",
      propertyId: property2.id,
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
