-- CreateEnum
CREATE TYPE "public"."Tag" AS ENUM ('BASIC', 'SILVER', 'VIP', 'GOLD');

-- CreateEnum
CREATE TYPE "public"."Audience" AS ENUM ('TEST', 'ALL', 'BASIC', 'SILVER', 'VIP', 'GOLD');

-- CreateEnum
CREATE TYPE "public"."CampaignStatus" AS ENUM ('Draft', 'Scheduled', 'Processing', 'Sent');

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "tag" "public"."Tag" NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "audience" "public"."Audience" NOT NULL,
    "sendOption" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "status" "public"."CampaignStatus" NOT NULL DEFAULT 'Draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "public"."Contact"("email");
