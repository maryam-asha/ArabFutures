DROP SCHEMA IF EXISTS `future-foresight-terms-v1`;
CREATE SCHEMA `future-foresight-terms-v1` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `future-foresight-terms-v1`;

-- =================================================================
-- AUTHENTICATION TABLES
-- =================================================================

CREATE TABLE `users` (
  `userId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `version` INT UNSIGNED NOT NULL DEFAULT 1,
  `isForbidden` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  CONSTRAINT `UQ_users_username` UNIQUE KEY (`username`)
);

CREATE TABLE `revokedTokens` (
    `jti` VARCHAR(36) NOT NULL,
    `expiresAt` TIMESTAMP NOT NULL,
    PRIMARY KEY (`jti`),
    INDEX `IX_revokedTokens_expiresAt` (`expiresAt`)
);

-- =================================================================
-- BILINGUAL KNOWLEDGE LEXICON (GLOSSARY)
-- =================================================================
CREATE TABLE `termCategories` (
  `categoryId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `displayOrder` INT NOT NULL DEFAULT 100000,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryId`)
);

CREATE TABLE `termCategoryTranslations` (
  `categoryTranslationId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoryRef` INT UNSIGNED NOT NULL,
  `locale` VARCHAR(5) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`categoryTranslationId`),
  CONSTRAINT `UQ_termCategoryTranslations_locale` UNIQUE KEY (`categoryRef`, `locale`),
  CONSTRAINT `FK_termCategoryTranslations_ref` FOREIGN KEY (`categoryRef`) REFERENCES `termCategories` (`categoryId`) ON DELETE CASCADE
);
ALTER TABLE `termCategoryTranslations` ADD INDEX `IX_termCategoryTranslations_categoryRef` (`categoryRef`);

CREATE TABLE `terms` (
  `termId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- MODIFIED: Changed to NULL to allow terms without a category for more flexibility.
  `categoryRef` INT UNSIGNED NULL,
  `status` ENUM('pending', 'published') NOT NULL DEFAULT 'pending',
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`termId`),
  CONSTRAINT `FK_categories_ref` FOREIGN KEY (`categoryRef`) REFERENCES `termCategories` (`categoryId`) ON DELETE SET NULL
);
ALTER TABLE `terms` ADD INDEX `IX_terms_categoryRef` (`categoryRef`);

CREATE TABLE `termTranslations` (
  `termTranslationId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `termRef` INT UNSIGNED NOT NULL,
  `locale` VARCHAR(5) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `briefDescription` TEXT NULL,
  `fullDetail` TEXT NULL,
  PRIMARY KEY (`termTranslationId`),
  CONSTRAINT `UQ_termTranslations_locale` UNIQUE KEY (`termRef`, `locale`),
  CONSTRAINT `FK_termTranslation_ref` FOREIGN KEY (`termRef`) REFERENCES `terms` (`termId`) ON DELETE CASCADE
);
ALTER TABLE `termTranslations` ADD INDEX `IX_termTranslations_termRef` (`termRef`);

-- =================================================================
-- NEW TABLE FOR TERM REFERENCES
-- This is the professional, relational approach.
-- It creates a one-to-many relationship between a translated term and its references.
-- =================================================================
CREATE TABLE `termReferences` (
  `referenceId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `termRef` INT UNSIGNED NOT NULL,
  `locale` VARCHAR(5) NOT NULL,
  `content` TEXT NOT NULL,
  `url` VARCHAR(2048) NULL, -- Optional URL, increased length for modern links.
  PRIMARY KEY (`referenceId`),
  -- This foreign key ensures that references are tied to a specific translation (term + locale).
  -- ON DELETE CASCADE means if a term is deleted, these references are automatically cleaned up.
  CONSTRAINT `FK_termReferences_term_translation_ref` FOREIGN KEY (`termRef` , `locale`) REFERENCES `termTranslations` (`termRef` , `locale`) ON DELETE CASCADE,
  INDEX `IX_termReferences_termRef_locale` (`termRef`, `locale`)
);

CREATE TABLE `tags` (
  `tagId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tagId`)
);

CREATE TABLE `tagTranslations` (
  `tagTranslationId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tagRef` INT UNSIGNED NOT NULL,
  `locale` VARCHAR(5) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`tagTranslationId`),
  CONSTRAINT `UQ_tagTranslations_locale` UNIQUE KEY (`tagRef`, `locale`),
  CONSTRAINT `FK_tagTranslations_ref` FOREIGN KEY (`tagRef`) REFERENCES `tags` (`tagId`) ON DELETE CASCADE
);
ALTER TABLE `tagTranslations` ADD INDEX `IX_tagTranslations_tagRef` (`tagRef`);

CREATE TABLE `termTags` (
  `termId` INT UNSIGNED NOT NULL,
  `tagId` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`termId`, `tagId`),
  CONSTRAINT `FK_term_tags_termId`
    FOREIGN KEY (`termId`)
    REFERENCES `terms` (`termId`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_term_tags_tagId`
    FOREIGN KEY (`tagId`)
    REFERENCES `tags` (`tagId`)
    ON DELETE CASCADE
);
ALTER TABLE `termTags` ADD INDEX `IX_terms_ref` (`termId`);
ALTER TABLE `termTags` ADD INDEX `IX_tags_ref` (`tagId`);

-- =================================================================
-- FORESIGHT TOOLS & CASE STUDIES (UNCHANGED)
-- =================================================================
CREATE TABLE `tools` (
  `toolId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `displayOrder` INT NOT NULL DEFAULT 100000,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`toolId`)
);

CREATE TABLE `toolTranslations` (
  `toolTranslationId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `toolRef` INT UNSIGNED NOT NULL,
  `locale` VARCHAR(5) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `methodology` VARCHAR(255) NULL, -- e.g., Forecasting, Trend Analysis
  PRIMARY KEY (`toolTranslationId`),
  CONSTRAINT `UQ_toolTranslations_locale` UNIQUE KEY (`toolRef`, `locale`),
  CONSTRAINT `FK_toolTranslations_toolRef` FOREIGN KEY (`toolRef`) REFERENCES `tools` (`toolId`) ON DELETE CASCADE
);
ALTER TABLE `toolTranslations` ADD INDEX `IX_toolTranslations_toolRef` (`toolRef`);


-- =================================================================
-- THOUGHT LEADERSHIP BLOG (UNCHANGED)
-- =================================================================
CREATE TABLE `articles` (
  `articleId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `authorName` VARCHAR(255) NOT NULL,
  `readTimeMinutes` INT NOT NULL DEFAULT 5,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `publishedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`articleId`)
);

CREATE TABLE `articleTranslations` (
    `articleTranslationId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `articleRef` INT UNSIGNED NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `category` VARCHAR(100) NULL,
    PRIMARY KEY (`articleTranslationId`),
    CONSTRAINT `UQ_articleTranslations_locale` UNIQUE KEY (`articleRef` , `locale`),
    CONSTRAINT `FK_articleTranslations_ref` FOREIGN KEY (`articleRef`)
        REFERENCES `articles` (`articleId`)
        ON DELETE CASCADE
);
ALTER TABLE `articleTranslations` ADD INDEX `IX_articleTranslations_articleRef` (`articleRef`);