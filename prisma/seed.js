import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a user (owner)
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword123", // ⚠️ hash in real app
      role: "USER",
    },
  });

  // Create a property linked to the user
  await prisma.property.create({
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

  // Another property
  await prisma.property.create({
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
