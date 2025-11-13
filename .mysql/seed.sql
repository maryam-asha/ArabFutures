
-- =================================================================
-- Expanded Seed Data (v2.1)
-- Contains 50 realistic terms with full status distribution.
--
-- Instructions:
-- 1. Ensure `schema.sql` has been executed successfully.
-- 2. Replace `your_database_name` with your actual database name.
-- 3. Run this script in your MySQL/MariaDB client.
-- =================================================================

-- Use the database
USE `future-foresight-terms-v1`;
SET NAMES utf8mb4;

-- =================================================================
-- Core Data
-- =================================================================

-- 1. users
-- Password for 'admin' is 'admin123'
INSERT INTO `users` (`userId`, `username`, `passwordHash`) VALUES
(1, 'admin', '$2a$10$3f2d2l6.y0b1e3Z/5J8gAOiZ8M.5t3H8x8D.KzB.Y8o8B.Y0b1e3Z');

-- 2. termCategories
INSERT INTO `termCategories` (`categoryId`, `displayOrder`, `isActive`, `name`) VALUES
(1, 1, 1, '{\"en\": \"Technology\", \"ar\": \"التكنولوجيا\"}'),
(2, 2, 1, '{\"en\": \"Society & Governance\", \"ar\": \"المجتمع والحوكمة\"}'),
(3, 3, 1, '{\"en\": \"Science\", \"ar\": \"العلوم\"}'),
(4, 4, 0, '{\"en\": \"Economics (Inactive)\", \"ar\": \"الاقتصاد (غير نشط)\"}');

-- 3. tags
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
-- 50 Sample Terms
-- =================================================================

INSERT INTO `terms` (`termId`, `categoryRef`, `status`, `isFeatured`, `content`) VALUES
-- Published & Featured
(1, 1, 'published', 1, CAST('{\"default\": {\"en\": {\"name\": \"Artificial General Intelligence (AGI)\", \"briefDescription\": \"A hypothetical type of AI that possesses the ability to understand or learn any intellectual task that a human being can.\"}, \"ar\": {\"name\": \"الذكاء الاصطناعي العام\", \"briefDescription\": \"نوع افتراضي من الذكاء الاصطناعي لديه القدرة على فهم أو تعلم أي مهمة فكرية يمكن للإنسان القيام بها.\"}}, \"more\": []}' AS JSON)),
(2, 2, 'published', 1, CAST('{\"default\": {\"en\": {\"name\": \"Universal Basic Income (UBI)\", \"briefDescription\": \"A social security model where all citizens of a country regularly receive an unconditional sum of money.\"}, \"ar\": {\"name\": \"الدخل الأساسي الشامل\", \"briefDescription\": \"نموذج للضمان الاجتماعي يتلقى فيه جميع مواطني الدولة مبلغًا غير مشروط من المال بانتظام.\"}}, \"more\": []}' AS JSON)),
(3, 3, 'published', 1, CAST('{\"default\": {\"en\": {\"name\": \"CRISPR\", \"briefDescription\": \"A gene-editing technology that enables geneticists and medical researchers to edit parts of the genome.\"}, \"ar\": {\"name\": \"كريسبر\", \"briefDescription\": \"تقنية لتحرير الجينات تُمكّن علماء الوراثة والباحثين الطبيين من تعديل أجزاء من الجينوم.\"}}, \"more\": []}' AS JSON)),
(4, 1, 'published', 1, CAST('{\"default\": {\"en\": {\"name\": \"Quantum Computing\", \"briefDescription\": \"A type of computation that uses quantum-mechanical phenomena like superposition and entanglement.\"}, \"ar\": {\"name\": \"الحوسبة الكمومية\", \"briefDescription\": \"نوع من الحوسبة يستخدم الظواهر الميكانيكية الكمومية مثل التراكب والتشابك.\"}}, \"more\": []}' AS JSON)),
(5, 2, 'published', 1, CAST('{\"default\": {\"en\": {\"name\": \"Circular Economy\", \"briefDescription\": \"An economic system aimed at eliminating waste and the continual use of resources.\"}, \"ar\": {\"name\": \"الاقتصاد الدائري\", \"briefDescription\": \"نظام اقتصادي يهدف إلى القضاء على النفايات والاستخدام المستمر للموارد.\"}}, \"more\": []}' AS JSON)),

-- Published (Normal)
(6, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Edge Computing\", \"briefDescription\": \"A distributed computing paradigm that brings computation and data storage closer to the sources of data.\"}, \"ar\": {\"name\": \"الحوسبة الحافية\", \"briefDescription\": \"نموذج حوسبة موزع يقرب الحوسبة وتخزين البيانات من مصادرها.\"}}, \"more\": []}' AS JSON)),
(7, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Synthetic Biology\", \"briefDescription\": \"The design and construction of new biological parts, devices, and systems.\"}, \"ar\": {\"name\": \"البيولوجيا الاصطناعية\", \"briefDescription\": \"تصميم وبناء أجزاء وأجهزة وأنظمة بيولوجية جديدة.\"}}, \"more\": []}' AS JSON)),
(8, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Liquid Democracy\", \"briefDescription\": \"A form of delegative democracy whereby an electorate can delegate their voting power to delegates.\"}, \"ar\": {\"name\": \"الديمقراطية السائلة\", \"briefDescription\": \"شكل من أشكال الديمقراطية التفويضية حيث يمكن للناخبين تفويض سلطتهم التصويتية لمندوبين.\"}}, \"more\": []}' AS JSON)),
(9, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Geoengineering\", \"briefDescription\": \"The deliberate large-scale manipulation of an environmental process that affects the earth''s climate.\"}, \"ar\": {\"name\": \"الهندسة الجيولوجية\", \"briefDescription\": \"التلاعب المتعمد على نطاق واسع في عملية بيئية تؤثر على مناخ الأرض.\"}}, \"more\": []}' AS JSON)),
(10, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Decentralized Autonomous Organization (DAO)\", \"briefDescription\": \"An organization represented by rules encoded as a computer program that is transparent and controlled by members.\"}, \"ar\": {\"name\": \"منظمة مستقلة لامركزية (DAO)\", \"briefDescription\": \"منظمة ممثلة بقواعد مشفرة كبرنامج كمبيوتر شفاف ويتحكم فيه الأعضاء.\"}}, \"more\": []}' AS JSON)),
(11, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Generative AI\", \"briefDescription\": \"Artificial intelligence capable of generating text, images, or other media in response to prompts.\"}, \"ar\": {\"name\": \"الذكاء الاصطناعي التوليدي\", \"briefDescription\": \"ذكاء اصطناعي قادر على توليد نصوص أو صور أو وسائط أخرى استجابةً للمدخلات.\"}}, \"more\": []}' AS JSON)),
(12, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Smart Cities\", \"briefDescription\": \"An urban area that uses different types of electronic methods and sensors to collect data.\"}, \"ar\": {\"name\": \"المدن الذكية\", \"briefDescription\": \"منطقة حضرية تستخدم أنواعًا مختلفة من الأساليب الإلكترونية وأجهزة الاستشعار لجمع البيانات.\"}}, \"more\": []}' AS JSON)),
(13, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Longevity Escape Velocity\", \"briefDescription\": \"A hypothetical situation in which life expectancy is extended longer than the time that is passing.\"}, \"ar\": {\"name\": \"سرعة الهروب من الشيخوخة\", \"briefDescription\": \"وضع افتراضي يتم فيه إطالة متوسط العمر المتوقع لفترة أطول من الوقت الذي يمر.\"}}, \"more\": []}' AS JSON)),
(14, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Precautionary Principle\", \"briefDescription\": \"A strategy for approaching issues of potential harm when extensive scientific knowledge on the matter is lacking.\"}, \"ar\": {\"name\": \"المبدأ الوقائي\", \"briefDescription\": \"استراتيجية للتعامل مع قضايا الضرر المحتمل عندما تفتقر المعرفة العلمية الشاملة حول المسألة.\"}}, \"more\": []}' AS JSON)),
(15, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"The Singularity\", \"briefDescription\": \"A hypothetical point in time at which technological growth becomes uncontrollable and irreversible.\"}, \"ar\": {\"name\": \"التفرد التكنولوجي\", \"briefDescription\": \"نقطة زمنية افتراضية يصبح فيها النمو التكنولوجي غير قابل للسيطرة ولا رجعة فيه.\"}}, \"more\": []}' AS JSON)),
(16, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Existential Risk\", \"briefDescription\": \"A risk that threatens the premature extinction of Earth-originating intelligent life or the permanent and drastic destruction of its potential for future development.\"}, \"ar\": {\"name\": \"الخطر الوجودي\", \"briefDescription\": \"خطر يهدد بالانقراض المبكر للحياة الذكية التي نشأت على الأرض أو التدمير الدائم والجذري لإمكاناتها للتطور المستقبلي.\"}}, \"more\": []}' AS JSON)),
(17, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Kardashev Scale\", \"briefDescription\": \"A method of measuring a civilization''s level of technological advancement based on the amount of energy it is able to use.\"}, \"ar\": {\"name\": \"مقياس كارداشيف\", \"briefDescription\": \"طريقة لقياس مستوى التقدم التكنولوجي للحضارة بناءً على كمية الطاقة التي يمكنها استخدامها.\"}}, \"more\": []}' AS JSON)),
(18, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Blockchain\", \"briefDescription\": \"A distributed, immutable ledger that is used to record transactions and track assets.\"}, \"ar\": {\"name\": \"بلوك تشين\", \"briefDescription\": \"سجل حسابات موزع وغير قابل للتغيير يستخدم لتسجيل المعاملات وتتبع الأصول.\"}}, \"more\": []}' AS JSON)),
(19, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Carbon Sequestration\", \"briefDescription\": \"The process of capturing and storing atmospheric carbon dioxide.\"}, \"ar\": {\"name\": \"عزل الكربون\", \"briefDescription\": \"عملية التقاط وتخزين ثاني أكسيد الكربون في الغلاف الجوي.\"}}, \"more\": []}' AS JSON)),
(20, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Noosphere\", \"briefDescription\": \"The sphere of human thought.\"}, \"ar\": {\"name\": \"النوسفير\", \"briefDescription\": \"محيط الفكر البشري.\"}}, \"more\": []}' AS JSON)),
(21, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Brain-Computer Interface (BCI)\", \"briefDescription\": \"A direct communication pathway between an enhanced or wired brain and an external device.\"}, \"ar\": {\"name\": \"واجهة الدماغ والحاسوب\", \"briefDescription\": \"مسار اتصال مباشر بين دماغ معزز أو سلكي وجهاز خارجي.\"}}, \"more\": []}' AS JSON)),
(22, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Algorithmic Governance\", \"briefDescription\": \"The use of computer algorithms to regulate society and make governmental decisions.\"}, \"ar\": {\"name\": \"الحوكمة الخوارزمية\", \"briefDescription\": \"استخدام خوارزميات الكمبيوتر لتنظيم المجتمع واتخاذ القرارات الحكومية.\"}}, \"more\": []}' AS JSON)),
(23, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Anthropocene\", \"briefDescription\": \"The current geological age, viewed as the period during which human activity has been the dominant influence on climate and the environment.\"}, \"ar\": {\"name\": \"الأنثروبوسين\", \"briefDescription\": \"العصر الجيولوجي الحالي، الذي يُنظر إليه على أنه الفترة التي كان فيها النشاط البشري هو التأثير المهيمن على المناخ والبيئة.\"}}, \"more\": []}' AS JSON)),
(24, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Tokenomics\", \"briefDescription\": \"The study of the economic systems based on blockchain tokens.\"}, \"ar\": {\"name\": \"اقتصاديات الرموز\", \"briefDescription\": \"دراسة النظم الاقتصادية القائمة على الرموز الرقمية (التوكنز) في البلوك تشين.\"}}, \"more\": []}' AS JSON)),
(25, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Fourth Industrial Revolution\", \"briefDescription\": \"The current and developing environment in which disruptive technologies and trends are changing the way we live, work and relate to one another.\"}, \"ar\": {\"name\": \"الثورة الصناعية الرابعة\", \"briefDescription\": \"البيئة الحالية والمتطورة التي تغير فيها التقنيات والاتجاهات المبتكرة طريقة عيشنا وعملنا وعلاقاتنا ببعضنا البعض.\"}}, \"more\": []}' AS JSON)),
(26, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Digital Twin\", \"briefDescription\": \"A virtual model designed to accurately reflect a physical object.\"}, \"ar\": {\"name\": \"التوأم الرقمي\", \"briefDescription\": \"نموذج افتراضي مصمم ليعكس بدقة كائنًا ماديًا.\"}}, \"more\": []}' AS JSON)),
(27, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Sovereign Individual\", \"briefDescription\": \"A concept of a future where individuals have greater autonomy due to technological and economic shifts.\"}, \"ar\": {\"name\": \"الفرد ذو السيادة\", \"briefDescription\": \"مفهوم لمستقبل يتمتع فيه الأفراد باستقلالية أكبر بسبب التحولات التكنولوجية والاقتصادية.\"}}, \"more\": []}' AS JSON)),
(28, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Biohacking\", \"briefDescription\": \"The activity of exploiting genetic material experimentally without regard to accepted ethical standards.\"}, \"ar\": {\"name\": \"القرصنة البيولوجية\", \"briefDescription\": \"نشاط استغلال المواد الوراثية تجريبياً دون مراعاة للمعايير الأخلاقية المقبولة.\"}}, \"more\": []}' AS JSON)),
(29, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Internet of Things (IoT)\", \"briefDescription\": \"A system of interrelated computing devices that have the ability to transfer data over a network without requiring human-to-human or human-to-computer interaction.\"}, \"ar\": {\"name\": \"إنترنت الأشياء\", \"briefDescription\": \"نظام من أجهزة الحوسبة المترابطة التي لديها القدرة على نقل البيانات عبر شبكة دون الحاجة إلى تفاعل بين البشر أو بين الإنسان والحاسوب.\"}}, \"more\": []}' AS JSON)),
(30, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Resilience\", \"briefDescription\": \"The capacity of a system to absorb disturbance and reorganize while undergoing change so as to still retain essentially the same function.\"}, \"ar\": {\"name\": \"المرونة\", \"briefDescription\": \"قدرة النظام على استيعاب الاضطرابات وإعادة تنظيم نفسه أثناء التغيير مع الحفاظ على نفس الوظيفة الأساسية.\"}}, \"more\": []}' AS JSON)),
(31, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Exocortex\", \"briefDescription\": \"A theoretical artificial external information processing system that would augment a brain''s biological high-level cognitive processes.\"}, \"ar\": {\"name\": \"القشرة الخارجية\", \"briefDescription\": \"نظام معالجة معلومات خارجي اصطناعي نظري من شأنه أن يزيد من العمليات المعرفية عالية المستوى للدماغ.\"}}, \"more\": []}' AS JSON)),
(32, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Augmented Reality (AR)\", \"briefDescription\": \"An interactive experience of a real-world environment where the objects that reside in the real world are enhanced by computer-generated perceptual information.\"}, \"ar\": {\"name\": \"الواقع المعزز\", \"briefDescription\": \"تجربة تفاعلية لبيئة واقعية حيث يتم تعزيز الكائنات الموجودة في العالم الحقيقي بواسطة معلومات إدراكية مولدة بالحاسوب.\"}}, \"more\": []}' AS JSON)),
(33, 2, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Global Brain\", \"briefDescription\": \"A metaphor for the collective intelligence of the human population, resulting from the interconnectivity of individuals.\"}, \"ar\": {\"name\": \"العقل العالمي\", \"briefDescription\": \"استعارة للذكاء الجماعي للسكان البشريين، الناتج عن الترابط بين الأفراد.\"}}, \"more\": []}' AS JSON)),
(34, 1, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Zero-Knowledge Proof\", \"briefDescription\": \"A method by which one party can prove to another party that they know a value, without conveying any information apart from the fact that they know the value.\"}, \"ar\": {\"name\": \"إثبات المعرفة الصفرية\", \"briefDescription\": \"طريقة يمكن من خلالها لطرف أن يثبت لطرف آخر أنه يعرف قيمة ما، دون نقل أي معلومات باستثناء حقيقة أنه يعرف القيمة.\"}}, \"more\": []}' AS JSON)),
(35, 3, 'published', 0, CAST('{\"default\": {\"en\": {\"name\": \"Dyson Sphere\", \"briefDescription\": \"A hypothetical megastructure that completely encompasses a star and captures a large percentage of its solar power output.\"}, \"ar\": {\"name\": \"كرة دايسون\", \"briefDescription\": \"بنية ضخمة افتراضية تحيط بنجم بالكامل وتلتقط نسبة كبيرة من ناتج طاقته الشمسية.\"}}, \"more\": []}' AS JSON)),

-- Has Pending Review
(36, 1, 'has-pending-review', 0, CAST('{\"default\": {\"en\": {\"name\": \"Neuralink\", \"briefDescription\": \"A neurotechnology company developing implantable brain-machine interfaces.\"}, \"ar\": {\"name\": \"نيورالينك\", \"briefDescription\": \"شركة تكنولوجيا عصبية تطور واجهات دماغ-آلة قابلة للزرع.\"}}, \"more\": []}' AS JSON)),
(37, 2, 'has-pending-review', 0, CAST('{\"default\": {\"en\": {\"name\": \"Post-Truth\", \"briefDescription\": \"Relating to circumstances in which objective facts are less influential in shaping public opinion than appeals to emotion and personal belief.\"}, \"ar\": {\"name\": \"ما بعد الحقيقة\", \"briefDescription\": \"تتعلق بالظروف التي تكون فيها الحقائق الموضوعية أقل تأثيرًا في تشكيل الرأي العام من النداءات إلى العاطفة والمعتقد الشخصي.\"}}, \"more\": []}' AS JSON)),

-- Rejected
(38, 1, 'rejected', 0, CAST('{\"default\": {\"en\": {\"name\": \"Free Energy Machine\", \"briefDescription\": \"A hypothetical machine that violates the laws of thermodynamics.\"}, \"ar\": {\"name\": \"آلة الطاقة الحرة\", \"briefDescription\": \"آلة افتراضية تنتهك قوانين الديناميكا الحرارية.\"}}, \"more\": []}' AS JSON)),
(39, 2, 'rejected', 0, CAST('{\"default\": {\"en\": {\"name\": \"Spam Submission\", \"briefDescription\": \"This is an example of a rejected term.\"}, \"ar\": {\"name\": \"إرسال مزعج\", \"briefDescription\": \"هذا مثال على مصطلح مرفوض.\"}}, \"more\": []}' AS JSON)),
(40, 3, 'rejected', 0, CAST('{\"default\": {\"en\": {\"name\": \"Gibberish123\", \"briefDescription\": \"Invalid content.\"}, \"ar\": {\"name\": \"كلام فارغ123\", \"briefDescription\": \"محتوى غير صالح.\"}}, \"more\": []}' AS JSON)),

-- Pending
(41, 1, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Swarm Robotics\", \"briefDescription\": \"An approach to the coordination of multiple robots as a system.\"}, \"ar\": {\"name\": \"روبوتات السرب\", \"briefDescription\": \"نهج لتنسيق روبوتات متعددة كنظام واحد.\"}}, \"more\": []}' AS JSON)),
(42, 2, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Attention Economy\", \"briefDescription\": \"An approach to the management of information that treats human attention as a scarce commodity.\"}, \"ar\": {\"name\": \"اقتصاد الانتباه\", \"briefDescription\": \"نهج لإدارة المعلومات يعامل انتباه الإنسان كسلعة نادرة.\"}}, \"more\": []}' AS JSON)),
(43, 3, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Astrobiology\", \"briefDescription\": \"The study of the origin, evolution, distribution, and future of life in the universe.\"}, \"ar\": {\"name\": \"علم الأحياء الفلكي\", \"briefDescription\": \"دراسة أصل وتطور وتوزيع ومستقبل الحياة في الكون.\"}}, \"more\": []}' AS JSON)),
(44, 1, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Federated Learning\", \"briefDescription\": \"A machine learning technique that trains an algorithm across multiple decentralized edge devices or servers.\"}, \"ar\": {\"name\": \"التعلم الفيدرالي\", \"briefDescription\": \"تقنية تعلم آلي تدرب خوارزمية عبر أجهزة طرفية أو خوادم لامركزية متعددة.\"}}, \"more\": []}' AS JSON)),
(45, 2, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Dark Matter\", \"briefDescription\": \"A form of matter thought to account for approximately 85% of the matter in the universe.\"}, \"ar\": {\"name\": \"المادة المظلمة\", \"briefDescription\": \"شكل من أشكال المادة يُعتقد أنه يمثل حوالي 85٪ من المادة في الكون.\"}}, \"more\": []}' AS JSON)),
(46, 3, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Epigenetics\", \"briefDescription\": \"The study of heritable phenotype changes that do not involve alterations in the DNA sequence.\"}, \"ar\": {\"name\": \"علم التخلق\", \"briefDescription\": \"دراسة التغيرات الوراثية في النمط الظاهري التي لا تتضمن تغييرات في تسلسل الحمض النووي.\"}}, \"more\": []}' AS JSON)),
(47, 1, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"5G Technology\", \"briefDescription\": \"The fifth-generation technology standard for broadband cellular networks.\"}, \"ar\": {\"name\": \"تقنية الجيل الخامس\", \"briefDescription\": \"معيار الجيل الخامس لشبكات الهواتف الخلوية واسعة النطاق.\"}}, \"more\": []}' AS JSON)),
(48, 2, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Digital Nomadism\", \"briefDescription\": \"A lifestyle of remote work and travel.\"}, \"ar\": {\"name\": \"الترحال الرقمي\", \"briefDescription\": \"أسلوب حياة يعتمد على العمل عن بعد والسفر.\"}}, \"more\": []}' AS JSON)),
(49, 1, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Homomorphic Encryption\", \"briefDescription\": \"A form of encryption that allows computation on ciphertexts.\"}, \"ar\": {\"name\": \"التشفير المتماثل\", \"briefDescription\": \"شكل من أشكال التشفير يسمح بإجراء عمليات حسابية على النصوص المشفرة.\"}}, \"more\": []}' AS JSON)),
(50, 2, 'pending', 0, CAST('{\"default\": {\"en\": {\"name\": \"Platform Cooperative\", \"briefDescription\": \"A cooperatively-owned, democratically-governed business that uses a website or mobile app to facilitate the sale of goods and services.\"}, \"ar\": {\"name\": \"التعاونية المنصية\", \"briefDescription\": \"شركة مملوكة بشكل تعاوني وتدار ديمقراطياً تستخدم موقعًا إلكترونيًا أو تطبيقًا لتسهيل بيع السلع والخدمات.\"}}, \"more\": []}' AS JSON));


-- =================================================================
-- Relational Data
-- =================================================================

-- 1. termTags
INSERT INTO `termTags` (`termId`, `tagId`) VALUES
(1, 1), (1, 2), (2, 2), (2, 8), (3, 3), (4, 1), (4, 9), (5, 4), (5, 8), (6, 1), (7, 3),
(8, 2), (8, 7), (9, 2), (9, 4), (10, 5), (10, 8), (11, 1), (12, 6), (13, 3), (14, 2), (15, 1),
(16, 2), (16, 7), (17, 9), (18, 5), (19, 4), (21, 1), (21, 3), (22, 1), (22, 2), (24, 5), (24, 8),
(26, 1), (26, 6), (28, 3), (29, 1), (30, 2), (31, 1), (32, 1), (34, 5), (35, 9), (36, 1), (36, 3),
(41, 1), (42, 8), (43, 3), (44, 1), (45, 9), (46, 3), (47, 1), (49, 1), (50, 5), (50, 8);

-- 2. termReviews
INSERT INTO `termReviews` (`reviewId`, `termRef`, `translationIdentifier`, `fieldKey`, `suggestedValue`, `explanation`, `status`) VALUES
(1, 36, 'default-en', 'name', 'Neuralink BCI', 'This is more specific and aligns with industry terminology.', 'pending'),
(2, 37, 'default-ar', 'briefDescription', 'ظرف تصبح فيه الحقائق الموضوعية أقل تأثيراً على الرأي العام من العاطفة والمعتقد الشخصي.', 'A more fluent and accurate Arabic translation.', 'pending');