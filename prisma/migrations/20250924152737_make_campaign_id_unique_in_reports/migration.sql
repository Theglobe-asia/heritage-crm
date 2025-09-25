/*
  Warnings:

  - A unique constraint covering the columns `[campaignId]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Report_campaignId_key" ON "public"."Report"("campaignId");
