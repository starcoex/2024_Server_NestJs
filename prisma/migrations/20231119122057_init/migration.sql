/*
  Warnings:

  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialProviderId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SocialProviderTypes" AS ENUM ('facebook', 'google', 'kakao', 'naver', 'github');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "SocialProviderTypes" NOT NULL,
ADD COLUMN     "socialProviderId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SocialProvider" (
    "id" SERIAL NOT NULL,
    "provider" "SocialProviderTypes" NOT NULL,
    "socialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialProvider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_socialProviderId_fkey" FOREIGN KEY ("socialProviderId") REFERENCES "SocialProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
