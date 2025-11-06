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
CREATE TABLE `termCategories` (
  `categoryId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `displayOrder` INT NOT NULL DEFAULT 100000,
  `name` JSON NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`categoryId`)
);

CREATE TABLE `terms` (
  `termId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `categoryRef` INT UNSIGNED NULL,
  `title`JSON NOT NULL,
  `briefDescription` TEXT NULL,
  `fullDetail` TEXT NULL,
  `status` ENUM('pending', 'published') NOT NULL DEFAULT 'pending',
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`termId`),
  CONSTRAINT `FK_categories_ref` FOREIGN KEY (`categoryRef`) REFERENCES `termCategories` (`categoryId`) ON DELETE SET NULL
);
ALTER TABLE `terms` ADD INDEX `IX_terms_categoryRef` (`categoryRef`);

CREATE TABLE `tags` (
  `tagId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` JSON NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tagId`)
);

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
-- THOUGHT LEADERSHIP BLOG ARTICLES
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