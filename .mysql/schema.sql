DROP SCHEMA IF EXISTS `future-foresight-terms-v1`;
CREATE SCHEMA `future-foresight-terms-v1` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `future-foresight-terms-v1`;

-- Set default SQL modes
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- =================================================================
-- Table Structures
-- =================================================================

-- Table: users
CREATE TABLE `users` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  `isForbidden` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `UQ_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: revokedTokens

CREATE TABLE `revokedTokens` (
  `jti` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  PRIMARY KEY (`jti`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: termCategories

CREATE TABLE `termCategories` (
  `categoryId` INT NOT NULL AUTO_INCREMENT,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `isActive` TINYINT NOT NULL DEFAULT 1,
  `name` JSON DEFAULT NULL,
  `name_en` VARCHAR(255) AS (name->>'$.en') VIRTUAL,
  `name_ar` VARCHAR(255) AS (name->>'$.ar') VIRTUAL,
  PRIMARY KEY (`categoryId`)
  FULLTEXT INDEX `ft_tags_name` (name_en, name_ar),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tags

CREATE TABLE `tags` (
  `tagId` INT NOT NULL AUTO_INCREMENT,
  `name` json DEFAULT NULL,
  PRIMARY KEY (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: terms (OVERHAULED SCHEMA)

CREATE TABLE `terms` (
  `termId` INT NOT NULL AUTO_INCREMENT,
  `categoryRef` INT DEFAULT NULL,
  `status` enum('pending','published','rejected','has-pending-review') NOT NULL DEFAULT 'pending',
  `isFeatured` TINYINT NOT NULL DEFAULT 0,
  `content` JSON DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name_en` VARCHAR(255) AS (content->>'$.default.en.name') VIRTUAL,
  `name_ar` VARCHAR(255) AS (content->>'$.default.ar.name') VIRTUAL,
  PRIMARY KEY (`termId`),
  FULLTEXT INDEX ft_terms_name (name_en, name_ar),
  KEY `IX_terms_categoryRef` (`categoryRef`),
  CONSTRAINT `FK_terms_categoryRef` FOREIGN KEY (`categoryRef`) REFERENCES `termCategories` (`categoryId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: termTags (Junction)

CREATE TABLE `termTags` (
  `termId` INT NOT NULL,
  `tagId` INT NOT NULL,
  PRIMARY KEY (`termId`,`tagId`),
  KEY `IX_termTags_tagId` (`tagId`),
  CONSTRAINT `FK_termTags_termId` FOREIGN KEY (`termId`) REFERENCES `terms` (`termId`) ON DELETE CASCADE,
  CONSTRAINT `FK_termTags_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`tagId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: termReviews (NEW TABLE)

CREATE TABLE `termReviews` (
  `reviewId` INT NOT NULL AUTO_INCREMENT,
  `termRef` INT NOT NULL,
  `suggestedChange` text NOT NULL,
  `explanation` text DEFAULT NULL,
  `references` JSON DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `resolvedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`reviewId`),
  KEY `IX_termReviews_termRef` (`termRef`),
  CONSTRAINT `FK_termReviews_termRef` FOREIGN KEY (`termRef`) REFERENCES `terms` (`termId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

