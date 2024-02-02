/*
  Warnings:

  - The values [facebook,google,kakao,naver,github] on the enum `SocialProviderTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SocialProviderTypes_new" AS ENUM ('Facebook', 'Google', 'Kakao', 'Naver', 'Github');
ALTER TABLE "SocialProvider" ALTER COLUMN "provider" TYPE "SocialProviderTypes_new" USING ("provider"::text::"SocialProviderTypes_new");
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "SocialProviderTypes_new" USING ("provider"::text::"SocialProviderTypes_new");
ALTER TYPE "SocialProviderTypes" RENAME TO "SocialProviderTypes_old";
ALTER TYPE "SocialProviderTypes_new" RENAME TO "SocialProviderTypes";
DROP TYPE "SocialProviderTypes_old";
COMMIT;
