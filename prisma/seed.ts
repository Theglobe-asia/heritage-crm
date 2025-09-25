import { PrismaClient, Tag, Audience, CampaignStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clean old data
  await prisma.campaign.deleteMany();
  await prisma.contact.deleteMany();

  // 2. Seed contacts
  await prisma.contact.createMany({
    data: [
      {
        email: "basic1@example.com",
        firstName: "John",
        lastName: "Basic",
        tag: Tag.BASIC,
      },
      {
        email: "silver1@example.com",
        firstName: "Alice",
        lastName: "Silver",
        tag: Tag.SILVER,
      },
      {
        email: "vip1@example.com",
        firstName: "Robert",
        lastName: "VIP",
        tag: Tag.VIP,
      },
      {
        email: "gold1@example.com",
        firstName: "Sophia",
        lastName: "Gold",
        tag: Tag.GOLD,
      },
    ],
  });

  // 3. Seed a test campaign
  await prisma.campaign.create({
    data: {
      title: "Welcome Campaign",
      message: "This is our first campaign test!",
      audience: Audience.ALL,
      sendOption: "Scheduled",
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      status: CampaignStatus.Scheduled,
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
