/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `userSchema` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `userSchema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userSchema" ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "userSchema_phone_key" ON "userSchema"("phone");
