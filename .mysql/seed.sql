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
-- Sample Terms
-- NOTE: This file historically shipped 50 sample terms, but the middle of the
-- INSERT block (terms 2–49) was dropped upstream and only terms 1 and 50
-- survived. The relational data below has been trimmed to reference only the
-- terms that actually exist, so the seed loads cleanly. Add more real terms
-- here (with accurate en/ar content) to flesh out the demo dataset.
-- =================================================================

INSERT INTO `terms` (`termId`, `categoryRef`, `status`, `isFeatured`, `content`) VALUES
(1, 1, 'has-pending-review', 1, CAST('{\"default\": {\"en\": {\"name\": \"Artificial General Intelligence (AGI)\", \"briefDescription\": \"A hypothetical type of AI that possesses the ability to understand or learn any intellectual task that a human being can.\"}, \"ar\": {\"name\": \"الذكاء الاصطناعي العام\", \"briefDescription\": \"نوع افتراضي من الذكاء الاصطناعي لديه القدرة على فهم أو تعلم أي مهمة فكرية يمكن للإنسان القيام بها.\"}}, \"more\": []}' AS JSON)),
(50, 2, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Platform Cooperative\", \"briefDescription\": \"A cooperatively-owned, democratically-governed business that uses a website or mobile app to facilitate the sale of goods and services.\"}, \"ar\": {\"name\": \"التعاونية المنصية\", \"briefDescription\": \"شركة مملوكة بشكل تعاوني وتدار ديمقراطياً تستخدم موقعًا إلكترونيًا أو تطبيقًا لتسهيل بيع السلع والخدمات.\"}}, \"more\": []}' AS JSON));

-- =================================================================
-- Relational Data
-- =================================================================

-- 1. termTags — only pairs that reference existing terms (1, 50) and tags.
INSERT INTO `termTags` (`termId`, `tagId`) VALUES
(1, 1), (1, 2), (50, 5), (50, 8);

-- 2. termReviews — pending public suggestions against the published term (1),
-- which is why term 1 is seeded as 'has-pending-review'.
INSERT INTO `termReviews` (`reviewId`, `termRef`, `suggestedChange`, `explanation`, `status`, `references`) VALUES
(
    1,
    1,
    'Artificial General Intelligence (Strong AI)',
    'Context: default-en, name. Explanation: Adds the common synonym "Strong AI" for clarity.',
    'pending',
    '[]'
),
(
    2,
    1,
    'ذكاء اصطناعي عام قادر على أداء أي مهمة فكرية بمستوى الإنسان.',
    'Context: default-ar, briefDescription. Explanation: A more fluent and accurate Arabic phrasing.',
    'pending',
    '[]'
);