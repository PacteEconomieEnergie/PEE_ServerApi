-- AlterTable
ALTER TABLE `filehistory` ADD COLUMN `Comment` LONGTEXT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `modificationNumber` INTEGER NULL;