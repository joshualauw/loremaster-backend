-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "jobStatus" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Scene" ALTER COLUMN "jobStatus" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "notes" DROP NOT NULL;
