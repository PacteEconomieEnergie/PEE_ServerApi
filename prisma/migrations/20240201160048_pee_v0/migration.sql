-- AlterTable
ALTER TABLE `studies` ADD COLUMN `Status` ENUM('toDo', 'inProgress', 'Done', 'ManqueInformation') NOT NULL DEFAULT 'toDo';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `Avatar` VARCHAR(255) NULL,
    ADD COLUMN `FullName` VARCHAR(255) NULL,
    ADD COLUMN `PhoneNumber` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `studyId` INTEGER NULL,
    `seen` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_notifications_userId`(`userId`),
    INDEX `idx_notifications_studyId`(`studyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_studyId_fkey` FOREIGN KEY (`studyId`) REFERENCES `studies`(`IdStudies`) ON DELETE SET NULL ON UPDATE CASCADE;
