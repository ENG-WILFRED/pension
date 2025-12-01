/*
  Warnings:

  - A unique constraint covering the columns `[checkoutRequestId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "checkoutRequestId" TEXT,
ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_checkoutRequestId_key" ON "transactions"("checkoutRequestId");
