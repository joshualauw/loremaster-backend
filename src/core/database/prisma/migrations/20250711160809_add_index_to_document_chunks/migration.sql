/*
  Warnings:

  - Added the required column `index` to the `DocumentChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentChunk" ADD COLUMN     "index" INTEGER NOT NULL;
