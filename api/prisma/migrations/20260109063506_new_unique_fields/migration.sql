/*
  Warnings:

  - A unique constraint covering the columns `[project_id,label]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Queue_label_key";

-- CreateIndex
CREATE UNIQUE INDEX "Queue_project_id_label_key" ON "Queue"("project_id", "label");
