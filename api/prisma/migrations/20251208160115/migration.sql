/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "description" TEXT,
ADD COLUMN     "label" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Queue_label_key" ON "Queue"("label");
