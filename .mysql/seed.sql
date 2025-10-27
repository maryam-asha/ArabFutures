-- =================================================================
-- SEED DATA FOR TERM CATEGORIES
-- =================================================================
INSERT INTO `termCategories` (`categoryId`, `displayOrder`, `isActive`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1);

INSERT INTO `termCategoryTranslations` (`categoryRef`, `locale`, `name`) VALUES
(1, 'en', 'Core Sciences'),
(1, 'ar', 'العلوم الأساسية'),
(2, 'en', 'Technology & Engineering'),
(2, 'ar', 'التقنية والهندسة'),
(3, 'en', 'Research & Methodology'),
(3, 'ar', 'البحث والمنهجية');

-- =================================================================
-- SEED DATA FOR TAGS
-- =================================================================
INSERT INTO `tags` (`tagId`) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

INSERT INTO `tagTranslations` (`tagRef`, `locale`, `name`) VALUES
(1, 'en', 'Physics'), (1, 'ar', 'فيزياء'),
(2, 'en', 'Biology'), (2, 'ar', 'أحياء'),
(3, 'en', 'Chemistry'), (3, 'ar', 'كيمياء'),
(4, 'en', 'Data Science'), (4, 'ar', 'علم البيانات'),
(5, 'en', 'Software'), (5, 'ar', 'برمجيات'),
(6, 'en', 'Hardware'), (6, 'ar', 'عتاد'),
(7, 'en', 'Methodology'), (7, 'ar', 'منهجية'),
(8, 'en', 'Theory'), (8, 'ar', 'نظرية'),
(9, 'en', 'Ethics'), (9, 'ar', 'أخلاقيات'),
(10, 'en', 'Environment'), (10, 'ar', 'بيئة');

-- =================================================================
-- SEED DATA FOR 20 TERMS
-- =================================================================
INSERT INTO `terms` (`termId`, `categoryRef`, `status`, `isFeatured`) VALUES
(1, 1, 'published', 1),
(2, 1, 'published', 1),
(3, 1, 'published', 0),
(4, 1, 'published', 1),
(5, 1, 'pending', 0),
(6, 2, 'published', 1),
(7, 2, 'published', 0),
(8, 2, 'published', 1),
(9, 2, 'pending', 0),
(10, 2, 'published', 0),
(11, 3, 'published', 1),
(12, 3, 'published', 0),
(13, 3, 'published', 1),
(14, 3, 'published', 0),
(15, 3, 'published', 1),
(16, 1, 'published', 0),
(17, 2, 'published', 1),
(18, 3, 'published', 0),
(19, 1, 'pending', 0),
(20, 2, 'published', 0);

-- =================================================================
-- TRANSLATIONS FOR TERMS
-- =================================================================

-- Term 1: Photosynthesis
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(1, 'en', 'Photosynthesis', 'The process used by plants, algae, and certain bacteria to harness energy from sunlight and turn it into chemical energy.', 'Photosynthesis is fundamental for life on Earth, as it produces oxygen and converts solar energy into a form that can be used by other organisms. The process occurs in chloroplasts and involves two main stages: the light-dependent reactions and the Calvin cycle.'),
(1, 'ar', 'التمثيل الضوئي', 'العملية التي تستخدمها النباتات والطحالب وبعض أنواع البكتيريا لتسخير الطاقة من ضوء الشمس وتحويلها إلى طاقة كيميائية.', 'يعتبر التمثيل الضوئي أساسيًا للحياة على الأرض، حيث ينتج الأكسجين ويحول الطاقة الشمسية إلى شكل يمكن استخدامه من قبل الكائنات الحية الأخرى. تحدث العملية في البلاستيدات الخضراء وتتضمن مرحلتين رئيسيتين: التفاعلات المعتمدة على الضوء ودورة كالفن.');

-- Term 2: Quantum Mechanics
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(2, 'en', 'Quantum Mechanics', 'A fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.', 'It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Key concepts include quantization of energy, wave-particle duality, and the uncertainty principle.'),
(2, 'ar', 'ميكانيكا الكم', 'نظرية أساسية في الفيزياء تقدم وصفًا للخصائص الفيزيائية للطبيعة على مستوى الذرات والجسيمات دون الذرية.', 'هي أساس كل فيزياء الكم بما في ذلك كيمياء الكم، ونظرية الحقل الكمومي، وتكنولوجيا الكم، وعلم المعلومات الكمومية. تشمل المفاهيم الأساسية تكميم الطاقة، وازدواجية الموجة والجسيم، ومبدأ عدم اليقين.');

-- Term 3: DNA (Deoxyribonucleic acid)
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(3, 'en', 'DNA (Deoxyribonucleic acid)', 'A molecule composed of two polynucleotide chains that coil around each other to form a double helix carrying genetic instructions.', 'DNA is responsible for the development, functioning, growth, and reproduction of all known organisms and many viruses. The genetic information is stored in the sequence of four bases: adenine (A), guanine (G), cytosine (C), and thymine (T).'),
(3, 'ar', 'الحمض النووي الريبوزي منقوص الأكسجين (DNA)', 'جزيء يتكون من سلسلتين من عديد النوكليوتيد تلتفان حول بعضهما البعض لتشكيل لولب مزدوج يحمل التعليمات الوراثية.', 'الحمض النووي هو المسؤول عن التطور والوظيفة والنمو والتكاثر لجميع الكائنات الحية المعروفة والعديد من الفيروسات. يتم تخزين المعلومات الوراثية في تسلسل أربع قواعد: الأدينين (A)، والجوانين (G)، والسيتوزين (C)، والثايمين (T).');

-- Term 4: General Relativity
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(4, 'en', 'General Relativity', 'Albert Einstein''s geometric theory of gravitation, which describes gravity as a curvature of spacetime caused by mass and energy.', 'Published in 1915, it extends special relativity and refines Newton''s law of universal gravitation, providing a unified description of gravity as a geometric property of space and time. It is a cornerstone of modern astrophysics.'),
(4, 'ar', 'النسبية العامة', 'نظرية الجاذبية الهندسية لألبرت أينشتاين، والتي تصف الجاذبية بأنها انحناء في الزمكان ناتج عن الكتلة والطاقة.', 'نُشرت في عام 1915، وهي توسع النسبية الخاصة وتنقي قانون الجذب العام لنيوتن، وتقدم وصفًا موحدًا للجاذبية كخاصية هندسية للزمان والمكان. وهي حجر الزاوية في الفيزياء الفلكية الحديثة.');

-- Term 5: Chemical Bond
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(5, 'en', 'Chemical Bond', 'A lasting attraction between atoms, ions or molecules that enables the formation of chemical compounds.', 'The bond may result from the electrostatic force of attraction between oppositely charged ions as in ionic bonds or through the sharing of electrons as in covalent bonds. The strength of chemical bonds varies considerably.'),
(5, 'ar', 'رابطة كيميائية', 'تجاذب دائم بين الذرات أو الأيونات أو الجزيئات يسمح بتكوين المركبات الكيميائية.', 'قد تنشأ الرابطة عن قوة الجذب الكهروستاتيكي بين الأيونات متقابلة الشحنة كما في الروابط الأيونية أو من خلال مشاركة الإلكترونات كما في الروابط التساهمية. تختلف قوة الروابط الكيميائية بشكل كبير.');

-- Term 6: Algorithm
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(6, 'en', 'Algorithm', 'A finite sequence of well-defined instructions, typically used to solve a class of specific problems or to perform a computation.', 'Algorithms are used as specifications for performing calculations and data processing. For example, a search engine algorithm takes a search query as input and produces a list of relevant web pages as output.'),
(6, 'ar', 'خوارزمية', 'سلسلة محدودة من التعليمات المحددة جيدًا، تستخدم عادةً لحل فئة من المشكلات المحددة أو لإجراء عملية حسابية.', 'تُستخدم الخوارزميات كمواصفات لإجراء الحسابات ومعالجة البيانات. على سبيل المثال، تأخذ خوارزمية محرك البحث استعلام بحث كمدخل وتنتج قائمة بصفحات الويب ذات الصلة كمخرج.');

-- Term 7: Central Processing Unit (CPU)
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(7, 'en', 'Central Processing Unit (CPU)', 'The electronic circuitry that executes instructions comprising a computer program. The CPU performs basic arithmetic, logic, and I/O operations.', 'Often referred to as the "brain" of the computer, the CPU''s performance is a primary factor in determining a computer''s overall speed. Modern CPUs are typically microprocessors contained on a single integrated circuit chip.'),
(7, 'ar', 'وحدة المعالجة المركزية (CPU)', 'الدائرة الإلكترونية التي تنفذ التعليمات التي يتكون منها برنامج الكمبيوتر. تقوم وحدة المعالجة المركزية بتنفيذ العمليات الحسابية والمنطقية والإدخال/الإخراج الأساسية.', 'يُشار إليها غالبًا باسم "دماغ" الكمبيوتر، ويعد أداء وحدة المعالجة المركزية عاملاً أساسيًا في تحديد السرعة الإجمالية للكمبيوتر. وحدات المعالجة المركزية الحديثة هي عادةً معالجات دقيقة موجودة على شريحة دائرة متكاملة واحدة.');

-- Term 8: Machine Learning
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(8, 'en', 'Machine Learning', 'A field of artificial intelligence that uses statistical techniques to give computer systems the ability to "learn" from data without being explicitly programmed.', 'Machine learning algorithms build a model based on sample data, known as training data, in order to make predictions or decisions without being explicitly programmed to do so. It is widely used in applications like email filtering and computer vision.'),
(8, 'ar', 'تعلم الآلة', 'أحد مجالات الذكاء الاصطناعي الذي يستخدم تقنيات إحصائية لمنح أنظمة الكمبيوتر القدرة على "التعلم" من البيانات دون برمجتها بشكل صريح.', 'تبني خوارزميات تعلم الآلة نموذجًا بناءً على بيانات العينة، المعروفة باسم بيانات التدريب، من أجل عمل تنبؤات أو قرارات دون أن تتم برمجتها بشكل صريح للقيام بذلك. يتم استخدامه على نطاق واسع في تطبيقات مثل تصفية البريد الإلكتروني ورؤية الكمبيوتر.');

-- Term 9: API (Application Programming Interface)
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(9, 'en', 'API (Application Programming Interface)', 'A set of rules and tools for building software and applications. It specifies how software components should interact.', 'An API acts as a messenger that takes requests and tells a system what you want to do, and then returns the response back to you. For example, when you use an app on your phone, the app connects to the Internet and sends data to a server. The server then retrieves that data, interprets it, performs the necessary actions and sends it back to your phone.'),
(9, 'ar', 'واجهة برمجة التطبيقات (API)', 'مجموعة من القواعد والأدوات لبناء البرامج والتطبيقات. تحدد كيفية تفاعل مكونات البرامج مع بعضها البعض.', 'تعمل واجهة برمجة التطبيقات (API) كرسول يأخذ الطلبات ويخبر النظام بما تريد القيام به، ثم يعيد الاستجابة إليك. على سبيل المثال، عندما تستخدم تطبيقًا على هاتفك، يتصل التطبيق بالإنترنت ويرسل البيانات إلى خادم. يقوم الخادم بعد ذلك باسترداد تلك البيانات وتفسيرها وتنفيذ الإجراءات اللازمة وإرسالها مرة أخرى إلى هاتفك.');

-- Term 10: Biotechnology
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(10, 'en', 'Biotechnology', 'The use of living systems and organisms to develop or make products, or any technological application that uses biological systems.', 'Biotechnology has applications in various fields, including medicine, agriculture, and industrial processes. Examples include the production of antibiotics, genetic modification of crops, and the development of biofuels.'),
(10, 'ar', 'التكنولوجيا الحيوية', 'استخدام الأنظمة والكائنات الحية لتطوير أو صنع المنتجات، أو أي تطبيق تكنولوجي يستخدم الأنظمة البيولوجية.', 'للتكنولوجيا الحيوية تطبيقات في مجالات مختلفة، بما في ذلك الطب والزراعة والعمليات الصناعية. تشمل الأمثلة إنتاج المضادات الحيوية، والتعديل الوراثي للمحاصيل، وتطوير الوقود الحيوي.');

-- Term 11: Hypothesis
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(11, 'en', 'Hypothesis', 'A proposed explanation for a phenomenon. For a hypothesis to be a scientific hypothesis, the scientific method requires that one can test it.', 'Scientists generally base scientific hypotheses on previous observations that cannot satisfactorily be explained with the available scientific theories. A hypothesis is a conjecture, an informed guess, that is testable and falsifiable.'),
(11, 'ar', 'فرضية', 'تفسير مقترح لظاهرة ما. لكي تكون الفرضية فرضية علمية، تتطلب الطريقة العلمية أن يكون بالإمكان اختبارها.', 'يستند العلماء عمومًا في فرضياتهم العلمية على ملاحظات سابقة لا يمكن تفسيرها بشكل مُرضٍ بالنظريات العلمية المتاحة. الفرضية هي تخمين مستنير قابل للاختبار والتكذيب.');

-- Term 12: Peer Review
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(12, 'en', 'Peer Review', 'The evaluation of work by one or more people with similar competencies as the producers of the work (peers).', 'It functions as a form of self-regulation by qualified members of a profession within the relevant field. Peer review methods are used to maintain standards of quality, improve performance, and provide credibility. In academia, peer review is often used to determine an academic paper''s suitability for publication.'),
(12, 'ar', 'مراجعة الأقران', 'تقييم العمل من قبل شخص واحد أو أكثر من ذوي الكفاءات المماثلة لمنتجي العمل (الأقران).', 'تعمل كشكل من أشكال التنظيم الذاتي من قبل أعضاء مؤهلين في مهنة ما في المجال ذي الصلة. تُستخدم طرق مراجعة الأقران للحفاظ على معايير الجودة وتحسين الأداء وتوفير المصداقية. في الأوساط الأكاديمية، غالبًا ما تستخدم مراجعة الأقران لتحديد مدى ملاءمة ورقة أكاديمية للنشر.');

-- Term 13: Empirical Evidence
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(13, 'en', 'Empirical Evidence', 'Information acquired by observation or experimentation. This data is recorded and analyzed by scientists and is a central process of the scientific method.', 'The term comes from the Greek word for experience, ἐμπειρία (empeiría). Empirical evidence is crucial for testing hypotheses and building scientific theories. It relies on direct experience and observation rather than on theory or belief.'),
(13, 'ar', 'دليل تجريبي', 'المعلومات التي يتم الحصول عليها عن طريق الملاحظة أو التجريب. يتم تسجيل هذه البيانات وتحليلها من قبل العلماء وهي عملية مركزية في المنهج العلمي.', 'يأتي المصطلح من الكلمة اليونانية للتجربة (ἐμπειρία). الدليل التجريبي حاسم لاختبار الفرضيات وبناء النظريات العلمية. يعتمد على الخبرة المباشرة والملاحظة بدلاً من النظرية أو المعتقد.');

-- Term 14: Control Group
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(14, 'en', 'Control Group', 'A group in a scientific experiment that is separated from the rest of the experiment, where the independent variable being tested cannot influence the results.', 'This isolates the independent variable''s effects on the experiment and can help rule out alternative explanations of the experimental results. The control group serves as a baseline against which the experimental group is compared.'),
(14, 'ar', 'مجموعة ضابطة', 'مجموعة في تجربة علمية يتم فصلها عن بقية التجربة، حيث لا يمكن للمتغير المستقل الذي يتم اختباره أن يؤثر على النتائج.', 'يعزل هذا تأثيرات المتغير المستقل على التجربة ويمكن أن يساعد في استبعاد التفسيرات البديلة للنتائج التجريبية. تعمل المجموعة الضابطة كخط أساس تُقارن به المجموعة التجريبية.');

-- Term 15: Informed Consent
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(15, 'en', 'Informed Consent', 'A process for getting permission before conducting a healthcare intervention on a person, or for disclosing personal information.', 'In research, it is a process in which a participant is provided with all the key information about a research study before they decide whether to participate. This is a fundamental principle of research ethics.'),
(15, 'ar', 'الموافقة المستنيرة', 'عملية الحصول على إذن قبل إجراء تدخل رعاية صحية على شخص ما، أو للكشف عن معلومات شخصية.', 'في البحث، هي عملية يتم فيها تزويد المشارك بجميع المعلومات الأساسية حول دراسة بحثية قبل أن يقرر ما إذا كان سيشارك أم لا. هذا مبدأ أساسي من مبادئ أخلاقيات البحث.');

-- Term 16: Ecosystem
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(16, 'en', 'Ecosystem', 'A biological community of interacting organisms and their physical environment.', 'Ecosystems can be of any size, from a small tide pool to an entire rainforest. They include both biotic (living) and abiotic (non-living) components, which are linked together through nutrient cycles and energy flows.'),
(16, 'ar', 'نظام بيئي', 'مجتمع بيولوجي من الكائنات الحية المتفاعلة وبيئتها المادية.', 'يمكن أن تكون النظم البيئية من أي حجم، من بركة مد وجزر صغيرة إلى غابة مطيرة بأكملها. وهي تشمل المكونات الحيوية (الحية) واللاأحيائية (غير الحية)، والتي ترتبط ببعضها البعض من خلال دورات المغذيات وتدفقات الطاقة.');

-- Term 17: Open Source
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(17, 'en', 'Open Source', 'A type of software whose source code is released under a license in which the copyright holder grants users the rights to use, study, change, and distribute the software.', 'Open-source software is often developed in a collaborative public manner. It is a prominent example of open collaboration, meaning any capable user is able to participate in the development.'),
(17, 'ar', 'المصدر المفتوح', 'نوع من البرامج يتم إصدار كود المصدر الخاص به بموجب ترخيص يمنح فيه صاحب حقوق الطبع والنشر للمستخدمين حقوق استخدام البرنامج ودراسته وتغييره وتوزيعه.', 'غالبًا ما يتم تطوير البرامج مفتوحة المصدر بطريقة تعاونية عامة. وهو مثال بارز على التعاون المفتوح، مما يعني أن أي مستخدم قادر يمكنه المشاركة في التطوير.');

-- Term 18: Double-Blind Study
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(18, 'en', 'Double-Blind Study', 'An experiment in which neither the participants nor the researchers know which participants are in the experimental group and which are in the control group.', 'This method is used to prevent bias in research results. Double-blind studies are particularly useful for preventing bias due to demand characteristics or the placebo effect.'),
(18, 'ar', 'دراسة مزدوجة التعمية', 'تجربة لا يعرف فيها المشاركون ولا الباحثون أي المشاركين في المجموعة التجريبية وأيهم في المجموعة الضابطة.', 'تستخدم هذه الطريقة لمنع التحيز في نتائج البحث. تعتبر الدراسات مزدوجة التعمية مفيدة بشكل خاص لمنع التحيز بسبب خصائص الطلب أو تأثير الدواء الوهمي.');

-- Term 19: Thermodynamics
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(19, 'en', 'Thermodynamics', 'The branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter.', 'The behavior of these quantities is governed by the four laws of thermodynamics which convey a quantitative description using measurable macroscopic physical quantities.'),
(19, 'ar', 'الديناميكا الحرارية', 'فرع الفيزياء الذي يتعامل مع الحرارة والشغل ودرجة الحرارة وعلاقتها بالطاقة والإشعاع والخصائص الفيزيائية للمادة.', 'يخضع سلوك هذه الكميات لقوانين الديناميكا الحرارية الأربعة التي تنقل وصفًا كميًا باستخدام كميات فيزيائية عيانية قابلة للقياس.');

-- Term 20: Virtual Reality (VR)
INSERT INTO `termTranslations` (`termRef`, `locale`, `title`, `briefDescription`, `fullDetail`) VALUES
(20, 'en', 'Virtual Reality (VR)', 'A simulated experience that can be similar to or completely different from the real world. Applications of VR include entertainment, education and business.', 'VR systems use headsets or multi-projected environments to generate realistic images, sounds and other sensations that simulate a user''s physical presence in a virtual environment.'),
(20, 'ar', 'الواقع الافتراضي (VR)', 'تجربة محاكاة يمكن أن تكون مشابهة أو مختلفة تمامًا عن العالم الحقيقي. تشمل تطبيقات الواقع الافتراضي الترفيه والتعليم والأعمال.', 'تستخدم أنظمة الواقع الافتراضي سماعات الرأس أو البيئات متعددة الإسقاط لتوليد صور وأصوات وأحاسيس واقعية تحاكي الوجود المادي للمستخدم في بيئة افتراضية.');

-- =================================================================
-- MANY-TO-MANY RELATIONSHIPS: TERM TAGS
-- =================================================================
INSERT INTO `termTags` (`termId`, `tagId`) VALUES
-- Photosynthesis (Biology, Environment, Chemistry)
(1, 2), (1, 10), (1, 3),
-- Quantum Mechanics (Physics, Theory)
(2, 1), (2, 8),
-- DNA (Biology)
(3, 2),
-- General Relativity (Physics, Theory)
(4, 1), (4, 8),
-- Chemical Bond (Chemistry)
(5, 3),
-- Algorithm (Software, Data Science)
(6, 5), (6, 4),
-- CPU (Hardware)
(7, 6),
-- Machine Learning (Data Science, Software, Theory)
(8, 4), (8, 5), (8, 8),
-- API (Software)
(9, 5),
-- Biotechnology (Biology, Environment)
(10, 2), (10, 10),
-- Hypothesis (Methodology, Theory)
(11, 7), (11, 8),
-- Peer Review (Methodology, Ethics)
(12, 7), (12, 9),
-- Empirical Evidence (Methodology)
(13, 7),
-- Control Group (Methodology)
(14, 7),
-- Informed Consent (Ethics, Methodology)
(15, 9), (15, 7),
-- Ecosystem (Biology, Environment)
(16, 2), (16, 10),
-- Open Source (Software, Ethics)
(17, 5), (17, 9),
-- Double-Blind Study (Methodology)
(18, 7),
-- Thermodynamics (Physics, Theory)
(19, 1), (19, 8),
-- Virtual Reality (Hardware, Software)
(20, 6), (20, 5);

-- =================================================================
-- TERM REFERENCES
-- =================================================================
INSERT INTO `termReferences` (`termRef`, `locale`, `content`, `url`) VALUES
(2, 'en', 'The Feynman Lectures on Physics, Vol. III', 'https://www.feynmanlectures.caltech.edu/III_toc.html'),
(2, 'ar', 'محاضرات فاينمان في الفيزياء، المجلد الثالث', 'https://www.feynmanlectures.caltech.edu/III_toc.html'),
(4, 'en', 'Einstein''s original 1915 paper on General Relativity', 'https://einsteinpapers.press.princeton.edu/vol6-trans/49'),
(12, 'en', 'COPE (Committee on Publication Ethics) Guidelines', 'https://publicationethics.org/guidance/Guidelines'),
(12, 'ar', 'إرشادات لجنة أخلاقيات النشر (COPE)', 'https://publicationethics.org/guidance/Guidelines'),
(15, 'en', 'The Belmont Report - Ethical Principles and Guidelines', 'https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/index.html');