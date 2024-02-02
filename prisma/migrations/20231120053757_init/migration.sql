/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socialProviderId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SocialProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_socialProviderId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
DROP COLUMN "socialProviderId";

-- DropTable
DROP TABLE "SocialProvider";

-- DropEnum
DROP TYPE "SocialProviderTypes";
