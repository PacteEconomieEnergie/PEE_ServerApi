-- AlterTable
ALTER TABLE `users` ADD COLUMN `ResetPasswordCode` VARCHAR(255) NULL,
    ADD COLUMN `ResetPasswordExpire` DATETIME(3) NULL;
