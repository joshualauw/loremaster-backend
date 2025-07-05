/*
  Warnings:

  - You are about to drop the column `storyId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `Reference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferenceChunk` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storyId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Scene` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobStatus` to the `Scene` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_storyId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_sceneId_fkey";

-- DropForeignKey
ALTER TABLE "ReferenceChunk" DROP CONSTRAINT "ReferenceChunk_documentChunkId_fkey";

-- DropForeignKey
ALTER TABLE "ReferenceChunk" DROP CONSTRAINT "ReferenceChunk_referenceId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "storyId";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "description",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "storyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Scene" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "jobReason" TEXT,
ADD COLUMN     "jobStatus" "JobStatus" NOT NULL;

-- DropTable
DROP TABLE "Reference";

-- DropTable
DROP TABLE "ReferenceChunk";

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("storyId") ON DELETE RESTRICT ON UPDATE CASCADE;
