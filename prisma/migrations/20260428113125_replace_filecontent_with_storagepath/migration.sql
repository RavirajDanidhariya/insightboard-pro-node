-- AlterTable
ALTER TABLE "Export" ADD COLUMN     "storagePath" TEXT,
ALTER COLUMN "fileContent" DROP NOT NULL;
