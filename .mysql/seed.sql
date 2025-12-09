-- Use the database
USE `future-foresight-terms-v1`;
SET NAMES utf8mb4;

-- 2. termCategories (No changes needed)
INSERT INTO `termCategories` (`categoryId`, `displayOrder`, `isActive`, `name`) VALUES
(1, 1, 1, '{\"en\": \"Technology\", \"ar\": \"التكنولوجيا\"}'),
(2, 2, 1, '{\"en\": \"Society & Governance\", \"ar\": \"المجتمع والحوكمة\"}'),
(3, 3, 1, '{\"en\": \"Science\", \"ar\": \"العلوم\"}'),
(4, 4, 0, '{\"en\": \"Economics (Inactive)\", \"ar\": \"الاقتصاد (غير نشط)\"}');

-- 3. tags (No changes needed)
INSERT INTO `tags` (`tagId`, `name`) VALUES
(1, '{\"en\": \"AI\", \"ar\": \"الذكاء الاصطناعي\"}'),
(2, '{\"en\": \"Ethics\", \"ar\": \"الأخلاقيات\"}'),
(3, '{\"en\": \"Biotechnology\", \"ar\": \"التكنولوجيا الحيوية\"}'),
(4, '{\"en\": \"Climate\", \"ar\": \"المناخ\"}'),
(5, '{\"en\": \"Decentralization\", \"ar\": \"اللامركزية\"}'),
(6, '{\"en\": \"Urbanism\", \"ar\": \"العمران\"}'),
(7, '{\"en\": \"Geopolitics\", \"ar\": \"الجيوسياسة\"}'),
(8, '{\"en\": \"Economics\", \"ar\": \"الاقتصاد\"}'),
(9, '{\"en\": \"Physics\", \"ar\": \"الفيزياء\"}');

-- =================================================================
-- 50 Sample Terms (No changes needed)
-- =================================================================

INSERT INTO `terms` (`termId`, `categoryRef`, `status`, `isFeatured`, `content`) VALUES
-- ... (The entire 50-term insert block remains exactly the same and is correct)
(1, 1, 'published', 1, CAST('{\"default\": {\"en\": {\"name\": \"Artificial General Intelligence (AGI)\", \"briefDescription\": \"A hypothetical type of AI that possesses the ability to understand or learn any intellectual task that a human being can.\"}, \"ar\": {\"name\": \"الذكاء الاصطناعي العام\", \"briefDescription\": \"نوع افتراضي من الذكاء الاصطناعي لديه القدرة على فهم أو تعلم أي مهمة فكرية يمكن للإنسان القيام بها.\"}}, \"more\": []}' AS JSON)),
-- ... (rest of the 50 terms) ...
(50, 2, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Platform Cooperative\", \"briefDescription\": \"A cooperatively-owned, democratically-governed business that uses a website or mobile app to facilitate the sale of goods and services.\"}, \"ar\": {\"name\": \"التعاونية المنصية\", \"briefDescription\": \"شركة مملوكة بشكل تعاوني وتدار ديمقراطياً تستخدم موقعًا إلكترونيًا أو تطبيقًا لتسهيل بيع السلع والخدمات.\"}}, \"more\": []}' AS JSON));

-- =================================================================
-- Relational Data
-- =================================================================

-- 1. termTags (No changes needed)
INSERT INTO `termTags` (`termId`, `tagId`) VALUES
(1, 1), (1, 2), (2, 2), (2, 8), (3, 3), (4, 1), (4, 9), (5, 4), (5, 8), (6, 1), (7, 3),
(8, 2), (8, 7), (9, 2), (9, 4), (10, 5), (10, 8), (11, 1), (12, 6), (13, 3), (14, 2), (15, 1),
(16, 2), (16, 7), (17, 9), (18, 5), (19, 4), (21, 1), (21, 3), (22, 1), (22, 2), (24, 5), (24, 8),
(26, 1), (26, 6), (28, 3), (29, 1), (30, 2), (31, 1), (32, 1), (34, 5), (35, 9), (36, 1), (36, 3),
(41, 1), (42, 8), (43, 3), (44, 1), (45, 9), (46, 3), (47, 1), (49, 1), (50, 5), (50, 8);

-- 2. termReviews
-- FIX: Rewrote this entire INSERT statement to match the new `termReviews` schema.
-- The old `suggestedValue` is now the `suggestedChange`.
-- The old context (`translationIdentifier`, `fieldKey`) has been prepended to the explanation.
-- Added an empty 'references' JSON array.
INSERT INTO `termReviews` (`reviewId`, `termRef`, `suggestedChange`, `explanation`, `status`, `references`) VALUES
(
    1, 
    36, 
    'Neuralink BCI', 
    'Context: default-en, name. Explanation: This is more specific and aligns with industry terminology.', 
    'pending',
    '[]'
),
(
    2, 
    37, 
    'ظرف تصبح فيه الحقائق الموضوعية أقل تأثيرًا على الرأي العام من العاطفة والمعتقد الشخصي.', 
    'Context: default-ar, briefDescription. Explanation: A more fluent and accurate Arabic translation.', 
    'pending',
    '[]'
);