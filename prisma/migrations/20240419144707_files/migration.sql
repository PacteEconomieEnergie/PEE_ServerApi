/*
  Warnings:

  - The primary key for the `files` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `files` DROP PRIMARY KEY,
    MODIFY `Studies_IdStudies` INTEGER NULL;
