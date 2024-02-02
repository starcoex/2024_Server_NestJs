/*
  Warnings:

  - You are about to drop the `Paddle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Paddle";

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
