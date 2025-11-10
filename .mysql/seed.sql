-- 2. termCategories
INSERT INTO `termCategories` (`categoryId`, `displayOrder`, `isActive`, `name`) VALUES
(1, 1, 1, '{\"en\": \"Technology\", \"ar\": \"التكنولوجيا\"}'),
(2, 2, 1, '{\"en\": \"Science\", \"ar\": \"العلوم\"}'),
(3, 3, 0, '{\"en\": \"Economics (Inactive)\", \"ar\": \"الاقتصاد (غير نشط)\"}');

-- 3. tags
INSERT INTO `tags` (`tagId`, `name`) VALUES
(1, '{\"en\": \"AI\", \"ar\": \"الذكاء الاصطناعي\"}'),
(2, '{\"en\": \"Ethics\", \"ar\": \"الأخلاقيات\"}'),
(3, '{\"en\": \"Physics\", \"ar\": \"الفيزياء\"}');

-- 4. terms (with new statuses and content structure)
INSERT INTO `terms` (`termId`, `categoryRef`, `status`, `isFeatured`, `content`) VALUES
(1, 1, 'published', 1, CAST('{
  "default": {
    "en": {
      "name": "Artificial Intelligence",
      "briefDescription": "A branch of computer science dealing with the simulation of intelligent behavior in computers.",
      "fullDescription": "AI involves the development of systems endowed with the intellectual processes characteristic of humans, such as the ability to reason, discover meaning, generalize, or learn from past experience.",
      "references": [
        {"content": "Turing, A.M. (1950). Computing Machinery and Intelligence.", "url": "https://www.csee.umbc.edu/courses/471/papers/turing.pdf"}
      ]
    },
    "ar": {
      "name": "الذكاء الاصطناعي",
      "briefDescription": "فرع من علوم الكمبيوتر يتعامل مع محاكاة السلوك الذكي في أجهزة الكمبيوتر.",
      "fullDescription": "يتضمن الذكاء الاصطناعي تطوير أنظمة تتمتع بالعمليات الفكرية التي تميز البشر، مثل القدرة على التفكير أو اكتشاف المعنى أو التعميم أو التعلم من التجارب السابقة.",
      "references": []
    }
  },
  "more": [
    {
      "locale": "ar-latn",
      "name": "Al-thakaa'' al-istinaa''iy",
      "briefDescription": "Latinized Arabic for AI.",
      "fullDescription": "",
      "references": []
    }
  ]
}' AS JSON)),
(2, 2, 'pending', 0, CAST('{
  "default": {
    "en": {
      "name": "CRISPR",
      "briefDescription": "A gene-editing technology submitted by a user.",
      "fullDescription": "",
      "references": []
    },
    "ar": {
      "name": "كريسبر",
      "briefDescription": "تقنية لتحرير الجينات مقدمة من مستخدم.",
      "fullDescription": "",
      "references": []
    }
  },
  "more": []
}' AS JSON)),
(3, 2, 'has-pending-review', 1, CAST('{
  "default": {
    "en": {
      "name": "Quantum Computing",
      "briefDescription": "A type of computation that uses quantum-mechanical phenomena.",
      "fullDescription": "It harnesses principles like superposition and entanglement to process information in fundamentally new ways.",
      "references": []
    },
    "ar": {
      "name": "الحوسبة الكمومية",
      "briefDescription": "نوع من الحوسبة يستخدم الظواهر الميكانيكية الكمومية.",
      "fullDescription": "",
      "references": []
    }
  },
  "more": []
}' AS JSON)),
(4, 1, 'rejected', 0, CAST('{
  "default": {
    "en": { "name": "Spam Term", "briefDescription": "This was a spam submission that was rejected by an admin.", "fullDescription": "", "references": [] },
    "ar": { "name": "مصطلح غير مرغوب فيه", "briefDescription": "تم رفض هذا الإرسال غير المرغوب فيه من قبل المسؤول.", "fullDescription": "", "references": [] }
  },
  "more": []
}' AS JSON));

-- 5. termTags associations
INSERT INTO `termTags` (`termId`, `tagId`) VALUES
(1, 1),
(1, 2),
(3, 3);

-- 6. A pending termReviews record
INSERT INTO `termReviews` (`reviewId`, `termRef`, `translationIdentifier`, `fieldKey`, `suggestedValue`, `explanation`, `references`, `status`) VALUES
(1, 3, 'default-en', 'name', 'Quantum Computation', 'This is the more academically accepted term for the field, as opposed to ''computing''.', CAST('[{\"content\": \"Nielsen, M. A., & Chuang, I. L. (2010). Quantum Computation and Quantum Information.\", \"url\": \"\"}]' AS JSON), 'pending');