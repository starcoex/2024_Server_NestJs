-- CreateEnum
CREATE TYPE "SocialProviderTypes" AS ENUM ('Facebook', 'Google', 'Kakao', 'Naver', 'Github');

-- CreateTable
CREATE TABLE "SocialProvider" (
    "id" SERIAL NOT NULL,
    "provider" "SocialProviderTypes",
    "socialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialProvider_pkey" PRIMARY KEY ("id")
);
