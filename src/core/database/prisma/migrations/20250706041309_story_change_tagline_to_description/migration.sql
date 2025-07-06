/*
  Warnings:

  - You are about to drop the column `tagline` on the `Story` table. All the data in the column will be lost.
  - Added the required column `description` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "tagline",
ADD COLUMN     "description" TEXT NOT NULL;
