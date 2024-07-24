/*
  Warnings:

  - You are about to drop the column `cartId` on the `Purchases` table. All the data in the column will be lost.
  - Added the required column `date` to the `Purchases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_cartId_fkey";

-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "cartId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
