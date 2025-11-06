-- =================================================================
-- DATABASE SEED SCRIPT
-- =================================================================
-- This script will clear and populate the following tables:
-- 1. termCategories
-- 2. tags
-- 3. terms
-- 4. termTags (join table)
-- It is designed to be re-runnable.
-- =================================================================

-- Step 0: Disable foreign key checks, clear existing data, and reset auto-increment
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `termTags`;
TRUNCATE TABLE `terms`;
TRUNCATE TABLE `tags`;
TRUNCATE TABLE `termCategories`;

ALTER TABLE `termCategories` AUTO_INCREMENT = 1;
ALTER TABLE `tags` AUTO_INCREMENT = 1;
ALTER TABLE `terms` AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;


-- =================================================================
-- 1. Seed Term Categories
-- =================================================================
-- Categories are high-level classifications for terms.
-- `name` column is a JSON object with 'en' and 'ar' keys.
-- =================================================================
INSERT INTO `termCategories` (`displayOrder`, `isActive`, `name`) VALUES
(1, TRUE, '{"en": "Technology & Innovation", "ar": "التكنولوجيا والابتكار"}'),
(2, TRUE, '{"en": "Economy & Finance", "ar": "الاقتصاد والمالية"}'),
(3, TRUE, '{"en": "Society & Culture", "ar": "المجتمع والثقافة"}'),
(4, TRUE, '{"en": "Environment & Sustainability", "ar": "البيئة والاستدامة"}'),
(5, TRUE, '{"en": "Governance & Policy", "ar": "الحوكمة والسياسات"}');


-- =================================================================
-- 2. Seed Tags
-- =================================================================
-- Tags are specific keywords for granular filtering.
-- `name` column is a JSON object with 'en' and 'ar' keys.
-- =================================================================
INSERT INTO `tags` (`name`) VALUES
('{"en": "Artificial Intelligence", "ar": "الذكاء الاصطناعي"}'),           -- ID: 1
('{"en": "Blockchain", "ar": "بلوك تشين"}'),                               -- ID: 2
('{"en": "Smart Cities", "ar": "المدن الذكية"}'),                            -- ID: 3
('{"en": "Sustainability", "ar": "الاستدامة"}'),                             -- ID: 4
('{"en": "Gig Economy", "ar": "اقتصاد الأعمال الحرة"}'),                      -- ID: 5
('{"en": "Digital Transformation", "ar": "التحول الرقمي"}'),                 -- ID: 6
('{"en": "Youth Empowerment", "ar": "تمكين الشباب"}'),                        -- ID: 7
('{"en": "Public Policy", "ar": "السياسة العامة"}'),                         -- ID: 8
('{"en": "Renewable Energy", "ar": "الطاقة المتجددة"}'),                       -- ID: 9
('{"en": "Cultural Heritage", "ar": "التراث الثقافي"}'),                      -- ID: 10
('{"en": "FinTech", "ar": "التكنولوجيا المالية"}'),                           -- ID: 11
('{"en": "EdTech", "ar": "تكنولوجيا التعليم"}'),                             -- ID: 12
('{"en": "Biotechnology", "ar": "التكنولوجيا الحيوية"}'),                     -- ID: 13
('{"en": "Circular Economy", "ar": "الاقتصاد الدائري"}'),                     -- ID: 14
('{"en": "Mental Health", "ar": "الصحة النفسية"}'),                          -- ID: 15
('{"en": "Future of Work", "ar": "مستقبل العمل"}'),                          -- ID: 16
('{"en": "Data Privacy", "ar": "خصوصية البيانات"}');                          -- ID: 17


-- =================================================================
-- 3. Seed Terms
-- =================================================================
-- This is the core data. Note the structure for the JSON columns:
-- `title`: {"en": [{"value": "...", "references": [...]}]}
-- `briefDescription`: {"en": "...", "ar": "..."}
-- `fullDetail`: {"en": "...", "ar": "..."}
-- =================================================================
INSERT INTO `terms` (`categoryRef`, `status`, `isFeatured`, `title`, `briefDescription`, `fullDetail`) VALUES
-- Category 1: Technology & Innovation
(1, 'published', TRUE, 
  '{"en": [{"value": "Generative AI", "references": [{"content": "OpenAI GPT-4 Technical Report", "url": "https://openai.com/research/gpt-4"}]}], "ar": [{"value": "الذكاء الاصطناعي التوليدي", "references": []}]}',
  '{"en": "AI models capable of generating novel content, such as text, images, or music.", "ar": "نماذج الذكاء الاصطناعي القادرة على إنشاء محتوى جديد، مثل النصوص أو الصور أو الموسيقى."}',
  '{"en": "Generative AI represents a significant leap in machine learning, where models learn the underlying patterns of data to create new, original outputs. This technology powers applications like chatbots, art generators, and code assistants.", "ar": "يمثل الذكاء الاصطناعي التوليدي قفزة نوعية في تعلم الآلة، حيث تتعلم النماذج الأنماط الأساسية للبيانات لإنشاء مخرجات جديدة ومبتكرة. تشغل هذه التقنية تطبيقات مثل روبوتات المحادثة ومولدات الفن ومساعدي البرمجة."}'
),
(1, 'published', FALSE, 
  '{"en": [{"value": "Quantum Computing", "references": []}], "ar": [{"value": "الحوسبة الكمومية", "references": []}]}',
  '{"en": "A type of computing that uses the principles of quantum mechanics to solve problems too complex for classical computers.", "ar": "نوع من الحوسبة يستخدم مبادئ ميكانيكا الكم لحل المشكلات المعقدة للغاية على أجهزة الكمبيوتر الكلاسيكية."}',
  '{"en": "Unlike classical computers that use bits (0s and 1s), quantum computers use qubits, which can exist in multiple states at once (superposition). This allows them to perform vast numbers of calculations simultaneously, with potential breakthroughs in medicine, materials science, and cryptography.", "ar": "على عكس أجهزة الكمبيوتر الكلاسيكية التي تستخدم البتات (0 و 1)، تستخدم أجهزة الكمبيوتر الكمومية الكيوبتات، التي يمكن أن توجد في حالات متعددة في وقت واحد (التراكب). وهذا يسمح لها بإجراء أعداد هائلة من العمليات الحسابية في وقت واحد، مع إمكانية تحقيق طفرات في الطب وعلوم المواد والتشفير."}'
),
(1, 'pending', FALSE, 
  '{"en": [{"value": "The Metaverse", "references": []}], "ar": [{"value": "الميتافيرس", "references": []}]}',
  '{"en": "A collective virtual shared space, created by the convergence of virtually enhanced physical reality and physically persistent virtual space.", "ar": "مساحة افتراضية مشتركة وجماعية، تم إنشاؤها من خلال تقارب الواقع المادي المعزز افتراضيًا والمساحة الافتراضية المستمرة ماديًا."}',
  '{"en": "The Metaverse is envisioned as the next evolution of the internet, a persistent 3D world where users can interact with each other, digital objects, and AI agents through avatars. It merges aspects of social media, online gaming, augmented reality (AR), and virtual reality (VR).", "ar": "يُصوَّر الميتافيرس على أنه التطور التالي للإنترنت، وهو عالم ثلاثي الأبعاد مستمر حيث يمكن للمستخدمين التفاعل مع بعضهم البعض، ومع الكائنات الرقمية، ووكلاء الذكاء الاصطناعي من خلال الصور الرمزية. وهو يدمج جوانب من وسائل التواصل الاجتماعي والألعاب عبر الإنترنت والواقع المعزز (AR) والواقع الافتراضي (VR)."}'
),
(1, 'published', TRUE, 
  '{"en": [{"value": "Decentralized Autonomous Organization (DAO)", "references": [{"content": "Ethereum Foundation on DAOs", "url": "https://ethereum.org/en/dao/"}]}], "ar": [{"value": "المنظمة المستقلة اللامركزية (DAO)", "references": []}]}',
  '{"en": "An organization represented by rules encoded as a computer program that is transparent, controlled by the organization members and not influenced by a central government.", "ar": "منظمة ممثلة بقواعد مشفرة كبرنامج كمبيوتر شفاف، يسيطر عليه أعضاء المنظمة ولا يتأثر بحكومة مركزية."}',
  '{"en": "DAOs operate on blockchain technology. Their rules and financial transactions are recorded on the blockchain, providing full transparency and removing the need for a central authority. Members typically use governance tokens to vote on proposals.", "ar": "تعمل المنظمات المستقلة اللامركزية على تقنية البلوك تشين. يتم تسجيل قواعدها ومعاملاتها المالية على البلوك تشين، مما يوفر شفافية كاملة ويزيل الحاجة إلى سلطة مركزية. يستخدم الأعضاء عادةً رموز الحوكمة للتصويت على المقترحات."}'
),
(1, 'published', FALSE, 
  '{"en": [{"value": "Biohacking", "references": []}], "ar": [{"value": "القرصنة البيولوجية", "references": []}]}',
  '{"en": "A do-it-yourself biology movement where individuals experiment with their own bodies and biology to improve health, performance, or wellbeing.", "ar": "حركة بيولوجية ذاتية الصنع حيث يقوم الأفراد بتجارب على أجسادهم وبيولوجيتهم لتحسين الصحة أو الأداء أو الرفاهية."}',
  '{"en": "Biohacking ranges from simple practices like intermittent fasting and meditation to more advanced techniques like genetic engineering and implanting cybernetic devices. It is a broad field driven by a desire for self-optimization.", "ar": "تتراوح القرصنة البيولوجية من الممارسات البسيطة مثل الصيام المتقطع والتأمل إلى تقنيات أكثر تقدمًا مثل الهندسة الوراثية وزرع الأجهزة السيبرانية. إنه مجال واسع مدفوع بالرغبة في التحسين الذاتي."}'
),
-- Category 2: Economy & Finance
(2, 'published', TRUE, 
  '{"en": [{"value": "Central Bank Digital Currency (CBDC)", "references": []}], "ar": [{"value": "العملة الرقمية للبنك المركزي (CBDC)", "references": []}]}',
  '{"en": "A digital form of a country''s fiat currency that is a direct liability of the central bank.", "ar": "شكل رقمي من العملة الورقية لبلد ما وهو التزام مباشر على البنك المركزي."}',
  '{"en": "Unlike cryptocurrencies like Bitcoin, a CBDC is issued and backed by a central authority. The goal is to provide a safe, efficient, and government-backed digital payment instrument for the modern economy.", "ar": "على عكس العملات المشفرة مثل البيتكوين، يتم إصدار ودعم العملة الرقمية للبنك المركزي من قبل سلطة مركزية. الهدف هو توفير أداة دفع رقمية آمنة وفعالة ومدعومة من الحكومة للاقتصاد الحديث."}'
),
(2, 'published', FALSE, 
  '{"en": [{"value": "Impact Investing", "references": []}], "ar": [{"value": "الاستثمار المؤثر", "references": []}]}',
  '{"en": "Investments made with the intention to generate positive, measurable social and environmental impact alongside a financial return.", "ar": "الاستثمارات التي تتم بنية توليد تأثير اجتماعي وبيئي إيجابي وقابل للقياس إلى جانب العائد المالي."}',
  '{"en": "Impact investing challenges the long-held view that social and environmental issues should be addressed only by philanthropic donations. It mobilizes private capital to address pressing global challenges in areas like renewable energy, affordable housing, and sustainable agriculture.", "ar": "يتحدى الاستثمار المؤثر الرأي القائل بأن القضايا الاجتماعية والبيئية يجب أن تعالج فقط من خلال التبرعات الخيرية. إنه يحشد رأس المال الخاص لمواجهة التحديات العالمية الملحة في مجالات مثل الطاقة المتجددة والإسكان الميسور والزراعة المستدامة."}'
),
(2, 'pending', FALSE, 
  '{"en": [{"value": "Universal Basic Income (UBI)", "references": []}], "ar": [{"value": "الدخل الأساسي الشامل (UBI)", "references": []}]}',
  '{"en": "A theoretical government program in which every adult citizen regularly receives a set amount of money, regardless of their employment status.", "ar": "برنامج حكومي نظري يحصل فيه كل مواطن بالغ بانتظام على مبلغ محدد من المال، بغض النظر عن وضعه الوظيفي."}',
  '{"en": "Proponents of UBI argue it could alleviate poverty, improve health outcomes, and provide economic security in an age of increasing automation. Detractors raise concerns about its cost, potential inflationary effects, and impact on the motivation to work.", "ar": "يجادل مؤيدو الدخل الأساسي الشامل بأنه يمكن أن يخفف من حدة الفقر، ويحسن النتائج الصحية، ويوفر الأمن الاقتصادي في عصر الأتمتة المتزايدة. يثير المعارضون مخاوف بشأن تكلفته، والتأثيرات التضخمية المحتملة، والتأثير على دافع العمل."}'
),
(2, 'published', TRUE, 
  '{"en": [{"value": "Tokenization", "references": []}], "ar": [{"value": "الترميز", "references": []}]}',
  '{"en": "The process of converting rights to an asset into a digital token on a blockchain.", "ar": "عملية تحويل الحقوق في أصل ما إلى رمز رقمي على البلوك تشين."}',
  '{"en": "Tokenization can be applied to almost any asset, including real estate, art, stocks, and commodities. It enables fractional ownership, increases liquidity, and can make transactions faster and more secure.", "ar": "يمكن تطبيق الترميز على أي أصل تقريبًا، بما في ذلك العقارات والفن والأسهم والسلع. إنه يتيح الملكية الجزئية، ويزيد من السيولة، ويمكن أن يجعل المعاملات أسرع وأكثر أمانًا."}'
),
-- Category 3: Society & Culture
(3, 'published', TRUE, 
  '{"en": [{"value": "Digital Nomadism", "references": []}], "ar": [{"value": "الترحال الرقمي", "references": []}]}',
  '{"en": "A lifestyle where people travel and work remotely using technology, rather than being based in a single location.", "ar": "أسلوب حياة يسافر فيه الناس ويعملون عن بعد باستخدام التكنولوجيا، بدلاً من الاستقرار في مكان واحد."}',
  '{"en": "Enabled by high-speed internet, collaborative tools, and a shift in work culture, digital nomads embrace location independence. This trend has significant implications for tourism, urban planning, and the traditional concept of a career.", "ar": "بفضل الإنترنت عالي السرعة والأدوات التعاونية والتحول في ثقافة العمل، يتبنى الرحالة الرقميون استقلالية الموقع. ولهذا الاتجاه آثار كبيرة على السياحة والتخطيط الحضري والمفهوم التقليدي للمهنة."}'
),
(3, 'published', FALSE, 
  '{"en": [{"value": "Gamification", "references": []}], "ar": [{"value": "التلعيب", "references": []}]}',
  '{"en": "The application of game-design elements and game principles in non-game contexts to engage and motivate people.", "ar": "تطبيق عناصر تصميم الألعاب ومبادئها في سياقات غير متعلقة بالألعاب لإشراك الناس وتحفيزهم."}',
  '{"en": "Gamification is used in education (EdTech), corporate training, marketing, and wellness apps. It leverages human psychology by using points, badges, leaderboards, and challenges to encourage desired behaviors.", "ar": "يستخدم التلعيب في التعليم (تكنولوجيا التعليم)، والتدريب المؤسسي، والتسويق، وتطبيقات العافية. إنه يستفيد من علم النفس البشري باستخدام النقاط والشارات ولوحات المتصدرين والتحديات لتشجيع السلوكيات المرغوبة."}'
),
(3, 'pending', FALSE, 
  '{"en": [{"value": "Transhumanism", "references": []}], "ar": [{"value": "ما بعد الإنسانية", "references": []}]}',
  '{"en": "A philosophical and intellectual movement that advocates for the enhancement of the human condition by developing and making widely available sophisticated technologies able to greatly enhance human intellect and physiology.", "ar": "حركة فلسفية وفكرية تدعو إلى تحسين الحالة البشرية من خلال تطوير وإتاحة التقنيات المتطورة على نطاق واسع قادرة على تعزيز الفكر البشري وعلم وظائف الأعضاء بشكل كبير."}',
  '{"en": "Transhumanist thinkers envision a future where technologies like genetic engineering, nanotechnology, and brain-computer interfaces could overcome fundamental human limitations such as disease, aging, and even death.", "ar": "يتصور مفكرو ما بعد الإنسانية مستقبلاً يمكن فيه للتقنيات مثل الهندسة الوراثية وتكنولوجيا النانو وواجهات الدماغ والحاسوب التغلب على القيود البشرية الأساسية مثل المرض والشيخوخة وحتى الموت."}'
),
-- Category 4: Environment & Sustainability
(4, 'published', TRUE, 
  '{"en": [{"value": "Carbon Sequestration", "references": [{"content": "IPCC Report on Climate Change", "url": "https://www.ipcc.ch/"}]}], "ar": [{"value": "عزل الكربون", "references": []}]}',
  '{"en": "The process of capturing and storing atmospheric carbon dioxide to mitigate climate change.", "ar": "عملية التقاط وتخزين ثاني أكسيد الكربون في الغلاف الجوي للتخفيف من تغير المناخ."}',
  '{"en": "Methods for carbon sequestration include natural processes like reforestation and afforestation, as well as technological solutions such as direct air capture (DAC) and storing CO2 in underground geological formations.", "ar": "تشمل طرق عزل الكربون العمليات الطبيعية مثل إعادة التحريج والتشجير، بالإضافة إلى الحلول التكنولوجية مثل الالتقاط المباشر للهواء (DAC) وتخزين ثاني أكسيد الكربون في التكوينات الجيولوجية تحت الأرض."}'
),
(4, 'published', FALSE, 
  '{"en": [{"value": "Vertical Farming", "references": []}], "ar": [{"value": "الزراعة العمودية", "references": []}]}',
  '{"en": "The practice of growing crops in vertically stacked layers, often in a controlled indoor environment.", "ar": "ممارسة زراعة المحاصيل في طبقات مكدسة عموديًا، غالبًا في بيئة داخلية خاضعة للرقابة."}',
  '{"en": "Vertical farming can reduce water usage by up to 95%, eliminate the need for pesticides, and allow food to be grown in urban centers, reducing transportation costs and carbon emissions. It is a key technology for future food security.", "ar": "يمكن للزراعة العمودية أن تقلل من استخدام المياه بنسبة تصل إلى 95٪، وتقضي على الحاجة إلى المبيدات الحشرية، وتسمح بزراعة الغذاء في المراكز الحضرية، مما يقلل من تكاليف النقل وانبعاثات الكربون. إنها تقنية رئيسية للأمن الغذائي في المستقبل."}'
),
(4, 'pending', TRUE, 
  '{"en": [{"value": "Green Hydrogen", "references": []}], "ar": [{"value": "الهيدروجين الأخضر", "references": []}]}',
  '{"en": "Hydrogen produced by splitting water into hydrogen and oxygen using renewable electricity.", "ar": "الهيدروجين المنتج عن طريق فصل الماء إلى هيدروجين وأكسجين باستخدام الكهرباء المتجددة."}',
  '{"en": "Green hydrogen is considered a clean energy carrier because its production is carbon-free. It has the potential to decarbonize heavy industries, transportation, and power generation where electrification is difficult.", "ar": "يعتبر الهيدروجين الأخضر ناقلًا للطاقة النظيفة لأن إنتاجه خالٍ من الكربون. لديه القدرة على إزالة الكربون من الصناعات الثقيلة والنقل وتوليد الطاقة حيث يكون استخدام الكهرباء صعبًا."}'
),
-- Category 5: Governance & Policy
(5, 'published', FALSE, 
  '{"en": [{"value": "E-governance", "references": []}], "ar": [{"value": "الحوكمة الإلكترونية", "references": []}]}',
  '{"en": "The application of information and communication technology (ICT) for delivering government services and improving accountability.", "ar": "تطبيق تكنولوجيا المعلومات والاتصالات (ICT) لتقديم الخدمات الحكومية وتحسين المساءلة."}',
  '{"en": "E-governance aims to make governments more efficient, transparent, and responsive. Initiatives include online tax filing, digital identity systems, public service portals, and electronic voting.", "ar": "تهدف الحوكمة الإلكترونية إلى جعل الحكومات أكثر كفاءة وشفافية واستجابة. تشمل المبادرات تقديم الإقرارات الضريبية عبر الإنترنت، وأنظمة الهوية الرقمية، وبوابات الخدمات العامة، والتصويت الإلكتروني."}'
),
(5, 'published', TRUE, 
  '{"en": [{"value": "Algorithmic Bias", "references": []}], "ar": [{"value": "التحيز الخوارزمي", "references": []}]}',
  '{"en": "Systematic and repeatable errors in a computer system that create unfair outcomes, such as privileging one arbitrary group of users over others.", "ar": "أخطاء منهجية ومتكررة في نظام الكمبيوتر تخلق نتائج غير عادلة، مثل تفضيل مجموعة عشوائية من المستخدمين على الآخرين."}',
  '{"en": "Algorithmic bias can arise from biased training data or flawed algorithm design. It is a major ethical concern in AI applications for hiring, criminal justice, and loan applications, necessitating robust public policy and regulation.", "ar": "يمكن أن ينشأ التحيز الخوارزمي من بيانات التدريب المتحيزة أو تصميم الخوارزميات المعيب. وهو مصدر قلق أخلاقي كبير في تطبيقات الذكاء الاصطناعي للتوظيف والعدالة الجنائية وطلبات القروض، مما يستلزم سياسات عامة ولوائح تنظيمية قوية."}'
),
(5, 'pending', FALSE, 
  '{"en": [{"value": "Predictive Policing", "references": []}], "ar": [{"value": "الشرطة التنبؤية", "references": []}]}',
  '{"en": "The use of analytical techniques to identify likely targets for police intervention and prevent crime or solve past crimes by making statistical predictions.", "ar": "استخدام التقنيات التحليلية لتحديد الأهداف المحتملة لتدخل الشرطة ومنع الجريمة أو حل الجرائم السابقة عن طريق عمل تنبؤات إحصائية."}',
  '{"en": "While potentially effective, predictive policing is highly controversial. Critics argue that it can reinforce and amplify existing biases in historical crime data, leading to over-policing of certain communities and raising significant privacy and civil liberties concerns.", "ar": "على الرغم من فعاليتها المحتملة، إلا أن الشرطة التنبؤية مثيرة للجدل إلى حد كبير. يجادل النقاد بأنها يمكن أن تعزز وتضخم التحيزات القائمة في بيانات الجريمة التاريخية، مما يؤدي إلى الإفراط في مراقبة مجتمعات معينة ويثير مخاوف كبيرة بشأن الخصوصية والحريات المدنية."}'
),
-- Adding more terms to reach 50...
(1, 'published', FALSE,
  '{"en": [{"value": "Internet of Things (IoT)", "references": []}], "ar": [{"value": "إنترنت الأشياء (IoT)", "references": []}]}',
  '{"en": "A network of physical objects embedded with sensors and software for the purpose of connecting and exchanging data over the internet.", "ar": "شبكة من الأجهزة المادية المضمنة بأجهزة استشعار وبرامج بغرض الاتصال وتبادل البيانات عبر الإنترنت."}',
  '{"en": "From smart home devices to industrial machinery, IoT enables objects to be monitored and controlled remotely, generating vast amounts of data for analysis and optimization.", "ar": "من الأجهزة المنزلية الذكية إلى الآلات الصناعية، يمكّن إنترنت الأشياء من مراقبة الأجهزة والتحكم فيها عن بعد، مما يولد كميات هائلة من البيانات للتحليل والتحسين."}'
),
(2, 'published', FALSE,
  '{"en": [{"value": "Creator Economy", "references": []}], "ar": [{"value": "اقتصاد المبدعين", "references": []}]}',
  '{"en": "An economy built by independent content creators, curators, and community builders who monetize their skills and creativity.", "ar": "اقتصاد يبنيه منشئو المحتوى المستقلون والمنسقون وبناة المجتمعات الذين يحولون مهاراتهم وإبداعهم إلى أموال."}',
  '{"en": "This economy is powered by platforms like YouTube, Instagram, and Substack, allowing individuals to build direct relationships with their audience and bypass traditional media gatekeepers.", "ar": "يعتمد هذا الاقتصاد على منصات مثل يوتيوب وإنستغرام وسبستاك، مما يسمح للأفراد ببناء علاقات مباشرة مع جمهورهم وتجاوز حراس البوابة الإعلامية التقليديين."}'
),
(4, 'published', TRUE,
  '{"en": [{"value": "Desalination", "references": [{"content": "International Desalination Association", "url": "https://idadesal.org/"}]}], "ar": [{"value": "تحلية المياه", "references": []}]}',
  '{"en": "The process of removing mineral components from saline water to produce fresh water suitable for human consumption or irrigation.", "ar": "عملية إزالة المكونات المعدنية من المياه المالحة لإنتاج مياه عذبة صالحة للاستهلاك البشري أو الري."}',
  '{"en": "Desalination is a critical technology for water security in arid regions. Advances in reverse osmosis and renewable energy integration are making the process more energy-efficient and sustainable.", "ar": "تعد تحلية المياه تقنية حيوية للأمن المائي في المناطق القاحلة. التقدم في التناضح العكسي وتكامل الطاقة المتجددة يجعل العملية أكثر كفاءة في استخدام الطاقة واستدامة."}'
),
(3, 'published', FALSE,
  '{"en": [{"value": "Slowbalisation", "references": []}], "ar": [{"value": "التباطؤ العالمي", "references": []}]}',
  '{"en": "The recent trend of slowing down or partial reversal of globalization, characterized by a decline in cross-border trade, capital, and people flows.", "ar": "الاتجاه الحديث لتباطؤ العولمة أو عكسها جزئيًا، والذي يتميز بانخفاض في التجارة عبر الحدود وتدفقات رأس المال والأفراد."}',
  '{"en": "Driven by geopolitical tensions, protectionist policies, and a push for resilient local supply chains, slowbalisation marks a potential shift away from the hyper-globalization of the late 20th century.", "ar": "مدفوعًا بالتوترات الجيوسياسية والسياسات الحمائية والضغط من أجل سلاسل توريد محلية مرنة، يمثل التباطؤ العالمي تحولًا محتملاً بعيدًا عن العولمة المفرطة في أواخر القرن العشرين."}'
),
(5, 'published', FALSE,
  '{"en": [{"value": "Digital Divide", "references": []}], "ar": [{"value": "الفجوة الرقمية", "references": []}]}',
  '{"en": "The gap between demographics and regions that have access to modern information and communications technology and those that don''t or have restricted access.", "ar": "الفجوة بين الديموغرافيات والمناطق التي لديها إمكانية الوصول إلى تكنولوجيا المعلومات والاتصالات الحديثة وتلك التي لا تملكها أو لديها وصول مقيد."}',
  '{"en": "Bridging the digital divide is a key policy challenge, as access to the internet and digital literacy are increasingly essential for economic opportunity, education, and civic participation.", "ar": "يعد سد الفجوة الرقمية تحديًا رئيسيًا للسياسات، حيث أصبح الوصول إلى الإنترنت ومحو الأمية الرقمية ضروريًا بشكل متزايد للفرص الاقتصادية والتعليم والمشاركة المدنية."}'
),
(1, 'published', TRUE,
  '{"en": [{"value": "Edge Computing", "references": []}], "ar": [{"value": "الحوسبة الطرفية", "references": []}]}',
  '{"en": "A distributed computing paradigm that brings computation and data storage closer to the sources of data.", "ar": "نموذج حوسبة موزع يقرب الحوسبة وتخزين البيانات من مصادر البيانات."}',
  '{"en": "Instead of sending data to a centralized cloud, edge computing processes it locally. This reduces latency and bandwidth usage, which is critical for real-time applications like IoT, autonomous vehicles, and AR/VR.", "ar": "بدلاً من إرسال البيانات إلى سحابة مركزية، تقوم الحوسبة الطرفية بمعالجتها محليًا. وهذا يقلل من زمن الوصول واستخدام النطاق الترددي، وهو أمر بالغ الأهمية للتطبيقات في الوقت الفعلي مثل إنترنت الأشياء والمركبات المستقلة والواقع المعزز/الافتراضي."}'
),
(4, 'published', FALSE,
  '{"en": [{"value": "Precision Agriculture", "references": []}], "ar": [{"value": "الزراعة الدقيقة", "references": []}]}',
  '{"en": "A farming management concept using information technology to ensure that crops and soil receive exactly what they need for optimum health and productivity.", "ar": "مفهوم لإدارة الزراعة يستخدم تكنولوجيا المعلومات لضمان حصول المحاصيل والتربة على ما تحتاجه بالضبط لتحقيق الصحة والإنتاجية المثلى."}',
  '{"en": "By using GPS, sensors, drones, and AI, precision agriculture helps farmers increase yields while reducing the use of water, fertilizer, and pesticides, leading to more sustainable and efficient food production.", "ar": "باستخدام نظام تحديد المواقع العالمي (GPS) وأجهزة الاستشعار والطائرات بدون طيار والذكاء الاصطناعي، تساعد الزراعة الدقيقة المزارعين على زيادة الغلة مع تقليل استخدام المياه والأسمدة والمبيدات الحشرية، مما يؤدي إلى إنتاج غذائي أكثر استدامة وكفاءة."}'
),
(2, 'published', TRUE,
  '{"en": [{"value": "Subscription Economy", "references": []}], "ar": [{"value": "اقتصاد الاشتراك", "references": []}]}',
  '{"en": "A business model where customers pay a recurring fee to access a product or service.", "ar": "نموذج عمل يدفع فيه العملاء رسومًا متكررة للوصول إلى منتج أو خدمة."}',
  '{"en": "This model shifts the focus from one-time sales to building long-term customer relationships. It has become dominant in software (SaaS), media (Netflix, Spotify), and is expanding into physical goods and services.", "ar": "يحول هذا النموذج التركيز من المبيعات لمرة واحدة إلى بناء علاقات طويلة الأمد مع العملاء. لقد أصبح مهيمنًا في البرامج (SaaS) والإعلام (Netflix و Spotify) ويتوسع ليشمل السلع والخدمات المادية."}'
),
(3, 'pending', FALSE,
  '{"en": [{"value": "Microdosing", "references": []}], "ar": [{"value": "الجرعات الصغيرة", "references": []}]}',
  '{"en": "The practice of taking sub-perceptual doses of psychedelic substances to improve creativity, focus, or emotional balance.", "ar": "ممارسة تناول جرعات دون الإدراك الحسي من المواد المخدرة لتحسين الإبداع أو التركيز أو التوازن العاطفي."}',
  '{"en": "While gaining popularity in some circles, the scientific evidence for the benefits of microdosing is still limited and inconclusive. The practice raises legal and ethical questions and is an area of ongoing research.", "ar": "على الرغم من شعبيتها المتزايدة في بعض الدوائر، إلا أن الأدلة العلمية على فوائد الجرعات الصغيرة لا تزال محدودة وغير حاسمة. تثير هذه الممارسة أسئلة قانونية وأخلاقية وهي مجال بحث مستمر."}'
),
(5, 'published', FALSE,
  '{"en": [{"value": "Evidence-Based Policymaking", "references": []}], "ar": [{"value": "صنع السياسات القائمة على الأدلة", "references": []}]}',
  '{"en": "An approach to public policy that emphasizes the importance of using rigorous evidence and data to inform decisions.", "ar": "نهج للسياسة العامة يشدد على أهمية استخدام الأدلة والبيانات الدقيقة لإبلاغ القرارات."}',
  '{"en": "This approach moves away from decision-making based on ideology or anecdote. It involves systematic reviews of research, randomized controlled trials, and robust data analysis to determine what programs and policies are most effective.", "ar": "يبتعد هذا النهج عن اتخاذ القرارات القائمة على الأيديولوجيا أو الحكايات. وهو ينطوي على مراجعات منهجية للبحوث، والتجارب العشوائية ذات الشواهد، وتحليل البيانات القوي لتحديد البرامج والسياسات الأكثر فعالية."}'
),
(1, 'published', FALSE,
  '{"en": [{"value": "5G Technology", "references": []}], "ar": [{"value": "تقنية الجيل الخامس 5G", "references": []}]}',
  '{"en": "The fifth generation of cellular technology, designed to deliver higher multi-Gbps peak speeds, ultra-low latency, more reliability, and massive network capacity.", "ar": "الجيل الخامس من تكنولوجيا الهواتف المحمولة، المصمم لتقديم سرعات قصوى أعلى متعددة الجيجابت في الثانية، وزمن وصول منخفض للغاية، وموثوقية أكبر، وسعة شبكة هائلة."}',
  '{"en": "5G is a foundational technology for the Internet of Things (IoT), autonomous vehicles, and immersive AR/VR experiences, enabling a new wave of innovation.", "ar": "تعد تقنية 5G تقنية أساسية لإنترنت الأشياء (IoT) والمركبات ذاتية القيادة وتجارب الواقع المعزز/الافتراضي الغامرة، مما يتيح موجة جديدة من الابتكار."}'
),
(4, 'pending', TRUE,
  '{"en": [{"value": "Geoengineering", "references": []}], "ar": [{"value": "الهندسة الجيولوجية", "references": []}]}',
  '{"en": "The deliberate and large-scale intervention in the Earth''s climate system, with the aim of counteracting climate change.", "ar": "التدخل المتعمد والواسع النطاق في نظام مناخ الأرض، بهدف مواجهة تغير المناخ."}',
  '{"en": "Geoengineering techniques are highly controversial and include methods like solar radiation management and carbon dioxide removal. They carry significant risks and ethical concerns about unintended consequences and global governance.", "ar": "تقنيات الهندسة الجيولوجية مثيرة للجدل إلى حد كبير وتشمل طرقًا مثل إدارة الإشعاع الشمسي وإزالة ثاني أكسيد الكربون. وهي تنطوي على مخاطر كبيرة ومخاوف أخلاقية بشأن العواقب غير المقصودة والحوكمة العالمية."}'
),
(2, 'published', FALSE,
  '{"en": [{"value": "Decentralized Finance (DeFi)", "references": [{"content": "What Is DeFi?", "url": "https://www.coinbase.com/learn/crypto-basics/what-is-defi"}]}], "ar": [{"value": "التمويل اللامركزي (DeFi)", "references": []}]}',
  '{"en": "An umbrella term for financial services on public blockchains, primarily Ethereum.", "ar": "مصطلح شامل للخدمات المالية على سلاسل الكتل العامة، وخاصة الإيثيريوم."}',
  '{"en": "With DeFi, you can do most of the things that banks support — earn interest, borrow, lend, buy insurance, trade derivatives, exchange assets, and more — but it’s faster and doesn’t require paperwork or a third party.", "ar": "مع التمويل اللامركزي، يمكنك القيام بمعظم الأشياء التي تدعمها البنوك - كسب الفائدة، والاقتراض، والإقراض، وشراء التأمين، وتداول المشتقات، وتبادل الأصول، والمزيد - ولكنه أسرع ولا يتطلب أوراقًا أو طرفًا ثالثًا."}'
),
(3, 'published', TRUE,
  '{"en": [{"value": "Cancel Culture", "references": []}], "ar": [{"value": "ثقافة الإلغاء", "references": []}]}',
  '{"en": "A modern form of ostracism in which someone is thrust out of social or professional circles – whether it be online, on social media, or in person.", "ar": "شكل حديث من النبذ يتم فيه طرد شخص ما من الدوائر الاجتماعية أو المهنية - سواء كان ذلك عبر الإنترنت أو على وسائل التواصل الاجتماعي أو شخصيًا."}',
  '{"en": "Those subject to this ostracism are said to have been ''canceled''. The phenomenon is a subject of intense debate regarding free speech, accountability, and the nature of public discourse in the digital age.", "ar": "يُقال إن أولئك الذين يتعرضون لهذا النبذ قد تم ''إلغاؤهم''. هذه الظاهرة موضوع نقاش حاد فيما يتعلق بحرية التعبير والمساءلة وطبيعة الخطاب العام في العصر الرقمي."}'
),
(5, 'published', FALSE,
  '{"en": [{"value": "Data Sovereignty", "references": []}], "ar": [{"value": "سيادة البيانات", "references": []}]}',
  '{"en": "The concept that data is subject to the laws and governance structures within the nation it is collected.", "ar": "مفهوم أن البيانات تخضع للقوانين وهياكل الحوكمة داخل الدولة التي يتم جمعها فيها."}',
  '{"en": "Data sovereignty has become a major policy issue, with governments implementing data localization laws that require data about their citizens to be stored within the country''s borders, impacting global technology companies.", "ar": "أصبحت سيادة البيانات قضية سياسية رئيسية، حيث تطبق الحكومات قوانين توطين البيانات التي تتطلب تخزين بيانات مواطنيها داخل حدود البلاد، مما يؤثر على شركات التكنولوجيا العالمية."}'
),
(1, 'pending', FALSE,
  '{"en": [{"value": "Brain-Computer Interface (BCI)", "references": []}], "ar": [{"value": "واجهة الدماغ والحاسوب (BCI)", "references": []}]}',
  '{"en": "A direct communication pathway between an enhanced or wired brain and an external device.", "ar": "مسار اتصال مباشر بين دماغ معزز أو سلكي وجهاز خارجي."}',
  '{"en": "BCIs are often directed at researching, mapping, assisting, augmenting, or repairing human cognitive or sensory-motor functions. Early applications focus on helping people with paralysis, with future possibilities for augmenting human capabilities.", "ar": "غالبًا ما تكون واجهات الدماغ والحاسوب موجهة للبحث أو رسم الخرائط أو المساعدة أو زيادة أو إصلاح الوظائف المعرفية أو الحسية الحركية للإنسان. تركز التطبيقات المبكرة على مساعدة الأشخاص المصابين بالشلل، مع إمكانيات مستقبلية لزيادة القدرات البشرية."}'
),
(4, 'published', FALSE,
  '{"en": [{"value": "Climate Migration", "references": []}], "ar": [{"value": "الهجرة المناخية", "references": []}]}',
  '{"en": "The movement of people driven by sudden or progressive changes in the environment due to climate change.", "ar": "حركة الناس مدفوعة بالتغيرات المفاجئة أو التدريجية في البيئة بسبب تغير المناخ."}',
  '{"en": "As sea levels rise, droughts intensify, and extreme weather events become more frequent, millions of people may be displaced. Climate migration poses significant humanitarian, political, and economic challenges for the 21st century.", "ar": "مع ارتفاع مستويات سطح البحر، وتكثيف حالات الجفاف، وزيادة تواتر الظواهر الجوية المتطرفة، قد يتم تشريد ملايين الأشخاص. تشكل الهجرة المناخية تحديات إنسانية وسياسية واقتصادية كبيرة للقرن الحادي والعشرين."}'
),
(2, 'published', FALSE,
  '{"en": [{"value": "Natural Capital", "references": []}], "ar": [{"value": "رأس المال الطبيعي", "references": []}]}',
  '{"en": "The world''s stock of natural assets which include geology, soil, air, water and all living things.", "ar": "رصيد العالم من الأصول الطبيعية التي تشمل الجيولوجيا والتربة والهواء والماء وجميع الكائنات الحية."}',
  '{"en": "It is from this Natural Capital that humans derive a wide range of services, often called ecosystem services, which make human life possible. Modern economic models are increasingly seeking to value and account for this capital.", "ar": "من رأس المال الطبيعي هذا يستمد البشر مجموعة واسعة من الخدمات، التي تسمى غالبًا خدمات النظام البيئي، والتي تجعل الحياة البشرية ممكنة. تسعى النماذج الاقتصادية الحديثة بشكل متزايد إلى تقييم هذا رأس المال وحسابه."}'
),
(3, 'published', FALSE,
  '{"en": [{"value": "Post-Truth", "references": []}], "ar": [{"value": "ما بعد الحقيقة", "references": []}]}',
  '{"en": "Relating to or denoting circumstances in which objective facts are less influential in shaping public opinion than appeals to emotion and personal belief.", "ar": "تتعلق أو تشير إلى الظروف التي تكون فيها الحقائق الموضوعية أقل تأثيرًا في تشكيل الرأي العام من النداءات إلى العاطفة والمعتقد الشخصي."}',
  '{"en": "The concept of post-truth became prominent in the context of political discourse and the spread of misinformation on social media, challenging traditional journalism and democratic institutions.", "ar": "أصبح مفهوم ما بعد الحقيقة بارزًا في سياق الخطاب السياسي وانتشار المعلومات المضللة على وسائل التواصل الاجتماعي، مما يشكل تحديًا للصحافة التقليدية والمؤسسات الديمقراطية."}'
),
(5, 'published', TRUE,
  '{"en": [{"value": "Open Data", "references": [{"content": "Open Data Handbook", "url": "https://opendatahandbook.org/"}]}], "ar": [{"value": "البيانات المفتوحة", "references": []}]}',
  '{"en": "The idea that some data should be freely available to everyone to use and republish as they wish, without restrictions from copyright, patents or other mechanisms of control.", "ar": "فكرة أن بعض البيانات يجب أن تكون متاحة مجانًا للجميع لاستخدامها وإعادة نشرها كما يحلو لهم، دون قيود من حقوق النشر أو براءات الاختراع أو آليات التحكم الأخرى."}',
  '{"en": "Governments and organizations publish open data to foster transparency, accountability, and innovation. Entrepreneurs and researchers can use this data to build new applications and generate insights.", "ar": "تنشر الحكومات والمنظمات البيانات المفتوحة لتعزيز الشفافية والمساءلة والابتكار. يمكن لرواد الأعمال والباحثين استخدام هذه البيانات لبناء تطبيقات جديدة وتوليد رؤى."}'
),
(1, 'published', TRUE,
  '{"en": [{"value": "Digital Twin", "references": []}], "ar": [{"value": "التوأم الرقمي", "references": []}]}',
  '{"en": "A virtual model designed to accurately reflect a physical object, process, or system.", "ar": "نموذج افتراضي مصمم ليعكس بدقة كائنًا أو عملية أو نظامًا ماديًا."}',
  '{"en": "Digital twins are used to simulate, predict, and optimize the performance of their physical counterparts. They are applied in manufacturing, urban planning (for smart cities), and healthcare to test scenarios and improve efficiency without affecting the real-world system.", "ar": "تستخدم التوائم الرقمية لمحاكاة أداء نظيراتها المادية والتنبؤ به وتحسينه. يتم تطبيقها في التصنيع والتخطيط الحضري (للمدن الذكية) والرعاية الصحية لاختبار السيناريوهات وتحسين الكفاءة دون التأثير على النظام الواقعي."}'
),
(4, 'published', FALSE,
  '{"en": [{"value": "E-waste", "references": []}], "ar": [{"value": "النفايات الإلكترونية", "references": []}]}',
  '{"en": "Discarded electrical or electronic devices. Used electronics which are destined for refurbishment, reuse, resale, salvage recycling through material recovery, or disposal are also considered e-waste.", "ar": "الأجهزة الكهربائية أو الإلكترونية المهملة. تعتبر الإلكترونيات المستعملة المخصصة للتجديد أو إعادة الاستخدام أو إعادة البيع أو إعادة تدوير الإنقاذ من خلال استعادة المواد أو التخلص منها أيضًا نفايات إلكترونية."}',
  '{"en": "E-waste is a rapidly growing global environmental problem, as it contains toxic materials that can harm human health and the environment if not managed properly. The circular economy model is crucial for addressing this challenge.", "ar": "تعد النفايات الإلكترونية مشكلة بيئية عالمية سريعة النمو، حيث تحتوي على مواد سامة يمكن أن تضر بصحة الإنسان والبيئة إذا لم تتم إدارتها بشكل صحيح. يعد نموذج الاقتصاد الدائري أمرًا بالغ الأهمية لمواجهة هذا التحدي."}'
),
(2, 'pending', FALSE,
  '{"en": [{"value": "Stakeholder Capitalism", "references": []}], "ar": [{"value": "رأسمالية أصحاب المصلحة", "references": []}]}',
  '{"en": "A system in which corporations are oriented to serve the interests of all their stakeholders, including customers, suppliers, employees, shareholders, and local communities.", "ar": "نظام يتم فيه توجيه الشركات لخدمة مصالح جميع أصحاب المصلحة، بما في ذلك العملاء والموردين والموظفين والمساهمين والمجتمعات المحلية."}',
  '{"en": "This model contrasts with shareholder capitalism, which prioritizes maximizing shareholder value. Proponents argue it leads to more sustainable and equitable long-term growth.", "ar": "يتناقض هذا النموذج مع رأسمالية المساهمين، التي تعطي الأولوية لتعظيم قيمة المساهمين. يجادل المؤيدون بأنه يؤدي إلى نمو أكثر استدامة وإنصافًا على المدى الطويل."}'
),
(3, 'published', FALSE,
  '{"en": [{"value": "Attention Economy", "references": []}], "ar": [{"value": "اقتصاد الانتباه", "references": []}]}',
  '{"en": "An approach to the management of information that treats human attention as a scarce commodity and applies economic theory to solve various information management problems.", "ar": "نهج لإدارة المعلومات يعامل انتباه الإنسان كسلعة نادرة ويطبق النظرية الاقتصادية لحل مشاكل إدارة المعلومات المختلفة."}',
  '{"en": "In the digital age, companies compete fiercely for users'' limited attention. This has shaped the design of social media platforms, news websites, and advertising, often using techniques that can be addictive or polarizing.", "ar": "في العصر الرقمي، تتنافس الشركات بشراسة على انتباه المستخدمين المحدود. وقد شكل هذا تصميم منصات التواصل الاجتماعي والمواقع الإخبارية والإعلانات، وغالبًا ما تستخدم تقنيات يمكن أن تكون إدمانية أو مستقطبة."}'
),
(5, 'published', FALSE,
  '{"en": [{"value": "Liquid Democracy", "references": []}], "ar": [{"value": "الديمقراطية السائلة", "references": []}]}',
  '{"en": "A form of delegative democracy whereby an electorate can either vote directly on issues or delegate their vote to a trusted representative.", "ar": "شكل من أشكال الديمقراطية التفويضية حيث يمكن للناخبين إما التصويت مباشرة على القضايا أو تفويض أصواتهم لممثل موثوق به."}',
  '{"en": "Liquid democracy aims to combine the benefits of direct democracy and representative democracy. Voters can choose to be as active or passive as they wish, and can change their delegates at any time, making representation more fluid and issue-specific.", "ar": "تهدف الديمقراطية السائلة إلى الجمع بين فوائد الديمقراطية المباشرة والديمقراطية التمثيلية. يمكن للناخبين اختيار أن يكونوا نشطين أو سلبيين كما يحلو لهم، ويمكنهم تغيير مندوبيهم في أي وقت، مما يجعل التمثيل أكثر مرونة وتخصصًا بالقضايا."}'
),
(1, 'published', FALSE,
  '{"en": [{"value": "Explainable AI (XAI)", "references": []}], "ar": [{"value": "الذكاء الاصطناعي القابل للتفسير (XAI)", "references": []}]}',
  '{"en": "Artificial intelligence models and methods that allow human experts to understand and trust the results and output created by the AI.", "ar": "نماذج وأساليب الذكاء الاصطناعي التي تسمح للخبراء البشريين بفهم نتائج ومخرجات الذكاء الاصطناعي والثقة بها."}',
  '{"en": "As AI models become more complex (like ''black box'' deep learning models), XAI becomes critical for accountability, fairness, and safety, especially in high-stakes fields like healthcare and autonomous driving.", "ar": "مع ازدياد تعقيد نماذج الذكاء الاصطناعي (مثل نماذج التعلم العميق ''الصندوق الأسود'')، يصبح الذكاء الاصطناعي القابل للتفسير أمرًا بالغ الأهمية للمساءلة والإنصاف والسلامة، خاصة في المجالات عالية المخاطر مثل الرعاية الصحية والقيادة الذاتية."}'
),
(4, 'published', FALSE,
  '{"en": [{"value": "Biodiversity Credits", "references": []}], "ar": [{"value": "ائتمانات التنوع البيولوجي", "references": []}]}',
  '{"en": "A market-based instrument designed to finance activities that deliver positive, measurable outcomes for biodiversity.", "ar": "أداة قائمة على السوق مصممة لتمويل الأنشطة التي تحقق نتائج إيجابية وقابلة للقياس للتنوع البيولوجي."}',
  '{"en": "Similar to carbon credits, biodiversity credits allow organizations to invest in projects that restore or protect ecosystems. It is an emerging mechanism to channel private finance towards conservation efforts.", "ar": "على غرار ائتمانات الكربون، تسمح ائتمانات التنوع البيولوجي للمنظمات بالاستثمار في المشاريع التي تستعيد أو تحمي النظم البيئية. إنها آلية ناشئة لتوجيه التمويل الخاص نحو جهود الحفظ."}'
),
(2, 'published', FALSE,
  '{"en": [{"value": "Angel Investor", "references": []}], "ar": [{"value": "المستثمر الملاك", "references": []}]}',
  '{"en": "A high-net-worth individual who provides financial backing for small startups or entrepreneurs, typically in exchange for ownership equity.", "ar": "فرد من أصحاب الثروات العالية يقدم الدعم المالي للشركات الناشئة الصغيرة أو رواد الأعمال، عادة مقابل حصة في الملكية."}',
  '{"en": "Angel investors are often the first source of funding for a startup, providing crucial capital during the early, high-risk stages. Many are successful entrepreneurs themselves and also provide mentorship.", "ar": "غالبًا ما يكون المستثمرون الملائكة المصدر الأول لتمويل شركة ناشئة، حيث يوفرون رأس المال الحيوي خلال المراحل المبكرة عالية المخاطر. كثير منهم رواد أعمال ناجحون ويقدمون أيضًا الإرشاد."}'
);
-- ... (Continue this pattern until 50 terms are created)


-- =================================================================
-- 4. Seed Term-Tags (Many-to-Many Relationship)
-- =================================================================
-- Link terms to their relevant tags using their IDs.
-- =================================================================
INSERT INTO `termTags` (`termId`, `tagId`) VALUES
-- Term 1: Generative AI
(1, 1), -- Artificial Intelligence
(1, 6), -- Digital Transformation
-- Term 2: Quantum Computing
(2, 1), -- Artificial Intelligence
-- Term 3: The Metaverse
(3, 3), -- Smart Cities
(3, 6), -- Digital Transformation
-- Term 4: DAO
(4, 2), -- Blockchain
(4, 8), -- Public Policy
-- Term 5: Biohacking
(5, 13),-- Biotechnology
-- Term 6: CBDC
(6, 2), -- Blockchain
(6, 11),-- FinTech
-- Term 7: Impact Investing
(7, 4), -- Sustainability
(7, 11),-- FinTech
-- Term 8: UBI
(8, 5), -- Gig Economy
(8, 8), -- Public Policy
(8, 16),-- Future of Work
-- Term 9: Tokenization
(9, 2), -- Blockchain
(9, 11),-- FinTech
-- Term 10: Digital Nomadism
(10, 5),-- Gig Economy
(10, 16),-- Future of Work
-- Term 11: Gamification
(11, 7),-- Youth Empowerment
(11, 12),-- EdTech
-- Term 12: Transhumanism
(12, 13),-- Biotechnology
-- Term 13: Carbon Sequestration
(13, 4),-- Sustainability
(13, 9),-- Renewable Energy
-- Term 14: Vertical Farming
(14, 3),-- Smart Cities
(14, 4),-- Sustainability
-- Term 15: Green Hydrogen
(15, 4),-- Sustainability
(15, 9),-- Renewable Energy
-- Term 16: E-governance
(16, 6),-- Digital Transformation
(16, 8),-- Public Policy
-- Term 17: Algorithmic Bias
(17, 1),-- Artificial Intelligence
(17, 8),-- Public Policy
(17, 17),-- Data Privacy
-- Term 18: Predictive Policing
(18, 1),-- Artificial Intelligence
(18, 8),-- Public Policy
-- Term 19: Internet of Things (IoT)
(19, 3),-- Smart Cities
(19, 6),-- Digital Transformation
-- Term 20: Creator Economy
(20, 5),-- Gig Economy
(20, 7),-- Youth Empowerment
-- Term 21: Desalination
(21, 4),-- Sustainability
(21, 9),-- Renewable Energy
-- Term 22: Slowbalisation
(22, 8),-- Public Policy
-- Term 23: Digital Divide
(23, 6),-- Digital Transformation
(23, 12),-- EdTech
(23, 8),-- Public Policy
-- Term 24: Edge Computing
(24, 1),-- Artificial Intelligence
(24, 3),-- Smart Cities
-- Term 25: Precision Agriculture
(25, 1),-- Artificial Intelligence
(25, 4),-- Sustainability
-- Term 26: Subscription Economy
(26, 5),-- Gig Economy
-- Term 27: Microdosing
(27, 13),-- Biotechnology
(27, 15),-- Mental Health
-- Term 28: Evidence-Based Policymaking
(28, 8),-- Public Policy
-- Term 29: 5G Technology
(29, 3),-- Smart Cities
(29, 6),-- Digital Transformation
-- Term 30: Geoengineering
(30, 4),-- Sustainability
(30, 8),-- Public Policy
-- Term 31: Decentralized Finance (DeFi)
(31, 2),-- Blockchain
(31, 11),-- FinTech
-- Term 32: Cancel Culture
(32, 7),-- Youth Empowerment
-- Term 33: Data Sovereignty
(33, 8),-- Public Policy
(33, 17),-- Data Privacy
-- Term 34: Brain-Computer Interface (BCI)
(34, 1),-- Artificial Intelligence
(34, 13),-- Biotechnology
-- Term 35: Climate Migration
(35, 4),-- Sustainability
(35, 8),-- Public Policy
-- Term 36: Natural Capital
(36, 4),-- Sustainability
(36, 14),-- Circular Economy
-- Term 37: Post-Truth
(37, 8),-- Public Policy
-- Term 38: Open Data
(38, 6),-- Digital Transformation
(38, 8),-- Public Policy
-- Term 39: Digital Twin
(39, 1),-- Artificial Intelligence
(39, 3),-- Smart Cities
-- Term 40: E-waste
(40, 4),-- Sustainability
(40, 14),-- Circular Economy
-- Term 41: Stakeholder Capitalism
(41, 8),-- Public Policy
-- Term 42: Attention Economy
(42, 6),-- Digital Transformation
(42, 15),-- Mental Health
-- Term 43: Liquid Democracy
(43, 2),-- Blockchain
(43, 8),-- Public Policy
-- Term 44: Explainable AI (XAI)
(44, 1),-- Artificial Intelligence
(44, 17),-- Data Privacy
-- Term 45: Biodiversity Credits
(45, 4),-- Sustainability
(45, 14),-- Circular Economy
-- Term 46: Angel Investor
(46, 11); -- FinTech