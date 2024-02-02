/*
  Warnings:

  - A unique constraint covering the columns `[verificationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userName" TEXT NOT NULL,
ADD COLUMN     "verificationId" INTEGER;

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_code_key" ON "Verification"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationId_key" ON "User"("verificationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Verification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
