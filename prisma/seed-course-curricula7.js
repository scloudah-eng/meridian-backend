// Seventh and final batch — completes curricula for all remaining
// courses. Note: two courses share the identical title "Certified
// Anti-Fraud Specialist (ACAMS – CAFS)" in the source catalog (one under
// Fraud Prevention, one under AML) — since lookup is by title, only the
// first matching row will be updated; the client may want to rename one
// for clarity. Run with: npm run seed:curricula7

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LESSON_DURATION = 600;

const CURRICULA = [
  {
    courseTitle: 'Cross-Functional Anti-Fraud Programs',
    modules: [
      { title: 'Foundations of Cross-Functional Anti-Fraud Work', titleAr: 'أساسيات العمل المشترك بين الوظائف لمكافحة الاحتيال', lessons: [
        { en: 'Definition of a Cross-Functional Anti-Fraud Program', ar: 'تعريف برنامج مكافحة الاحتيال المشترك بين الوظائف' },
        { en: 'Importance of Cross-Departmental Collaboration', ar: 'أهمية التعاون بين الإدارات' },
        { en: 'Core Elements of a Coordinated Program', ar: 'العناصر الأساسية لبرنامج منسّق' },
        { en: 'Common Departments Involved', ar: 'الإدارات المشاركة الشائعة' }
      ]},
      { title: 'Coordinating Across Functions', titleAr: 'التنسيق بين الوظائف', lessons: [
        { en: 'Factors Affecting Cross-Functional Coordination', ar: 'العوامل المؤثرة في التنسيق بين الوظائف' },
        { en: 'Information-Sharing Techniques', ar: 'تقنيات تبادل المعلومات' }
      ]},
      { title: 'Sustaining the Program', titleAr: 'استدامة البرنامج', lessons: [
        { en: 'Measuring Cross-Functional Program Impact', ar: 'قياس أثر البرنامج المشترك' },
        { en: 'Improving Ongoing Coordination', ar: 'تحسين التنسيق المستمر' }
      ]}
    ]
  },
  {
    courseTitle: 'Certified Anti-Fraud Specialist (ACAMS – CAFS)',
    modules: [
      { title: 'Foundations of the CAFS Discipline', titleAr: 'أساسيات تخصص CAFS', lessons: [
        { en: 'Definition of the Anti-Fraud Specialist Role', ar: 'تعريف دور أخصائي مكافحة الاحتيال' },
        { en: 'Importance of the CAFS Credential', ar: 'أهمية شهادة CAFS' },
        { en: 'Core Elements of the ACAMS Body of Knowledge', ar: 'العناصر الأساسية لمحتوى معرفة ACAMS' },
        { en: 'Specialist Scope vs Generalist Roles', ar: 'نطاق الأخصائي مقابل الأدوار العامة' }
      ]},
      { title: 'Applying Specialist Skills', titleAr: 'تطبيق مهارات الأخصائي', lessons: [
        { en: 'Factors Affecting Specialist Effectiveness', ar: 'العوامل المؤثرة في فعالية الأخصائي' },
        { en: 'Advanced Detection Techniques', ar: 'تقنيات الكشف المتقدمة' }
      ]},
      { title: 'Professional Practice', titleAr: 'الممارسة المهنية', lessons: [
        { en: 'Measuring Specialist Performance', ar: 'قياس أداء الأخصائي' },
        { en: 'Improving Continuing Professional Development', ar: 'تحسين التطوير المهني المستمر' }
      ]}
    ]
  },
  {
    courseTitle: 'Cybersecurity Awareness for Anti-Fraud Teams (ISC2 — via TenIntelligence)',
    modules: [
      { title: 'Foundations of Cyber-Fraud Overlap', titleAr: 'أساسيات تداخل الأمن السيبراني والاحتيال', lessons: [
        { en: 'Definition of Cyber-Enabled Fraud', ar: 'تعريف الاحتيال المرتبط بالفضاء السيبراني' },
        { en: 'Importance of Cybersecurity Awareness for Fraud Teams', ar: 'أهمية الوعي بالأمن السيبراني لفرق الاحتيال' },
        { en: 'Core Elements of Cyber-Fraud Risk', ar: 'العناصر الأساسية لمخاطر الاحتيال السيبراني' },
        { en: 'Common Attack Vectors', ar: 'مسارات الهجوم الشائعة' }
      ]},
      { title: 'Recognizing Cyber-Fraud Risk', titleAr: 'التعرف على مخاطر الاحتيال السيبراني', lessons: [
        { en: 'Factors Affecting Team Exposure', ar: 'العوامل المؤثرة في تعرض الفريق' },
        { en: 'Collaboration Techniques with IT Security', ar: 'تقنيات التعاون مع أمن المعلومات' }
      ]},
      { title: 'Strengthening Team Readiness', titleAr: 'تعزيز جاهزية الفريق', lessons: [
        { en: 'Measuring Team Cyber Awareness', ar: 'قياس وعي الفريق السيبراني' },
        { en: 'Improving Joint Response Protocols', ar: 'تحسين بروتوكولات الاستجابة المشتركة' }
      ]}
    ]
  },
  {
    courseTitle: 'Regulatory Compliance & Risk Register Workshops',
    modules: [
      { title: 'Foundations of Regulatory Compliance', titleAr: 'أساسيات الامتثال التنظيمي', lessons: [
        { en: 'Definition of Regulatory Compliance', ar: 'تعريف الامتثال التنظيمي' },
        { en: 'Importance of a Maintained Risk Register', ar: 'أهمية سجل مخاطر محدَّث' },
        { en: 'Core Elements of a Risk Register', ar: 'العناصر الأساسية لسجل المخاطر' },
        { en: 'Linking Compliance Obligations to Risks', ar: 'ربط التزامات الامتثال بالمخاطر' }
      ]},
      { title: 'Building & Maintaining the Register', titleAr: 'بناء السجل وصيانته', lessons: [
        { en: 'Factors Affecting Register Accuracy', ar: 'العوامل المؤثرة في دقة السجل' },
        { en: 'Workshop Facilitation Techniques', ar: 'تقنيات تيسير ورش العمل' }
      ]},
      { title: 'Sustaining Compliance Practice', titleAr: 'استدامة ممارسة الامتثال', lessons: [
        { en: 'Measuring Register Currency', ar: 'قياس حداثة السجل' },
        { en: 'Improving Review Cadence', ar: 'تحسين وتيرة المراجعة' }
      ]}
    ]
  },
  {
    courseTitle: 'Governance & Ethics (GRES — GAFM & IIA Modules)',
    modules: [
      { title: 'Foundations of Governance & Ethics', titleAr: 'أساسيات الحوكمة والأخلاقيات', lessons: [
        { en: 'Definition of Combined Governance & Ethics Practice', ar: 'تعريف ممارسة الحوكمة والأخلاقيات المشتركة' },
        { en: 'Importance of the GRES Credential', ar: 'أهمية شهادة GRES' },
        { en: 'Core Elements of GAFM & IIA Modules', ar: 'العناصر الأساسية لوحدات GAFM وIIA' },
        { en: 'Overlap Between Governance & Ethics', ar: 'التداخل بين الحوكمة والأخلاقيات' }
      ]},
      { title: 'Applying Integrated Governance', titleAr: 'تطبيق الحوكمة المتكاملة', lessons: [
        { en: 'Factors Affecting Integrated Practice', ar: 'العوامل المؤثرة في الممارسة المتكاملة' },
        { en: 'Techniques for Aligning Governance & Ethics', ar: 'تقنيات مواءمة الحوكمة والأخلاقيات' }
      ]},
      { title: 'Professional Application', titleAr: 'التطبيق المهني', lessons: [
        { en: 'Measuring Integrated Governance Maturity', ar: 'قياس نضج الحوكمة المتكاملة' },
        { en: 'Improving Cross-Module Practice', ar: 'تحسين الممارسة عبر الوحدات' }
      ]}
    ]
  },
  {
    courseTitle: 'Project Governance & Stakeholder Engagement',
    modules: [
      { title: 'Foundations of Project Governance', titleAr: 'أساسيات حوكمة المشاريع', lessons: [
        { en: 'Definition of Project Governance', ar: 'تعريف حوكمة المشاريع' },
        { en: 'Importance of Stakeholder Engagement', ar: 'أهمية مشاركة أصحاب المصلحة' },
        { en: 'Core Elements of a Governance Structure', ar: 'العناصر الأساسية لهيكل الحوكمة' },
        { en: 'Stakeholder Mapping Basics', ar: 'أساسيات تحديد أصحاب المصلحة' }
      ]},
      { title: 'Engaging Stakeholders Effectively', titleAr: 'إشراك أصحاب المصلحة بفعالية', lessons: [
        { en: 'Factors Affecting Stakeholder Buy-In', ar: 'العوامل المؤثرة في تأييد أصحاب المصلحة' },
        { en: 'Communication & Engagement Techniques', ar: 'تقنيات التواصل والإشراك' }
      ]},
      { title: 'Sustaining Governance', titleAr: 'استدامة الحوكمة', lessons: [
        { en: 'Measuring Governance Effectiveness', ar: 'قياس فعالية الحوكمة' },
        { en: 'Improving Stakeholder Reporting', ar: 'تحسين تقارير أصحاب المصلحة' }
      ]}
    ]
  },
  {
    courseTitle: 'Project Simulation Labs & Case-Study Workshops',
    modules: [
      { title: 'Foundations of Simulation-Based Learning', titleAr: 'أساسيات التعلم القائم على المحاكاة', lessons: [
        { en: 'Definition of Project Simulation', ar: 'تعريف محاكاة المشاريع' },
        { en: 'Importance of Applied Case Studies', ar: 'أهمية دراسات الحالة التطبيقية' },
        { en: 'Core Elements of a Simulation Lab', ar: 'العناصر الأساسية لمعمل المحاكاة' },
        { en: 'Selecting Representative Case Studies', ar: 'اختيار دراسات حالة تمثيلية' }
      ]},
      { title: 'Running the Simulation', titleAr: 'إدارة المحاكاة', lessons: [
        { en: 'Factors Affecting Simulation Realism', ar: 'العوامل المؤثرة في واقعية المحاكاة' },
        { en: 'Facilitation Techniques for Workshops', ar: 'تقنيات تيسير الورش' }
      ]},
      { title: 'Applying Lessons Learned', titleAr: 'تطبيق الدروس المستفادة', lessons: [
        { en: 'Measuring Learning Transfer', ar: 'قياس انتقال التعلم' },
        { en: 'Improving Future Simulation Design', ar: 'تحسين تصميم المحاكاة المستقبلية' }
      ]}
    ]
  },
  {
    courseTitle: 'Oracle & SAP (ERP) End-User Training',
    modules: [
      { title: 'Foundations of ERP End-User Skills', titleAr: 'أساسيات مهارات مستخدم ERP', lessons: [
        { en: 'Definition of an ERP End User', ar: 'تعريف مستخدم ERP النهائي' },
        { en: 'Importance of Proper End-User Training', ar: 'أهمية تدريب المستخدم النهائي السليم' },
        { en: 'Core Elements of Oracle & SAP Interfaces', ar: 'العناصر الأساسية لواجهات Oracle وSAP' },
        { en: 'Common Modules Overview', ar: 'نظرة عامة على الوحدات الشائعة' }
      ]},
      { title: 'Using the System Day-to-Day', titleAr: 'استخدام النظام يوميًا', lessons: [
        { en: 'Factors Affecting User Adoption', ar: 'العوامل المؤثرة في تبني المستخدم' },
        { en: 'Common Transaction Techniques', ar: 'تقنيات المعاملات الشائعة' }
      ]},
      { title: 'Troubleshooting & Support', titleAr: 'استكشاف الأخطاء والدعم', lessons: [
        { en: 'Measuring User Proficiency', ar: 'قياس كفاءة المستخدم' },
        { en: 'Improving Self-Service Troubleshooting', ar: 'تحسين استكشاف الأخطاء ذاتيًا' }
      ]}
    ]
  },
  {
    courseTitle: 'Job Evaluation & Grading Fundamentals',
    modules: [
      { title: 'Foundations of Job Evaluation', titleAr: 'أساسيات تقييم الوظائف', lessons: [
        { en: 'Definition of Job Evaluation', ar: 'تعريف تقييم الوظائف' },
        { en: 'Importance of a Fair Grading Structure', ar: 'أهمية هيكل تدرج عادل' },
        { en: 'Core Elements of a Job Evaluation System', ar: 'العناصر الأساسية لنظام تقييم الوظائف' },
        { en: 'Common Evaluation Methods', ar: 'طرق التقييم الشائعة' }
      ]},
      { title: 'Applying the Grading Structure', titleAr: 'تطبيق هيكل التدرج', lessons: [
        { en: 'Factors Affecting Grading Consistency', ar: 'العوامل المؤثرة في اتساق التدرج' },
        { en: 'Job Description & Weighting Techniques', ar: 'تقنيات الوصف الوظيفي والترجيح' }
      ]},
      { title: 'Sustaining the System', titleAr: 'استدامة النظام', lessons: [
        { en: 'Measuring Grading System Fairness', ar: 'قياس عدالة نظام التدرج' },
        { en: 'Improving Periodic Job Evaluation Reviews', ar: 'تحسين المراجعات الدورية لتقييم الوظائف' }
      ]}
    ]
  },
  {
    courseTitle: 'Recruitment & Interviewing Skills',
    modules: [
      { title: 'Foundations of Recruitment', titleAr: 'أساسيات التوظيف', lessons: [
        { en: 'Definition of Structured Recruitment', ar: 'تعريف التوظيف المنظم' },
        { en: 'Importance of Effective Interviewing', ar: 'أهمية المقابلات الفعّالة' },
        { en: 'Core Elements of a Recruitment Process', ar: 'العناصر الأساسية لعملية التوظيف' },
        { en: 'Common Interview Formats', ar: 'أشكال المقابلات الشائعة' }
      ]},
      { title: 'Conducting Effective Interviews', titleAr: 'إجراء مقابلات فعّالة', lessons: [
        { en: 'Factors Affecting Interview Bias', ar: 'العوامل المؤثرة في تحيّز المقابلة' },
        { en: 'Behavioral & Competency-Based Techniques', ar: 'تقنيات السلوك والكفاءة' }
      ]},
      { title: 'Improving Hiring Outcomes', titleAr: 'تحسين نتائج التوظيف', lessons: [
        { en: 'Measuring Recruitment Quality', ar: 'قياس جودة التوظيف' },
        { en: 'Improving Candidate Experience', ar: 'تحسين تجربة المرشح' }
      ]}
    ]
  },
  {
    courseTitle: 'Organizational Culture & Employee Engagement Programs',
    modules: [
      { title: 'Foundations of Organizational Culture', titleAr: 'أساسيات ثقافة المنظمة', lessons: [
        { en: 'Definition of Organizational Culture', ar: 'تعريف ثقافة المنظمة' },
        { en: 'Importance of Employee Engagement', ar: 'أهمية التفاعل المؤسسي' },
        { en: 'Core Elements of an Engagement Program', ar: 'العناصر الأساسية لبرنامج التفاعل' },
        { en: 'Culture vs Engagement — Key Differences', ar: 'الثقافة مقابل التفاعل: الفروقات الرئيسية' }
      ]},
      { title: 'Building Engagement Programs', titleAr: 'بناء برامج التفاعل', lessons: [
        { en: 'Factors Affecting Engagement Levels', ar: 'العوامل المؤثرة في مستويات التفاعل' },
        { en: 'Survey & Feedback Techniques', ar: 'تقنيات الاستبيانات والتغذية الراجعة' }
      ]},
      { title: 'Sustaining a Positive Culture', titleAr: 'استدامة ثقافة إيجابية', lessons: [
        { en: 'Measuring Culture & Engagement Health', ar: 'قياس صحة الثقافة والتفاعل' },
        { en: 'Improving Culture Over Time', ar: 'تحسين الثقافة بمرور الوقت' }
      ]}
    ]
  },
  {
    courseTitle: 'Quality Assurance in Government Programs',
    modules: [
      { title: 'Foundations of Government QA', titleAr: 'أساسيات ضمان الجودة الحكومي', lessons: [
        { en: 'Definition of Quality Assurance in the Public Sector', ar: 'تعريف ضمان الجودة في القطاع العام' },
        { en: 'Importance of QA for Government Programs', ar: 'أهمية ضمان الجودة للبرامج الحكومية' },
        { en: 'Core Elements of a Government QA Framework', ar: 'العناصر الأساسية لإطار ضمان الجودة الحكومي' },
        { en: 'Public Accountability Basics', ar: 'أساسيات المساءلة العامة' }
      ]},
      { title: 'Applying QA in Public Programs', titleAr: 'تطبيق ضمان الجودة في البرامج العامة', lessons: [
        { en: 'Factors Affecting Public Sector QA', ar: 'العوامل المؤثرة في ضمان الجودة بالقطاع العام' },
        { en: 'Citizen Feedback & Service Standards Techniques', ar: 'تقنيات تغذية المواطنين ومعايير الخدمة' }
      ]},
      { title: 'Sustaining Program Quality', titleAr: 'استدامة جودة البرنامج', lessons: [
        { en: 'Measuring Government Program Quality', ar: 'قياس جودة البرنامج الحكومي' },
        { en: 'Improving Public Service Delivery', ar: 'تحسين تقديم الخدمة العامة' }
      ]}
    ]
  },
  {
    courseTitle: 'Quality Management in Educational Institutions',
    modules: [
      { title: 'Foundations of Educational Quality Management', titleAr: 'أساسيات إدارة الجودة التعليمية', lessons: [
        { en: 'Definition of Quality Management in Education', ar: 'تعريف إدارة الجودة في التعليم' },
        { en: 'Importance of Educational Quality Standards', ar: 'أهمية معايير الجودة التعليمية' },
        { en: 'Core Elements of an Institutional QA System', ar: 'العناصر الأساسية لنظام ضمان الجودة المؤسسي' },
        { en: 'Accreditation Basics', ar: 'أساسيات الاعتماد الأكاديمي' }
      ]},
      { title: 'Applying Quality Practices', titleAr: 'تطبيق ممارسات الجودة', lessons: [
        { en: 'Factors Affecting Educational Quality Outcomes', ar: 'العوامل المؤثرة في نتائج الجودة التعليمية' },
        { en: 'Student & Faculty Feedback Techniques', ar: 'تقنيات تغذية الطلاب وأعضاء هيئة التدريس' }
      ]},
      { title: 'Sustaining Educational Quality', titleAr: 'استدامة الجودة التعليمية', lessons: [
        { en: 'Measuring Institutional Quality Maturity', ar: 'قياس نضج الجودة المؤسسية' },
        { en: 'Improving Continuous Academic Improvement', ar: 'تحسين التحسين الأكاديمي المستمر' }
      ]}
    ]
  },
  {
    courseTitle: 'Change Management & Quality System Implementation',
    modules: [
      { title: 'Foundations of Change Management', titleAr: 'أساسيات إدارة التغيير', lessons: [
        { en: 'Definition of Change Management', ar: 'تعريف إدارة التغيير' },
        { en: 'Importance of Managed Quality System Rollouts', ar: 'أهمية تطبيق نظم الجودة بشكل مُدار' },
        { en: 'Core Elements of a Change Management Plan', ar: 'العناصر الأساسية لخطة إدارة التغيير' },
        { en: 'Common Resistance Points', ar: 'نقاط المقاومة الشائعة' }
      ]},
      { title: 'Implementing Quality Systems', titleAr: 'تطبيق نظم الجودة', lessons: [
        { en: 'Factors Affecting Implementation Success', ar: 'العوامل المؤثرة في نجاح التطبيق' },
        { en: 'Rollout & Adoption Techniques', ar: 'تقنيات الإطلاق والتبني' }
      ]},
      { title: 'Sustaining the New System', titleAr: 'استدامة النظام الجديد', lessons: [
        { en: 'Measuring Adoption & Sustained Use', ar: 'قياس التبني والاستخدام المستمر' },
        { en: 'Improving Post-Implementation Support', ar: 'تحسين الدعم بعد التطبيق' }
      ]}
    ]
  },
  {
    courseTitle: 'Process Planning & Service Journey Design',
    modules: [
      { title: 'Foundations of Process Planning', titleAr: 'أساسيات تخطيط العمليات', lessons: [
        { en: 'Definition of Service Journey Design', ar: 'تعريف تصميم رحلة الخدمة' },
        { en: 'Importance of Deliberate Process Planning', ar: 'أهمية التخطيط المتعمد للعمليات' },
        { en: 'Core Elements of a Service Journey Map', ar: 'العناصر الأساسية لخريطة رحلة الخدمة' },
        { en: 'Customer Touchpoint Basics', ar: 'أساسيات نقاط تواصل العميل' }
      ]},
      { title: 'Designing the Journey', titleAr: 'تصميم الرحلة', lessons: [
        { en: 'Factors Affecting Journey Design Quality', ar: 'العوامل المؤثرة في جودة تصميم الرحلة' },
        { en: 'Mapping & Prototyping Techniques', ar: 'تقنيات الرسم والنمذجة الأولية' }
      ]},
      { title: 'Refining the Process', titleAr: 'تحسين العملية', lessons: [
        { en: 'Measuring Journey Effectiveness', ar: 'قياس فعالية الرحلة' },
        { en: 'Improving Journey Based on Feedback', ar: 'تحسين الرحلة بناءً على التغذية الراجعة' }
      ]}
    ]
  },
  {
    courseTitle: 'Competency Labs — Simulation-Based Learning',
    modules: [
      { title: 'Foundations of Competency-Based Learning', titleAr: 'أساسيات التعلم القائم على الكفاءة', lessons: [
        { en: 'Definition of a Competency Lab', ar: 'تعريف معمل الكفاءة' },
        { en: 'Importance of Simulation-Based Learning', ar: 'أهمية التعلم القائم على المحاكاة' },
        { en: 'Core Elements of a Competency Framework', ar: 'العناصر الأساسية لإطار الكفاءة' },
        { en: 'Designing Realistic Scenarios', ar: 'تصميم سيناريوهات واقعية' }
      ]},
      { title: 'Running Competency Labs', titleAr: 'إدارة معامل الكفاءة', lessons: [
        { en: 'Factors Affecting Learning Transfer', ar: 'العوامل المؤثرة في انتقال التعلم' },
        { en: 'Facilitation & Assessment Techniques', ar: 'تقنيات التيسير والتقييم' }
      ]},
      { title: 'Applying Competencies on the Job', titleAr: 'تطبيق الكفاءات في العمل', lessons: [
        { en: 'Measuring Competency Gains', ar: 'قياس مكاسب الكفاءة' },
        { en: 'Improving Lab-to-Job Transfer', ar: 'تحسين الانتقال من المعمل للعمل' }
      ]}
    ]
  },
  {
    courseTitle: 'Policy Writing & Effective Internal Communication',
    modules: [
      { title: 'Foundations of Policy Writing', titleAr: 'أساسيات كتابة السياسات', lessons: [
        { en: 'Definition of an Organizational Policy', ar: 'تعريف السياسة المؤسسية' },
        { en: 'Importance of Clear Internal Communication', ar: 'أهمية التواصل الداخلي الواضح' },
        { en: 'Core Elements of a Well-Written Policy', ar: 'العناصر الأساسية لسياسة مكتوبة جيدًا' },
        { en: 'Common Policy Structures', ar: 'هياكل السياسات الشائعة' }
      ]},
      { title: 'Communicating Policies Effectively', titleAr: 'التواصل الفعّال حول السياسات', lessons: [
        { en: 'Factors Affecting Policy Comprehension', ar: 'العوامل المؤثرة في فهم السياسة' },
        { en: 'Plain-Language Writing Techniques', ar: 'تقنيات الكتابة بلغة واضحة' }
      ]},
      { title: 'Sustaining Policy Awareness', titleAr: 'استدامة الوعي بالسياسات', lessons: [
        { en: 'Measuring Policy Awareness & Adherence', ar: 'قياس الوعي بالسياسة والالتزام بها' },
        { en: 'Improving Policy Update Communication', ar: 'تحسين التواصل حول تحديث السياسات' }
      ]}
    ]
  },
  {
    courseTitle: 'Oracle Functions — HR / Procurement',
    modules: [
      { title: 'Foundations of Oracle HR & Procurement Modules', titleAr: 'أساسيات وحدات Oracle للموارد البشرية والمشتريات', lessons: [
        { en: 'Definition of Oracle HR & Procurement Functions', ar: 'تعريف وظائف Oracle للموارد البشرية والمشتريات' },
        { en: 'Importance of Module-Specific Training', ar: 'أهمية التدريب المخصص لكل وحدة' },
        { en: 'Core Elements of the HR Module', ar: 'العناصر الأساسية لوحدة الموارد البشرية' },
        { en: 'Core Elements of the Procurement Module', ar: 'العناصر الأساسية لوحدة المشتريات' }
      ]},
      { title: 'Using the Modules Day-to-Day', titleAr: 'استخدام الوحدات يوميًا', lessons: [
        { en: 'Factors Affecting Module Adoption', ar: 'العوامل المؤثرة في تبني الوحدة' },
        { en: 'Common Transaction Workflows', ar: 'مسارات المعاملات الشائعة' }
      ]},
      { title: 'Optimizing Usage', titleAr: 'تحسين الاستخدام', lessons: [
        { en: 'Measuring Module Proficiency', ar: 'قياس الكفاءة في استخدام الوحدة' },
        { en: 'Improving Cross-Module Data Accuracy', ar: 'تحسين دقة البيانات بين الوحدات' }
      ]}
    ]
  },
  {
    courseTitle: 'CCISP — Certified Cybersecurity Specialist',
    modules: [
      { title: 'Foundations of Cybersecurity Specialization', titleAr: 'أساسيات التخصص في الأمن السيبراني', lessons: [
        { en: 'Definition of the CCISP Specialization', ar: 'تعريف تخصص CCISP' },
        { en: 'Importance of Specialist Cybersecurity Skills', ar: 'أهمية مهارات الأمن السيبراني المتخصصة' },
        { en: 'Core Elements of the CCISP Curriculum', ar: 'العناصر الأساسية لمنهج CCISP' },
        { en: 'Specialist vs Generalist Security Roles', ar: 'الأدوار الأمنية المتخصصة مقابل العامة' }
      ]},
      { title: 'Applying Specialist Practices', titleAr: 'تطبيق الممارسات المتخصصة', lessons: [
        { en: 'Factors Affecting Security Specialist Effectiveness', ar: 'العوامل المؤثرة في فعالية أخصائي الأمن' },
        { en: 'Advanced Defense Techniques', ar: 'تقنيات الدفاع المتقدمة' }
      ]},
      { title: 'Professional Practice', titleAr: 'الممارسة المهنية', lessons: [
        { en: 'Measuring Specialist Readiness', ar: 'قياس جاهزية الأخصائي' },
        { en: 'Improving Ongoing Threat Awareness', ar: 'تحسين الوعي المستمر بالتهديدات' }
      ]}
    ]
  },
  {
    courseTitle: 'Cloud Computing & SaaS Awareness',
    modules: [
      { title: 'Foundations of Cloud & SaaS', titleAr: 'أساسيات الحوسبة السحابية وSaaS', lessons: [
        { en: 'Definition of Cloud Computing & SaaS', ar: 'تعريف الحوسبة السحابية وSaaS' },
        { en: 'Importance of Cloud Awareness for Non-Specialists', ar: 'أهمية الوعي السحابي لغير المختصين' },
        { en: 'Core Elements of Cloud Service Models', ar: 'العناصر الأساسية لنماذج الخدمة السحابية' },
        { en: 'IaaS, PaaS & SaaS Differences', ar: 'الفروقات بين IaaS وPaaS وSaaS' }
      ]},
      { title: 'Understanding Cloud Risk & Benefit', titleAr: 'فهم مخاطر وفوائد السحابة', lessons: [
        { en: 'Factors Affecting Cloud Adoption Decisions', ar: 'العوامل المؤثرة في قرارات التبني السحابي' },
        { en: 'Basic Cloud Security Considerations', ar: 'اعتبارات أمن سحابي أساسية' }
      ]},
      { title: 'Applying Cloud Awareness', titleAr: 'تطبيق الوعي السحابي', lessons: [
        { en: 'Measuring Organizational Cloud Readiness', ar: 'قياس جاهزية المؤسسة السحابية' },
        { en: 'Improving Informed Cloud Decision-Making', ar: 'تحسين اتخاذ القرار السحابي المستنير' }
      ]}
    ]
  }
];

async function main() {
  let coursesUpdated = 0, coursesNotFound = 0, modulesCreated = 0, lessonsCreated = 0;

  for (const entry of CURRICULA) {
    const course = await prisma.course.findFirst({ where: { title: entry.courseTitle } });
    if (!course) { console.log(`Not found, skipped: ${entry.courseTitle}`); coursesNotFound++; continue; }

    await prisma.module.deleteMany({ where: { courseId: course.id } });

    for (let mi = 0; mi < entry.modules.length; mi++) {
      const mod = entry.modules[mi];
      const createdModule = await prisma.module.create({
        data: { title: mod.title, titleAr: mod.titleAr, order: mi, courseId: course.id }
      });
      modulesCreated++;

      for (let li = 0; li < mod.lessons.length; li++) {
        const lesson = mod.lessons[li];
        await prisma.lesson.create({
          data: {
            title: lesson.en, titleAr: lesson.ar,
            durationSeconds: LESSON_DURATION, order: li,
            moduleId: createdModule.id
          }
        });
        lessonsCreated++;
      }
    }
    coursesUpdated++;
  }

  console.log(`Done. Updated ${coursesUpdated} courses with real curricula (${modulesCreated} modules, ${lessonsCreated} lessons). ${coursesNotFound} course titles were not found.`);
  console.log('Note: "Certified Anti-Fraud Specialist (ACAMS – CAFS)" appears twice in the catalog with an identical title (Fraud axis and AML axis) — only one of the two rows was updated by this script, since lookup is by title. Consider renaming one for clarity.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
