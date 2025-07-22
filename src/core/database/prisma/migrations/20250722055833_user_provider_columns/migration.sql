-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'LOCAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "AuthProvider",
ADD COLUMN     "providerId" TEXT,
ALTER COLUMN "credit" SET DEFAULT 0;
