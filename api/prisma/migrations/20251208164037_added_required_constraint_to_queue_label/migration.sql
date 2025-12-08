/*
  Warnings:

  - Made the column `label` on table `Queue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Queue" ALTER COLUMN "label" SET NOT NULL;
