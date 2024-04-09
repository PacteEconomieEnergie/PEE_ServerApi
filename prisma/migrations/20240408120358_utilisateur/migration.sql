-- AlterTable
ALTER TABLE `files` ADD COLUMN `UtilisateursId` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `Role` ENUM('ADMIN', 'ASSISTANT', 'ENGINEER', 'CLIENT') NOT NULL;

-- CreateTable
CREATE TABLE `utilisateurs` (
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

    UNIQUE INDEX `utilisateurs_nom_key`(`nom`),
    UNIQUE INDEX `utilisateurs_prenom_key`(`prenom`),
    UNIQUE INDEX `utilisateurs_mail_key`(`mail`),
    INDEX `idx_utilisateurs_mail`(`mail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_files_utilisateursId` ON `files`(`UtilisateursId`);

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_UtilisateursId_fkey` FOREIGN KEY (`UtilisateursId`) REFERENCES `utilisateurs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
