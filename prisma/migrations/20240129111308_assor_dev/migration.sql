-- CreateTable
CREATE TABLE `client` (
    `IdClient` INTEGER NOT NULL AUTO_INCREMENT,
    `ClientName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `IdClient_UNIQUE`(`IdClient`),
    PRIMARY KEY (`IdClient`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filehistory` (
    `idFileHistory` INTEGER NOT NULL AUTO_INCREMENT,
    `FileName` VARCHAR(255) NOT NULL,
    `FileType` VARCHAR(255) NOT NULL,
    `FileContent` LONGBLOB NOT NULL,
    `UploadDate` DATETIME(0) NOT NULL,
    `FileSize` BIGINT NOT NULL,
    `modificationNumber` INTEGER NOT NULL,
    `modificationDate` DATETIME(0) NOT NULL,
    `Studies_IdStudies` INTEGER NOT NULL,
    `Users_UserID` INTEGER NOT NULL,

    UNIQUE INDEX `idFileHistory_UNIQUE`(`idFileHistory`),
    INDEX `fk_FileHistory_Studies1_idx`(`Studies_IdStudies`),
    INDEX `fk_FileHistory_Users1_idx`(`Users_UserID`),
    PRIMARY KEY (`idFileHistory`, `Studies_IdStudies`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `idFiles` INTEGER NOT NULL AUTO_INCREMENT,
    `FileName` VARCHAR(255) NOT NULL,
    `FileType` VARCHAR(255) NOT NULL,
    `FileContent` LONGBLOB NOT NULL,
    `uploadDate` DATETIME(0) NOT NULL,
    `FileSize` BIGINT NOT NULL,
    `Studies_IdStudies` INTEGER NOT NULL,

    UNIQUE INDEX `idFiles_UNIQUE`(`idFiles`),
    INDEX `fk_Files_Studies1_idx`(`Studies_IdStudies`),
    PRIMARY KEY (`idFiles`, `Studies_IdStudies`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studies` (
    `IdStudies` INTEGER NOT NULL AUTO_INCREMENT,
    `Client_IdClient` INTEGER NOT NULL,
    `DateDeReception` DATETIME(0) NOT NULL,
    `DateDeSoumission` DATETIME(0) NOT NULL,
    `FullName` VARCHAR(255) NOT NULL,
    `Factured` TINYINT NOT NULL DEFAULT 0,
    `TypeEtude` ENUM('NouvelleEtude', 'Retouche') NOT NULL,
    `NomberDeRetouche` INTEGER NULL,
    `TypeDeRetouche` ENUM('Exterieur', 'Interieur') NULL,
    `Category` ENUM('Classique', 'Precaire', 'GrandPrecaire') NOT NULL,
    `Nature` ENUM('Normale', 'Prioritere') NOT NULL,

    UNIQUE INDEX `idStudies_UNIQUE`(`IdStudies`),
    INDEX `fk_Studies_Client1_idx`(`Client_IdClient`),
    PRIMARY KEY (`IdStudies`, `Client_IdClient`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(200) NOT NULL,
    `Password` LONGTEXT NOT NULL,
    `Role` ENUM('ADMIN', 'ASSISTANT', 'ENGINEER') NOT NULL,
    `Token` LONGTEXT NULL,

    UNIQUE INDEX `UserID_UNIQUE`(`UserID`),
    UNIQUE INDEX `Email_UNIQUE`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_has_studies` (
    `Users_UserID` INTEGER NOT NULL,
    `Studies_IdStudies` INTEGER NOT NULL,

    INDEX `fk_Users_has_Studies_Studies1_idx`(`Studies_IdStudies`),
    INDEX `fk_Users_has_Studies_Users1_idx`(`Users_UserID`),
    PRIMARY KEY (`Users_UserID`, `Studies_IdStudies`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `filehistory` ADD CONSTRAINT `fk_FileHistory_Studies1` FOREIGN KEY (`Studies_IdStudies`) REFERENCES `studies`(`IdStudies`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `filehistory` ADD CONSTRAINT `fk_FileHistory_Users1` FOREIGN KEY (`Users_UserID`) REFERENCES `users`(`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `fk_Files_Studies1` FOREIGN KEY (`Studies_IdStudies`) REFERENCES `studies`(`IdStudies`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `studies` ADD CONSTRAINT `fk_Studies_Client1` FOREIGN KEY (`Client_IdClient`) REFERENCES `client`(`IdClient`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_has_studies` ADD CONSTRAINT `fk_Users_has_Studies_Studies1` FOREIGN KEY (`Studies_IdStudies`) REFERENCES `studies`(`IdStudies`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_has_studies` ADD CONSTRAINT `fk_Users_has_Studies_Users1` FOREIGN KEY (`Users_UserID`) REFERENCES `users`(`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
