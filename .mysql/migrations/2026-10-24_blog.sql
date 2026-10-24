-- =================================================================
-- Migration: blog (blogPosts + blogPostTags)
-- Safe to run on an EXISTING database — only CREATEs the new tables, never
-- drops or touches existing data. Re-runnable (IF NOT EXISTS).
--
-- Usage (Laragon / local):
--   mysql -u root -p future-foresight-terms-v1 < .mysql/migrations/2026-10-24_blog.sql
-- =================================================================

USE `future-foresight-terms-v1`;
SET NAMES utf8mb4;

-- Table: blogPosts (Blog / insights articles)
CREATE TABLE IF NOT EXISTS `blogPosts` (
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
CREATE TABLE IF NOT EXISTS `blogPostTags` (
  `postId` INT NOT NULL,
  `tagId` INT NOT NULL,
  PRIMARY KEY (`postId`,`tagId`),
  KEY `IX_blogPostTags_tagId` (`tagId`),
  CONSTRAINT `FK_blogPostTags_postId` FOREIGN KEY (`postId`) REFERENCES `blogPosts` (`postId`) ON DELETE CASCADE,
  CONSTRAINT `FK_blogPostTags_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`tagId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
