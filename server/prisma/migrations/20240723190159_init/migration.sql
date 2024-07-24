/*
  Warnings:

  - The primary key for the `Asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Asset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_assetId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_pkey",
DROP COLUMN "id",
ADD COLUMN     "assetId" SERIAL NOT NULL,
ADD CONSTRAINT "Asset_pkey" PRIMARY KEY ("assetId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetId") ON DELETE RESTRICT ON UPDATE CASCADE;
