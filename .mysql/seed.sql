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

-- =================================================================
-- Sample members (network / collaborator profiles)
-- =================================================================
INSERT INTO `members` (`memberId`, `slug`, `displayOrder`, `isActive`, `isFeatured`, `content`) VALUES
(1, 'hassan-amer', 1, 1, 1, CAST('{\"photoUrl\":\"\",\"name\":{\"en\":\"Dr. Hassan Amer\",\"ar\":\"د. حسن عامر\"},\"role\":{\"en\":\"Director of Strategic Foresight\",\"ar\":\"مدير الاستشراف الاستراتيجي\"},\"social\":{\"email\":\"hassan@example.org\",\"linkedin\":\"https://www.linkedin.com/\",\"website\":\"https://example.org\"},\"professionalProfile\":{\"en\":\"He contributed to global reports like the Young Visionaries Report 2024, Global Outlook Report 2024 & 2025. He volunteered with UNDP Accelerator Labs both in Egypt and Cameroon.\",\"ar\":\"ساهم في تقارير عالمية مثل تقرير الحالمين الشباب 2024 وتقرير الآفاق العالمية 2024 و2025، وتطوّع مع مختبرات التسريع التابعة لبرنامج الأمم المتحدة الإنمائي في مصر والكاميرون.\"},\"favoriteWord\":{\"word\":{\"en\":\"Freedom\",\"ar\":\"حرية\"},\"explanation\":{\"en\":\"Why? cause it gives power to the people and I believe people\'s power is greater than the people in power.\",\"ar\":\"لماذا؟ لأنها تمنح القوة للناس، وأؤمن أن قوة الناس أعظم من الناس في السلطة.\"}},\"works\":[],\"links\":[]}' AS JSON)),
(2, 'rawan-mahmoud', 2, 1, 1, CAST('{\"photoUrl\":\"\",\"name\":{\"en\":\"Dr. Rawan Mahmoud\",\"ar\":\"د. روان محمود\"},\"role\":{\"en\":\"Director of Strategic Foresight\",\"ar\":\"مديرة الاستشراف الاستراتيجي\"},\"social\":{\"email\":\"rawan@example.org\",\"linkedin\":\"https://www.linkedin.com/\",\"website\":\"https://example.org\"},\"roleWithinAsf\":{\"en\":\"Rawan holds diverse roles within the Arab Futures Society. She has contributed to the research and organization efforts for the Arab Futures Lexicon, our flagship project.\",\"ar\":\"تشغل روان أدواراً متنوعة داخل جمعية المستقبلات العربية، وساهمت في جهود البحث والتنظيم لمعجم المستقبلات العربية، مشروعنا الرائد.\"},\"professionalProfile\":{\"en\":\"She contributed to global reports like the Young Visionaries Report 2024, Global Outlook Report 2024 & 2025.\",\"ar\":\"ساهمت في تقارير عالمية مثل تقرير الحالمين الشباب 2024 وتقرير الآفاق العالمية 2024 و2025.\"},\"favoriteWord\":{\"word\":{\"en\":\"Freedom\",\"ar\":\"حرية\"},\"explanation\":{\"en\":\"Why? cause it gives power to the people and I believe people\'s power is greater than the people in power.\",\"ar\":\"لماذا؟ لأنها تمنح القوة للناس، وأؤمن أن قوة الناس أعظم من الناس في السلطة.\"}},\"works\":[{\"imageUrl\":\"\",\"type\":\"Blog\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\",\"url\":\"\",\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"tags\":[\"Foresight Tools\",\"Futures Literacies\"]},{\"imageUrl\":\"\",\"type\":\"Blog\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\",\"url\":\"\",\"title\":{\"en\":\"Scenario Workshops\",\"ar\":\"ورش السيناريوهات\"},\"description\":{\"en\":\"How participatory scenario workshops build shared foresight capacity.\",\"ar\":\"كيف تبني ورش السيناريوهات التشاركية قدرة استشرافية مشتركة.\"},\"tags\":[\"Foresight Tools\",\"Futures Literacies\"]}],\"links\":[{\"label\":{\"en\":\"Media Kit\",\"ar\":\"الملف الإعلامي\"},\"url\":\"https://example.org\"},{\"label\":{\"en\":\"Contact for lectures\",\"ar\":\"للتواصل بشأن المحاضرات\"},\"url\":\"https://example.org\"}]}' AS JSON));

-- Library seed: collections, resources, and their relations
INSERT INTO `collections` (`collectionId`, `displayOrder`, `isActive`, `name`) VALUES
(1, 1, 1, CAST('{\"en\":\"Futures 101\",\"ar\":\"أساسيات المستقبل\"}' AS JSON)),
(2, 2, 1, CAST('{\"en\":\"Futures in Schools\",\"ar\":\"المستقبل في المدارس\"}' AS JSON));

INSERT INTO `resources` (`resourceId`, `type`, `categoryRef`, `language`, `isActive`, `displayOrder`, `content`) VALUES
(1, 'article', 2, 'ar', 1, 1, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Walid\",\"SK\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(2, 'report', 3, 'en', 1, 2, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Raya\",\"Haya\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(3, 'video', 1, 'ar', 1, 3, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Walid\",\"SK\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(4, 'book', 2, 'en', 1, 4, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Raya\",\"Haya\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(5, 'article', 3, 'ar', 1, 5, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Walid\",\"SK\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(6, 'report', 1, 'en', 1, 6, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Raya\",\"Haya\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(7, 'video', 2, 'ar', 1, 7, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Walid\",\"SK\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(8, 'book', 3, 'en', 1, 8, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Raya\",\"Haya\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON)),
(9, 'article', 1, 'ar', 1, 9, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"description\":{\"en\":\"An introduction to futures thinking and its growing practice across the region.\",\"ar\":\"مقدمة في التفكير المستقبلي وممارسته المتنامية في المنطقة.\"},\"authors\":[\"Walid\",\"SK\"],\"imageUrl\":\"\",\"url\":\"https://example.org\",\"date\":\"Jan 10, 2024\"}' AS JSON));

INSERT INTO `resourceCollections` (`resourceId`, `collectionId`) VALUES
(1, 2), (2, 1), (3, 2), (4, 1), (5, 2), (6, 1), (7, 2), (8, 1), (9, 2);

INSERT INTO `resourceTags` (`resourceId`, `tagId`) VALUES
(1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7), (7, 8), (8, 9), (9, 1);

-- Blog seed: posts + tags
INSERT INTO `blogPosts` (`postId`, `slug`, `categoryRef`, `isActive`, `isFeatured`, `displayOrder`, `content`) VALUES
(1, 'foresight-in-the-arab-world-1', 2, 1, 1, 1, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(2, 'foresight-in-the-arab-world-2', 3, 1, 1, 2, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(3, 'foresight-in-the-arab-world-3', 1, 1, 1, 3, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(4, 'foresight-in-the-arab-world-4', 2, 1, 0, 4, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(5, 'foresight-in-the-arab-world-5', 3, 1, 0, 5, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(6, 'foresight-in-the-arab-world-6', 1, 1, 0, 6, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(7, 'foresight-in-the-arab-world-7', 2, 1, 0, 7, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(8, 'foresight-in-the-arab-world-8', 3, 1, 0, 8, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON)),
(9, 'foresight-in-the-arab-world-9', 1, 1, 0, 9, CAST('{\"title\":{\"en\":\"Foresight In The Arab World\",\"ar\":\"الاستشراف في العالم العربي\"},\"excerpt\":{\"en\":\"How futures thinking is taking root across the region and why it matters now.\",\"ar\":\"كيف يترسّخ التفكير المستقبلي في المنطقة ولماذا يهمّ الآن.\"},\"body\":{\"en\":\"Futures thinking is a discipline, not a prediction.\\n\\nAcross the Arab world, a growing community of researchers and practitioners is building the language, tools and networks to imagine and shape preferable futures. This post introduces the core ideas and how to get involved.\",\"ar\":\"التفكير المستقبلي ممارسة منهجية وليس تنبؤاً.\\n\\nفي العالم العربي، يتنامى مجتمع من الباحثين والممارسين يبني اللغة والأدوات والشبكات لتخيّل مستقبلات مفضّلة وصياغتها. يقدّم هذا المقال الأفكار الأساسية وكيفية المشاركة.\"},\"coverImageUrl\":\"\",\"date\":\"Jan 10, 2024\",\"readTime\":\"3 min read\"}' AS JSON));

INSERT INTO `blogPostTags` (`postId`, `tagId`) VALUES
(1, 2), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7), (7, 8), (8, 9), (9, 1);
