/*
  Warnings:

  - You are about to drop the `utilisateurs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_UtilisateursId_fkey`;

-- AlterTable
ALTER TABLE `files` ADD COLUMN `Type` ENUM('FicheNavette', 'FichePreco', 'Synthese', 'PieceJointe') NULL;

-- AlterTable
ALTER TABLE `studies` ADD COLUMN `Comment` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `utilisateurs`;

-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `codePostal` VARCHAR(255) NOT NULL,
    `ville` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(255) NOT NULL,
    `mail` VARCHAR(255) NOT NULL,
    `surfaceHabitable` INTEGER NOT NULL,
    `typeDeChauffage` VARCHAR(255) NOT NULL,
    `typeMaison` VARCHAR(255) NOT NULL,
    `anneeDeConstruction` INTEGER NOT NULL,
    `numeroFiscal` VARCHAR(255) NOT NULL,
    `refFiscale` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Lead_nom_key`(`nom`),
    UNIQUE INDEX `Lead_prenom_key`(`prenom`),
    UNIQUE INDEX `Lead_mail_key`(`mail`),
    INDEX `idx_utilisateurs_mail`(`mail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_UtilisateursId_fkey` FOREIGN KEY (`UtilisateursId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
