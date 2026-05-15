-- CreateTable
CREATE TABLE "Environment" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Environment_project_id_idx" ON "Environment"("project_id");

-- CreateIndex
CREATE INDEX "Environment_project_id_is_default_idx" ON "Environment"("project_id", "is_default");

-- CreateIndex
CREATE UNIQUE INDEX "Environment_project_id_name_key" ON "Environment"("project_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Environment_project_default_unique" ON "Environment"("project_id") WHERE "is_default" = true;

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
