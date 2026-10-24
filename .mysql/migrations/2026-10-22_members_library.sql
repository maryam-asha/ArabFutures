-- =================================================================
-- Migration: members + library (collections, resources, relations)
-- Safe to run on an EXISTING database — it only CREATEs the new tables and
-- never drops or touches existing data. Re-runnable (IF NOT EXISTS).
--
-- Usage (Laragon / local):
--   mysql -u root -p future-foresight-terms-v1 < .mysql/migrations/2026-10-22_members_library.sql
-- (or run it in your SQL client against the future-foresight-terms-v1 schema)
-- =================================================================

USE `future-foresight-terms-v1`;
SET NAMES utf8mb4;

-- Table: members (network / collaborator profiles)
CREATE TABLE IF NOT EXISTS `members` (
  `memberId` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `isActive` TINYINT NOT NULL DEFAULT 1,
  `isFeatured` TINYINT NOT NULL DEFAULT 0,
  `content` JSON DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name_en` VARCHAR(255) GENERATED ALWAYS AS (content->>'$.name.en') STORED,
  `name_ar` VARCHAR(255) GENERATED ALWAYS AS (content->>'$.name.ar') STORED,
  PRIMARY KEY (`memberId`),
  UNIQUE KEY `UQ_members_slug` (`slug`),
  FULLTEXT INDEX `ft_members_name` (name_en, name_ar)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: collections (Library groupings, e.g. "Futures 101")
CREATE TABLE IF NOT EXISTS `collections` (
  `collectionId` INT NOT NULL AUTO_INCREMENT,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `isActive` TINYINT NOT NULL DEFAULT 1,
  `name` JSON DEFAULT NULL,
  `name_en` VARCHAR(255) GENERATED ALWAYS AS (name->>'$.en') STORED,
  `name_ar` VARCHAR(255) GENERATED ALWAYS AS (name->>'$.ar') STORED,
  PRIMARY KEY (`collectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: resources (Library items: books, articles, reports, videos)
CREATE TABLE IF NOT EXISTS `resources` (
  `resourceId` INT NOT NULL AUTO_INCREMENT,
  `type` enum('book','article','report','video') NOT NULL DEFAULT 'article',
  `categoryRef` INT DEFAULT NULL,
  `language` VARCHAR(10) DEFAULT NULL,
  `isActive` TINYINT NOT NULL DEFAULT 1,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `content` JSON DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `title_en` VARCHAR(255) GENERATED ALWAYS AS (content->>'$.title.en') STORED,
  `title_ar` VARCHAR(255) GENERATED ALWAYS AS (content->>'$.title.ar') STORED,
  PRIMARY KEY (`resourceId`),
  KEY `IX_resources_categoryRef` (`categoryRef`),
  KEY `IX_resources_type` (`type`),
  FULLTEXT INDEX `ft_resources_title` (title_en, title_ar),
  CONSTRAINT `FK_resources_categoryRef` FOREIGN KEY (`categoryRef`) REFERENCES `termCategories` (`categoryId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: resourceTags (Junction: resource themes reuse the tags table)
CREATE TABLE IF NOT EXISTS `resourceTags` (
  `resourceId` INT NOT NULL,
  `tagId` INT NOT NULL,
  PRIMARY KEY (`resourceId`,`tagId`),
  KEY `IX_resourceTags_tagId` (`tagId`),
  CONSTRAINT `FK_resourceTags_resourceId` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`resourceId`) ON DELETE CASCADE,
  CONSTRAINT `FK_resourceTags_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`tagId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: resourceCollections (Junction: a resource may belong to many collections)
CREATE TABLE IF NOT EXISTS `resourceCollections` (
  `resourceId` INT NOT NULL,
  `collectionId` INT NOT NULL,
  PRIMARY KEY (`resourceId`,`collectionId`),
  KEY `IX_resourceCollections_collectionId` (`collectionId`),
  CONSTRAINT `FK_resourceCollections_resourceId` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`resourceId`) ON DELETE CASCADE,
  CONSTRAINT `FK_resourceCollections_collectionId` FOREIGN KEY (`collectionId`) REFERENCES `collections` (`collectionId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
