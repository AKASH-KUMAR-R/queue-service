/*
  Warnings:

  - Made the column `worker_id` on table `JobEvents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobEvents" ALTER COLUMN "worker_id" SET NOT NULL;
