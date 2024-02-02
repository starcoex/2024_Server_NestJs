-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_verificationId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Verification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
