/*
  Warnings:

  - You are about to drop the column `title` on the `DocumentChunk` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Scene` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Scene` table. All the data in the column will be lost.
  - Added the required column `content` to the `Scene` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentChunk" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Scene" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "content" TEXT NOT NULL;
