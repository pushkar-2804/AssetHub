/*
  Warnings:

  - Added the required column `walletCredential` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "walletCredential" TEXT NOT NULL,
ALTER COLUMN "walletAddress" DROP NOT NULL;
