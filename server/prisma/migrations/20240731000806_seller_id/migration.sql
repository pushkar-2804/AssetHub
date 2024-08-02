/*
  Warnings:

  - A unique constraint covering the columns `[txId]` on the table `Purchases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txId` to the `Purchases` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Purchases_transactionId_key";

-- AlterTable
ALTER TABLE "Purchases" ADD COLUMN     "assetId" INTEGER NOT NULL,
ADD COLUMN     "sellerId" INTEGER NOT NULL,
ADD COLUMN     "txId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Purchases_txId_key" ON "Purchases"("txId");
