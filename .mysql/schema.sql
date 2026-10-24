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
  `name_en` VARCHAR(255) GENERATED ALWAYS AS (name->>'$.en') STORED,
  `name_ar` VARCHAR(255) GENERATED ALWAYS AS (name->>'$.ar') STORED,
  PRIMARY KEY (`categoryId`),
  FULLTEXT INDEX `ft_tags_name` (name_en, name_ar)
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
  `name_en` VARCHAR(255)   GENERATED ALWAYS AS (content->>'$.default.en.name') STORED,
  `name_ar` VARCHAR(255)  GENERATED ALWAYS AS (content->>'$.default.ar.name') STORED,
  PRIMARY KEY (`termId`),
  FULLTEXT INDEX `ft_terms_name` (name_en, name_ar),
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

-- Table: members (network / collaborator profiles)
-- All translatable text, social links, selected works and additional links live in the `content`
-- JSON blob (see dal/dal.schema.ts: MemberContentDbSchema). name_en/name_ar are generated for
-- search and ordering, mirroring the `terms` table.

CREATE TABLE `members` (
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

CREATE TABLE `collections` (
  `collectionId` INT NOT NULL AUTO_INCREMENT,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `isActive` TINYINT NOT NULL DEFAULT 1,
  `name` JSON DEFAULT NULL,
  `name_en` VARCHAR(255) GENERATED ALWAYS AS (name->>'$.en') STORED,
  `name_ar` VARCHAR(255) GENERATED ALWAYS AS (name->>'$.ar') STORED,
  PRIMARY KEY (`collectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: resources (Library items: books, articles, reports, videos)
-- Translatable text, authors, image, url and date live in the `content` JSON blob
-- (see dal/dal.schema.ts: ResourceContentDbSchema). Category reuses termCategories;
-- themes reuse the tags table via resourceTags; collections via resourceCollections.

CREATE TABLE `resources` (
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

CREATE TABLE `resourceTags` (
  `resourceId` INT NOT NULL,
  `tagId` INT NOT NULL,
  PRIMARY KEY (`resourceId`,`tagId`),
  KEY `IX_resourceTags_tagId` (`tagId`),
  CONSTRAINT `FK_resourceTags_resourceId` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`resourceId`) ON DELETE CASCADE,
  CONSTRAINT `FK_resourceTags_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`tagId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: resourceCollections (Junction: a resource may belong to many collections)

CREATE TABLE `resourceCollections` (
  `resourceId` INT NOT NULL,
  `collectionId` INT NOT NULL,
  PRIMARY KEY (`resourceId`,`collectionId`),
  KEY `IX_resourceCollections_collectionId` (`collectionId`),
  CONSTRAINT `FK_resourceCollections_resourceId` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`resourceId`) ON DELETE CASCADE,
  CONSTRAINT `FK_resourceCollections_collectionId` FOREIGN KEY (`collectionId`) REFERENCES `collections` (`collectionId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: blogPosts (Blog / insights articles)
-- Translatable title, excerpt and body plus cover image, date and read time live in the
-- `content` JSON blob (see dal/dal.schema.ts: BlogPostContentDbSchema). Category reuses
-- termCategories; tags reuse the tags table via blogPostTags.

CREATE TABLE `blogPosts` (
  `postId` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL,
  `categoryRef` INT DEFAULT NULL,
  `isActive` TINYINT NOT NULL DEFAULT 1,
  `isFeatured` TINYINT NOT NULL DEFAULT 0,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `content` JSON DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `title_en` VARCHAR(255) GENERATED ALWAYS AS (content->>'$.title.en') STORED,
  `title_ar` VARCHAR(255) GENERATED ALWAYS AS (content->>'$.title.ar') STORED,
  PRIMARY KEY (`postId`),
  UNIQUE KEY `UQ_blogPosts_slug` (`slug`),
  KEY `IX_blogPosts_categoryRef` (`categoryRef`),
  FULLTEXT INDEX `ft_blogPosts_title` (title_en, title_ar),
  CONSTRAINT `FK_blogPosts_categoryRef` FOREIGN KEY (`categoryRef`) REFERENCES `termCategories` (`categoryId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: blogPostTags (Junction: blog post tags reuse the tags table)

CREATE TABLE `blogPostTags` (
  `postId` INT NOT NULL,
  `tagId` INT NOT NULL,
  PRIMARY KEY (`postId`,`tagId`),
  KEY `IX_blogPostTags_tagId` (`tagId`),
  CONSTRAINT `FK_blogPostTags_postId` FOREIGN KEY (`postId`) REFERENCES `blogPosts` (`postId`) ON DELETE CASCADE,
  CONSTRAINT `FK_blogPostTags_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`tagId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
