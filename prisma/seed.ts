// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clean old data
  await prisma.report.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.contact.deleteMany();

  // 2. Seed contacts
  await prisma.contact.createMany({
    data: [
      {
        email: "test1@example.com",
        firstName: "Alex",
        lastName: "Chef",
        tag: "BASIC",
      },
      {
        email: "vip@example.com",
        firstName: "Maria",
        lastName: "VIP",
        tag: "VIP",
      },
      {
        email: process.env.TEST_EMAIL || "test@theglobeasia.com",
        firstName: "Test",
        lastName: "User",
        tag: "SILVER",
      },
    ],
  });

  // 3. Seed a sample campaign
  await prisma.campaign.create({
    data: {
      title: "Welcome to The Globe Asia!",
      message: "This is your first campaign. 🚀\nLine breaks are respected.",
      audience: "ALL",
      sendOption: "Scheduled",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 10), // 10 mins later
      status: "Scheduled",
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
