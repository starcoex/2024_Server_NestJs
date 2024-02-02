/*
  Warnings:

  - You are about to drop the column `verificationId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_verificationId_fkey";

-- DropIndex
DROP INDEX "User_verificationId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "verificationId";

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Verification_userId_key" ON "Verification"("userId");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
