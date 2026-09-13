// Populates the database with the real course catalog described in the
// "Smart Compliance Leap (SCL) — Mada Alhyat Training Center" company
// profile PDF: 10 subject axes, each with its actual list of trainable
// certificate/workshop programs ("البرامج التدريبية (مدى الحياة)").
//
// WHAT'S REAL vs. WHAT'S A PLACEHOLDER, so nothing here is mistaken for
// finished, sellable content:
//   REAL — course title (English + exact Arabic from the PDF), the axis
//          it belongs to (used as category/categoryEn), and which
//          certifying body/partner it's associated with (GAFM, ACFE,
//          ACAMS, ISC2, PMI, IIA, CompTIA, etc.), taken directly from
//          the document.
//   PLACEHOLDER — every course is created with price = 1 SAR and a single
//          "Overview" module containing one short placeholder lesson.
//          The PDF is a company profile, not a curriculum: it names each
//          program but gives no lesson breakdown, durations, or prices.
//          Before selling any of these, a trainer/admin must set a real
//          price and build out real modules/lessons/video via admin.html
//          (or directly against the API).
//
// The document's "Technology Solutions" and "Consulting Services" columns
// for each axis are business/consulting service listings, not trainable
// course content, so they are intentionally not imported as courses here.
//
// Run with: npm run seed:scl

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const PLACEHOLDER_PRICE = 1; // SAR — obviously not a real price; replace before publishing.

const AXES = [
  {
    titleAr: 'مكافحة الاحتيال والتحقيقات',
    titleEn: 'Fraud Prevention & Investigations',
    descriptionAr: 'خدمات ونماذج متخصصة في تقييم مخاطر الاحتيال، والتحقيقات الجنائية، وتحليل الحوادث، ومنع الاحتيال الداخلي، وفق المعايير الدولية.',
    descriptionEn: 'Specialized programs in fraud risk assessment, forensic investigation, incident analysis, and internal fraud prevention, aligned with international standards.',
    programs: [
      { ar: 'محلل احتيال معتمد (GAFM® – ChFA)', en: 'Certified Fraud Analyst (GAFM® – ChFA)',
        desc: 'A professional certification covering fraud typologies, detection techniques, and investigative methodology, preparing analysts to identify and respond to fraud risk across an organization.',
        descAr: 'شهادة احترافية تغطي أنواع الاحتيال وأساليب الكشف ومنهجية التحقيق، تؤهل المحلل لتحديد مخاطر الاحتيال والتعامل معها داخل المؤسسة.' },
      { ar: 'مدقق احتيال معتمد (CFE) - مسار التوعية', en: 'Certified Fraud Examiner (CFE) — Awareness Track',
        desc: 'An introductory track aligned with the globally recognized CFE body of knowledge, covering financial transactions, fraud schemes, investigation, and the legal elements of fraud.',
        descAr: 'مسار تمهيدي متوافق مع إطار المعرفة العالمي لشهادة CFE، يغطي المعاملات المالية وأساليب الاحتيال والتحقيق والجوانب القانونية ذات الصلة.' },
      { ar: 'استراتيجيات الوقاية من الاحتيال الداخلي', en: 'Internal Fraud Prevention Strategies',
        desc: 'Practical strategies for closing the control gaps that enable internal fraud, from segregation of duties to proactive monitoring of high-risk functions.',
        descAr: 'استراتيجيات عملية لسد فجوات الرقابة التي تتيح الاحتيال الداخلي، من الفصل بين المهام إلى المراقبة الاستباقية للوظائف عالية الخطورة.' },
      { ar: 'كشف الإشارات التحذيرية ومؤشرات السلوك', en: 'Detecting Red Flags & Behavioral Indicators',
        desc: 'Trains staff to recognize the behavioral and transactional warning signs that typically precede or accompany fraudulent activity, before losses escalate.',
        descAr: 'يدرّب الموظفين على التعرف على المؤشرات السلوكية والمالية التي عادة ما تسبق أو ترافق النشاط الاحتيالي، قبل تفاقم الخسائر.' },
      { ar: 'أخلاقيات الشركات وبناء ثقافة مكافحة الاحتيال', en: 'Corporate Ethics & Building an Anti-Fraud Culture',
        desc: 'Focuses on embedding ethical decision-making and a speak-up culture into daily operations, recognizing that culture is an organization\'s first line of defense against fraud.',
        descAr: 'يركّز على ترسيخ اتخاذ القرار الأخلاقي وثقافة الإبلاغ في العمليات اليومية، انطلاقًا من أن الثقافة المؤسسية هي خط الدفاع الأول ضد الاحتيال.' },
      { ar: 'التحقيقات لغير المراجعين', en: 'Investigations for Non-Auditors',
        desc: 'Equips managers and HR professionals outside the audit function with the basics of conducting a fair, defensible internal investigation when fraud is suspected.',
        descAr: 'يزوّد المدراء والمختصين في الموارد البشرية من خارج وظيفة التدقيق بأساسيات إجراء تحقيق داخلي عادل وقابل للدفاع عند الاشتباه بالاحتيال.' },
      { ar: 'برامج تقاطع مكافحة الاحتيال', en: 'Cross-Functional Anti-Fraud Programs',
        desc: 'Shows how fraud, compliance, audit, and legal teams can coordinate a unified anti-fraud program instead of working in silos.',
        descAr: 'يوضح كيف يمكن لفرق مكافحة الاحتيال والامتثال والتدقيق والشؤون القانونية تنسيق برنامج موحد لمكافحة الاحتيال بدلاً من العمل بمعزل عن بعضها.' },
      { ar: 'أخصائي مكافحة احتيال معتمد (ACAMS – CAFS)', en: 'Certified Anti-Fraud Specialist (ACAMS – CAFS)',
        desc: 'A specialist-level certification track from ACAMS focused on advanced fraud detection, case management, and cross-border fraud typologies.',
        descAr: 'مسار شهادة متخصص من ACAMS يركّز على الكشف المتقدم عن الاحتيال وإدارة الحالات وأنماط الاحتيال العابر للحدود.' },
      { ar: 'التوعية بالأمن السيبراني لفرق مكافحة الاحتيال (ISC2 – عبر TenIntelligence)', en: 'Cybersecurity Awareness for Anti-Fraud Teams (ISC2 — via TenIntelligence)',
        desc: 'Delivered with TenIntelligence, this program bridges fraud investigation and cybersecurity, covering how digital evidence and cyber-enabled fraud intersect.',
        descAr: 'يُقدَّم بالشراكة مع TenIntelligence، ويربط بين التحقيق في الاحتيال والأمن السيبراني، ويغطي تقاطع الأدلة الرقمية مع الاحتيال المرتبط بالفضاء السيبراني.' }
    ]
  },
  {
    titleAr: 'إدارة المخاطر والامتثال',
    titleEn: 'Risk & Compliance Management',
    descriptionAr: 'بناء مؤسسات قوية ومرنة من خلال أطر الحوكمة والمخاطر والامتثال (GRC) المتقدمة، وضمان التوافق مع اللوائح والتنظيمات.',
    descriptionEn: 'Building strong, resilient institutions through advanced Governance, Risk and Compliance (GRC) frameworks and regulatory alignment.',
    programs: [
      { ar: 'محلل مخاطر معتمد (CRA)', en: 'Certified Risk Analyst (CRA)',
        desc: 'Builds core risk-analysis skills: identifying, quantifying, and prioritizing enterprise risks so leadership can make informed, defensible decisions.',
        descAr: 'يبني مهارات تحليل المخاطر الأساسية: تحديد المخاطر المؤسسية وقياسها وترتيب أولوياتها لتمكين القيادة من اتخاذ قرارات مبنية على أساس واضح.' },
      { ar: 'مسؤول امتثال معتمد (CCOE)', en: 'Certified Compliance Officer (CCOE)',
        desc: 'Prepares professionals to run a compliance function day to day — policy management, regulatory tracking, and reporting to leadership.',
        descAr: 'يؤهل المختصين لإدارة وظيفة الامتثال يوميًا — إدارة السياسات، ومتابعة المتطلبات التنظيمية، ورفع التقارير للقيادة.' },
      { ar: 'محترف معتمد في المخاطر والامتثال (GAFM – CRCP)', en: 'Certified Risk & Compliance Professional (GAFM – CRCP)',
        desc: 'A GAFM-accredited program combining risk management and compliance disciplines into one integrated professional certification.',
        descAr: 'برنامج معتمد من GAFM يدمج مجالي إدارة المخاطر والامتثال في شهادة احترافية واحدة متكاملة.' },
      { ar: 'أساسيات إدارة المخاطر المؤسسية (ERM)', en: 'Enterprise Risk Management (ERM) Fundamentals',
        desc: 'Introduces the ERM lifecycle — risk identification, assessment, treatment, and monitoring — as a single framework spanning the whole organization.',
        descAr: 'يقدّم دورة حياة إدارة المخاطر المؤسسية — التحديد والتقييم والمعالجة والمراقبة — كإطار واحد يشمل المؤسسة بأكملها.' },
      { ar: 'برامج تدقيق داخلي قائمة على المخاطر', en: 'Risk-Based Internal Audit Programs',
        desc: 'Shifts internal audit from a checklist exercise to a risk-prioritized approach that focuses audit effort where exposure is highest.',
        descAr: 'ينقل التدقيق الداخلي من أسلوب القوائم المرجعية إلى نهج قائم على أولوية المخاطر يوجّه جهد التدقيق نحو أعلى نقاط التعرض.' },
      { ar: 'التوعية بمكافحة غسل الأموال والاحتيال', en: 'AML & Fraud Awareness',
        desc: 'A foundational awareness session on how money-laundering and fraud risks show up in daily operations, and what staff should escalate.',
        descAr: 'جلسة توعوية أساسية حول كيفية ظهور مخاطر غسل الأموال والاحتيال في العمليات اليومية، وما ينبغي على الموظف تصعيده.' },
      { ar: 'ورش عمل الامتثال التنظيمي وسجلات المخاطر', en: 'Regulatory Compliance & Risk Register Workshops',
        desc: 'Hands-on workshops building and maintaining a live risk register, and mapping it to the regulatory obligations it needs to satisfy.',
        descAr: 'ورش عملية لبناء سجل مخاطر حي والحفاظ عليه، وربطه بالمتطلبات التنظيمية الواجب الوفاء بها.' }
    ]
  },
  {
    titleAr: 'مكافحة الفساد والحوكمة الأخلاقية',
    titleEn: 'Anti-Corruption & Ethical Governance',
    descriptionAr: 'تعزيز النزاهة المؤسسية من خلال أطر الامتثال العالمية، ومعايير الشفافية، وثقافة أخلاقية عملية.',
    descriptionEn: 'Strengthening institutional integrity through global compliance frameworks, transparency standards, and a practical ethical culture.',
    programs: [
      { ar: 'مسؤول مكافحة الفساد المعتمد (GAFM® – CACO)', en: 'Certified Anti-Corruption Officer (GAFM® – CACO)',
        desc: 'Prepares professionals to lead an anti-corruption function — risk assessment, policy design, and investigation of suspected corruption.',
        descAr: 'يؤهل المختصين لقيادة وظيفة مكافحة الفساد — تقييم المخاطر، وتصميم السياسات، والتحقيق في حالات الفساد المشتبه بها.' },
      { ar: 'النزاهة والأخلاقيات في القطاعين العام والخاص', en: 'Integrity & Ethics in the Public and Private Sectors',
        desc: 'Compares integrity frameworks across public and private institutions and how accountability mechanisms actually work in each sector.',
        descAr: 'يقارن أطر النزاهة بين المؤسسات الحكومية والخاصة، وكيفية عمل آليات المساءلة الفعلية في كل قطاع.' },
      { ar: 'أطر امتثال مكافحة الرشوة (ISO 37001)', en: 'Anti-Bribery Compliance Frameworks (ISO 37001)',
        desc: 'Walks through the ISO 37001 anti-bribery management system requirements and how to implement them in a real organization.',
        descAr: 'يستعرض متطلبات نظام إدارة مكافحة الرشوة ISO 37001 وكيفية تطبيقها فعليًا داخل المؤسسة.' },
      { ar: 'ورش تنفيذ مدونات السلوك', en: 'Codes of Conduct Implementation Workshops',
        desc: 'Practical workshops on turning a code of conduct from a signed document into something employees actually reference and follow.',
        descAr: 'ورش عملية لتحويل مدونة السلوك من مستند موقَّع إلى مرجع يستخدمه الموظفون فعليًا في عملهم.' },
      { ar: 'تدقيق داخلي أخلاقي وتقارير النزاهة', en: 'Ethical Internal Audit & Integrity Reporting',
        desc: 'Covers how internal audit can specifically test for ethical breaches and produce integrity reports leadership can act on.',
        descAr: 'يغطي كيفية قيام التدقيق الداخلي باختبار الانتهاكات الأخلاقية تحديدًا، وإعداد تقارير نزاهة يمكن للقيادة اتخاذ إجراء بناءً عليها.' },
      { ar: 'أخلاقيات مجالس الإدارة والتنفيذيين', en: 'Board & Executive Ethics',
        desc: 'Addresses the specific ethical responsibilities and conflict-of-interest exposures that come with board and executive positions.',
        descAr: 'يتناول المسؤوليات الأخلاقية الخاصة وحالات تعارض المصالح المرتبطة بمناصب مجلس الإدارة والإدارة التنفيذية.' },
      { ar: 'الحوكمة والأخلاقيات (GRES – GAFM & IIA Modules)', en: 'Governance & Ethics (GRES — GAFM & IIA Modules)',
        desc: 'A joint GAFM/IIA module set connecting governance structure directly to ethical outcomes across the organization.',
        descAr: 'مجموعة وحدات مشتركة من GAFM وIIA تربط بنية الحوكمة مباشرة بالنتائج الأخلاقية على مستوى المؤسسة.' }
    ]
  },
  {
    titleAr: 'مكافحة غسل الأموال والجرائم المالية',
    titleEn: 'Anti-Money Laundering & Financial Crime (AML/CFT)',
    descriptionAr: 'مساعدة المؤسسات على حماية عملياتها وسمعتها ومكانتها التنظيمية وفقًا لمعايير منع الجريمة المالية العالمية.',
    descriptionEn: 'Helping institutions protect their operations, reputation, and regulatory standing in line with global financial-crime prevention standards.',
    programs: [
      { ar: 'مسؤول معتمد في مكافحة غسل الأموال (GAFM – CAMO)', en: 'Certified Anti-Money Laundering Officer (GAFM – CAMO)',
        desc: 'Prepares professionals to serve as an institution\u2019s designated AML officer, covering program ownership, reporting lines, and regulatory liaison.',
        descAr: 'يؤهل المختصين لتولي دور مسؤول مكافحة غسل الأموال داخل المؤسسة، ويشمل ملكية البرنامج وخطوط الإبلاغ والتواصل مع الجهات الرقابية.' },
      { ar: 'أساسيات مكافحة غسل الأموال (ACAMS)', en: 'AML Fundamentals (ACAMS)',
        desc: 'A foundational course based on ACAMS material covering the money-laundering stages and the core controls used to interrupt them.',
        descAr: 'دورة تأسيسية مبنية على مواد ACAMS تغطي مراحل غسل الأموال والضوابط الأساسية المستخدمة للحد منها.' },
      { ar: 'التحقيقات المتقدمة في مكافحة غسل الأموال', en: 'Advanced AML Investigations',
        desc: 'Goes beyond alert triage into full case-building: tracing fund flows, documenting findings, and preparing suspicious activity reports.',
        descAr: 'يتجاوز الفرز الأولي للتنبيهات إلى بناء الحالة الكاملة: تتبع مسار الأموال، وتوثيق النتائج، وإعداد تقارير الأنشطة المشبوهة.' },
      { ar: 'أخصائي معتمد في الجرائم المالية (GAFM – CAFC)', en: 'Certified Financial Crime Specialist (GAFM – CAFC)',
        desc: 'A broader financial-crime certification spanning fraud, money laundering, and sanctions evasion as interconnected risks.',
        descAr: 'شهادة أوسع في الجرائم المالية تغطي الاحتيال وغسل الأموال والتحايل على العقوبات باعتبارها مخاطر مترابطة.' },
      { ar: 'أخصائي معتمد في مكافحة الاحتيال (ACAMS – CAFS)', en: 'Certified Anti-Fraud Specialist (ACAMS – CAFS)',
        desc: 'The same ACAMS specialist track offered here for its direct overlap with financial-crime and AML case work.',
        descAr: 'نفس مسار ACAMS المتخصص، مطروح هنا لتقاطعه المباشر مع أعمال مكافحة غسل الأموال والجرائم المالية.' },
      { ar: 'التوعية بغسل الأموال والجرائم السيبرانية (ISC2)', en: 'Money Laundering & Cybercrime Awareness (ISC2)',
        desc: 'Covers how modern laundering schemes increasingly rely on cyber-enabled channels, and what that means for detection teams.',
        descAr: 'يغطي كيف تعتمد أساليب غسل الأموال الحديثة بشكل متزايد على قنوات مرتبطة بالفضاء السيبراني، وتبعات ذلك على فرق الكشف.' },
      { ar: 'ورش FATF لتفسير المبادئ والإرشادات', en: 'FATF Principles & Guidance Interpretation Workshops',
        desc: 'Working sessions that translate FATF\u2019s high-level recommendations into concrete controls an institution can actually implement.',
        descAr: 'جلسات عمل تترجم توصيات مجموعة العمل المالي (FATF) رفيعة المستوى إلى ضوابط ملموسة يمكن للمؤسسة تطبيقها فعليًا.' }
    ]
  },
  {
    titleAr: 'إدارة المشاريع والبرامج والمحافظ',
    titleEn: 'Project, Program & Portfolio Management',
    descriptionAr: 'تمكين المؤسسات من تخطيط وتنفيذ ومتابعة المبادرات الاستراتيجية من خلال أطر عمل عالمية معتمدة ومنهجيات منظمة.',
    descriptionEn: 'Enabling institutions to plan, execute, and track strategic initiatives through accredited global frameworks and structured methodologies.',
    programs: [
      { ar: 'محترف إدارة المشاريع (PMI – PMP)', en: 'Project Management Professional (PMI – PMP)',
        desc: 'Preparation for the globally recognized PMP credential, covering the full project lifecycle from initiation through closure.',
        descAr: 'إعداد للحصول على شهادة PMP المعترف بها عالميًا، ويغطي دورة حياة المشروع الكاملة من البدء حتى الإغلاق.' },
      { ar: 'ماجستير إدارة المشاريع (GAFM – MPM)', en: 'Master of Project Management (GAFM – MPM)',
        desc: 'An advanced, graduate-level program for experienced managers taking on multi-project or program-level responsibility.',
        descAr: 'برنامج متقدم بمستوى دراسات عليا للمدراء ذوي الخبرة المتجهين نحو مسؤوليات متعددة المشاريع أو على مستوى البرامج.' },
      { ar: 'مدير مشروع دولي معتمد (GAFM – CIPM)', en: 'Certified International Project Manager (GAFM – CIPM)',
        desc: 'An internationally oriented project management certification suited to managers running cross-border or multi-country projects.',
        descAr: 'شهادة إدارة مشاريع ذات توجه دولي، مناسبة للمدراء الذين يديرون مشاريع عابرة للحدود أو متعددة الدول.' },
      { ar: 'إدارة المشاريع الرشيقة (Scrum - SAF)', en: 'Agile Project Management (Scrum – SAFe)',
        desc: 'Covers Scrum and the Scaled Agile Framework, for teams delivering iteratively rather than through a single fixed plan.',
        descAr: 'يغطي منهجية Scrum وإطار Scaled Agile (SAFe) للفرق التي تُنجز أعمالها بشكل تكراري بدلاً من خطة ثابتة واحدة.' },
      { ar: 'حوكمة المشاريع ومشاركة أصحاب المصلحة', en: 'Project Governance & Stakeholder Engagement',
        desc: 'Addresses the governance structures and stakeholder-communication practices that determine whether a project stays on track.',
        descAr: 'يتناول هياكل الحوكمة وممارسات التواصل مع أصحاب المصلحة التي تحدد استمرار المشروع على المسار الصحيح.' },
      { ar: 'إعداد مكاتب إدارة المشاريع ونماذج النضج', en: 'PMO Setup & Maturity Models',
        desc: 'A practical guide to standing up a Project Management Office and assessing its maturity against recognized models.',
        descAr: 'دليل عملي لإنشاء مكتب إدارة المشاريع وتقييم مستوى نضجه وفق نماذج معتمدة.' },
      { ar: 'شهادة PRINCE2® (مجموعة ILX)', en: 'PRINCE2® Certification (ILX Group)',
        desc: 'Delivered with ILX Group, this certification covers the PRINCE2 process-based approach widely used across the UK and Europe.',
        descAr: 'شهادة تُقدَّم بالشراكة مع ILX Group، وتغطي منهجية PRINCE2 القائمة على العمليات، المستخدمة على نطاق واسع في المملكة المتحدة وأوروبا.' },
      { ar: 'معامل محاكاة المشاريع وورش دراسات الحالة', en: 'Project Simulation Labs & Case-Study Workshops',
        desc: 'Hands-on simulation labs where participants run a simulated project end to end and work through real case studies.',
        descAr: 'معامل تطبيقية يدير فيها المشاركون مشروعًا افتراضيًا من البداية للنهاية، ويعملون على دراسات حالة واقعية.' }
    ]
  },
  {
    titleAr: 'المالية والمحاسبة والمعاملات التجارية',
    titleEn: 'Finance, Accounting & Commercial Transactions',
    descriptionAr: 'دعم التميز المالي والكفاءة التشغيلية واتخاذ قرارات استثمارية مستنيرة من خلال أدوات رقمية وتحليلية وخبرات عملية.',
    descriptionEn: 'Supporting financial excellence, operational efficiency, and informed investment decisions through digital tools, analytics, and practical expertise.',
    programs: [
      { ar: 'إعداد الميزانية وإدارة التكاليف', en: 'Budgeting & Cost Management',
        desc: 'Covers building a departmental or organizational budget and the cost-control techniques used to keep spending on track.',
        descAr: 'يغطي إعداد الميزانية على مستوى الإدارة أو المؤسسة، وأساليب ضبط التكاليف للحفاظ على الإنفاق ضمن الحدود المخططة.' },
      { ar: 'المحاسبة لغير الماليين', en: 'Accounting for Non-Financial Professionals',
        desc: 'Explains financial statements and core accounting concepts in plain terms for managers outside the finance function.',
        descAr: 'يشرح القوائم المالية والمفاهيم المحاسبية الأساسية بأسلوب مبسّط للمدراء من خارج الإدارة المالية.' },
      { ar: 'معايير التقارير المالية الدولية (IFRS) والتدريب المحلي', en: 'IFRS & Local Reporting Standards Training',
        desc: 'Covers IFRS requirements alongside local reporting standards, and how the two interact in practice.',
        descAr: 'يغطي متطلبات المعايير الدولية لإعداد التقارير المالية (IFRS) إلى جانب المعايير المحلية، وكيفية تعاملهما عمليًا.' },
      { ar: 'تدريب مستخدمي Oracle, SAP (ERP)', en: 'Oracle & SAP (ERP) End-User Training',
        desc: 'Hands-on, end-user level training on performing everyday finance tasks inside Oracle and SAP ERP systems.',
        descAr: 'تدريب عملي على مستوى المستخدم النهائي لأداء المهام المالية اليومية داخل أنظمة تخطيط الموارد Oracle وSAP.' },
      { ar: 'معامل دراسات الجدوى – محاكاة تطبيقية', en: 'Feasibility Study Labs — Applied Simulation',
        desc: 'Participants build a full feasibility study on a simulated project, from market assumptions through to financial projections.',
        descAr: 'يبني المشاركون دراسة جدوى كاملة لمشروع افتراضي، من الافتراضات السوقية وصولاً إلى التوقعات المالية.' },
      { ar: 'استراتيجيات الخزينة المؤسسية والتدفقات النقدية', en: 'Corporate Treasury & Cash Flow Strategies',
        desc: 'Covers cash flow forecasting, working capital management, and treasury strategies for keeping the organization liquid.',
        descAr: 'يغطي توقّع التدفقات النقدية وإدارة رأس المال العامل واستراتيجيات الخزينة للحفاظ على السيولة المؤسسية.' },
      { ar: 'التوعية بالامتثال المالي والرقابة الداخلية', en: 'Financial Compliance & Internal Controls Awareness',
        desc: 'An awareness-level session on the internal financial controls that prevent errors and misuse before they happen.',
        descAr: 'جلسة توعوية حول الضوابط المالية الداخلية التي تمنع الأخطاء وسوء الاستخدام قبل وقوعها.' }
    ]
  },
  {
    titleAr: 'إدارة الموارد البشرية',
    titleEn: 'Human Resources Management',
    descriptionAr: 'تمكين رأس المال البشري من خلال الاستشارات الاستراتيجية، والتقنيات الذكية للموارد البشرية، وبرامج تدريبية عملية وجاهزة للمستقبل.',
    descriptionEn: 'Empowering human capital through strategic consulting, smart HR technologies, and practical, future-ready training programs.',
    programs: [
      { ar: 'مدير موارد بشرية معتمد (GAFM® - CHRM)', en: 'Certified Human Resources Manager (GAFM® – CHRM)',
        desc: 'Prepares HR professionals for a managerial role, covering the full HR function from planning through performance and compliance.',
        descAr: 'يؤهل مختصي الموارد البشرية لدور إداري، ويغطي وظيفة الموارد البشرية كاملة من التخطيط إلى الأداء والامتثال.' },
      { ar: 'إدارة رأس المال البشري الاستراتيجي', en: 'Strategic Human Capital Management',
        desc: 'Positions HR as a strategic partner to leadership, aligning workforce planning directly with business objectives.',
        descAr: 'يضع الموارد البشرية كشريك استراتيجي للقيادة، ويربط تخطيط القوى العاملة مباشرة بأهداف العمل.' },
      { ar: 'جذب المواهب وترويج العلامة الوظيفية', en: 'Talent Attraction & Employer Branding',
        desc: 'Covers building an employer brand that attracts the right candidates and reduces reliance on costly external recruiting.',
        descAr: 'يغطي بناء علامة تجارية للموظفين تجذب المرشحين المناسبين وتقلل الاعتماد على التوظيف الخارجي المكلف.' },
      { ar: 'تقييم الوظائف وأساسيات التدرج', en: 'Job Evaluation & Grading Fundamentals',
        desc: 'Teaches the methodology behind fair, consistent job evaluation and how grading structures are built from it.',
        descAr: 'يعلّم منهجية تقييم الوظائف بعدالة واتساق، وكيفية بناء هياكل التدرج الوظيفي انطلاقًا منها.' },
      { ar: 'أنظمة إدارة الأداء', en: 'Performance Management Systems',
        desc: 'Covers designing a performance management cycle that employees find fair and managers find practical to run.',
        descAr: 'يغطي تصميم دورة إدارة أداء يراها الموظفون عادلة ويجدها المدراء عملية للتطبيق.' },
      { ar: 'تحليلات الموارد البشرية ولوحات القيادة', en: 'HR Analytics & Leadership Dashboards',
        desc: 'Introduces HR analytics and the leadership dashboards that turn workforce data into decisions.',
        descAr: 'يقدّم تحليلات الموارد البشرية ولوحات القيادة التي تحوّل بيانات القوى العاملة إلى قرارات.' },
      { ar: 'مهارات التوظيف والمقابلات', en: 'Recruitment & Interviewing Skills',
        desc: 'Practical interviewing techniques that improve hiring accuracy and reduce bias in candidate selection.',
        descAr: 'أساليب مقابلات عملية تحسّن دقة التوظيف وتقلل التحيّز في اختيار المرشحين.' },
      { ar: 'ثقافة المنظمة وبرامج التفاعل المؤسسي', en: 'Organizational Culture & Employee Engagement Programs',
        desc: 'Covers diagnosing organizational culture and designing engagement programs that actually move the numbers.',
        descAr: 'يغطي تشخيص الثقافة المؤسسية وتصميم برامج تفاعل تُحدث أثرًا فعليًا في المؤشرات.' },
      { ar: 'أساسيات قانون العمل (السعودي / الخليجي)', en: 'Labor Law Fundamentals (Saudi / GCC)',
        desc: 'A practical grounding in Saudi and GCC labor law as it applies to everyday HR decisions.',
        descAr: 'تأسيس عملي في نظام العمل السعودي وأنظمة العمل الخليجية كما تُطبَّق على قرارات الموارد البشرية اليومية.' }
    ]
  },
  {
    titleAr: 'نظم ومعايير الجودة',
    titleEn: 'Quality Management Systems & Standards',
    descriptionAr: 'مساعدة المؤسسات على بناء ثقافة التميز، والامتثال، والتحسين المستمر من خلال أطر الجودة المؤسسية.',
    descriptionEn: 'Helping institutions build a culture of excellence, compliance, and continuous improvement through enterprise quality frameworks.',
    programs: [
      { ar: 'مدقق رئيسي / داخلي ISO 9001:2015', en: 'ISO 9001:2015 Lead / Internal Auditor',
        desc: 'Certifies participants to audit a quality management system against ISO 9001:2015, as lead or internal auditor.',
        descAr: 'يؤهل المشاركين لتدقيق نظام إدارة الجودة وفق معيار ISO 9001:2015، كمدقق رئيسي أو داخلي.' },
      { ar: 'أسس إدارة الجودة الشاملة (TQM)', en: 'Total Quality Management (TQM) Foundations',
        desc: 'Introduces TQM principles — continuous improvement, customer focus, and process thinking — as an organization-wide philosophy.',
        descAr: 'يقدّم مبادئ إدارة الجودة الشاملة — التحسين المستمر والتركيز على العميل والتفكير القائم على العمليات — كفلسفة تشمل المؤسسة كاملة.' },
      { ar: 'ضمان الجودة في البرامج الحكومية', en: 'Quality Assurance in Government Programs',
        desc: 'Applies quality assurance principles specifically to the delivery and oversight of government programs and services.',
        descAr: 'يطبّق مبادئ ضمان الجودة تحديدًا على تنفيذ ومتابعة البرامج والخدمات الحكومية.' },
      { ar: 'ISO 14001 – التوعية بإدارة البيئة', en: 'ISO 14001 — Environmental Management Awareness',
        desc: 'An awareness-level introduction to the ISO 14001 environmental management system and its core requirements.',
        descAr: 'مقدمة توعوية لنظام إدارة البيئة ISO 14001 ومتطلباته الأساسية.' },
      { ar: 'ISO 45001 – التوعية بالصحة والسلامة المهنية', en: 'ISO 45001 — Occupational Health & Safety Awareness',
        desc: 'An awareness-level introduction to the ISO 45001 occupational health and safety management system.',
        descAr: 'مقدمة توعوية لنظام إدارة الصحة والسلامة المهنية ISO 45001.' },
      { ar: 'إدارة الجودة في المؤسسات التعليمية', en: 'Quality Management in Educational Institutions',
        desc: 'Adapts quality management principles to the specific accreditation and outcome requirements of educational institutions.',
        descAr: 'يكيّف مبادئ إدارة الجودة مع متطلبات الاعتماد والنتائج الخاصة بالمؤسسات التعليمية.' },
      { ar: 'بناء مؤشرات الأداء وثقافة التميز', en: 'Building Performance Indicators & a Culture of Excellence',
        desc: 'Covers designing meaningful KPIs and embedding the culture that makes teams actually act on them.',
        descAr: 'يغطي تصميم مؤشرات أداء ذات معنى، وترسيخ الثقافة التي تدفع الفرق للعمل بموجبها فعليًا.' },
      { ar: 'إدارة التغيير وبرامج تنفيذ نظم الجودة', en: 'Change Management & Quality System Implementation',
        desc: 'Addresses the change-management side of rolling out a new quality system — the part that usually determines success or failure.',
        descAr: 'يتناول جانب إدارة التغيير عند تطبيق نظام جودة جديد — وهو الجانب الذي عادة ما يحدد نجاح التطبيق من فشله.' },
      { ar: 'الحزام الأخضر / الحزام الأصفر – مفاهيم Six Sigma', en: 'Green Belt / Yellow Belt — Six Sigma Concepts',
        desc: 'Entry and intermediate Six Sigma levels, teaching data-driven process improvement using the DMAIC method.',
        descAr: 'مستويان مبدئي ومتوسط في منهجية Six Sigma، يعلّمان تحسين العمليات القائم على البيانات باستخدام منهجية DMAIC.' }
    ]
  },
  {
    titleAr: 'إدارة العمليات والتميز التشغيلي',
    titleEn: 'Operations Management & Operational Excellence',
    descriptionAr: 'تبسيط العمليات الداخلية لتحقيق الكفاءة، والفعالية، وتميز الخدمات عبر مختلف القطاعات.',
    descriptionEn: 'Streamlining internal processes to achieve efficiency, effectiveness, and service excellence across sectors.',
    programs: [
      { ar: 'أساسيات إدارة العمليات', en: 'Operations Management Fundamentals',
        desc: 'Core operations management concepts — process flow, capacity, and quality — for anyone new to running an operational function.',
        descAr: 'مفاهيم إدارة العمليات الأساسية — تدفق العمليات والطاقة الاستيعابية والجودة — لكل من هو جديد على إدارة وظيفة تشغيلية.' },
      { ar: 'التحسين المستمر وقيادة فرق العمليات', en: 'Continuous Improvement & Leading Operations Teams',
        desc: 'Combines continuous-improvement techniques with the people-leadership skills needed to sustain them on the floor.',
        descAr: 'يجمع بين أساليب التحسين المستمر ومهارات قيادة الأفراد اللازمة للحفاظ عليها في بيئة العمل الفعلية.' },
      { ar: 'التميز التشغيلي (OPEX)', en: 'Operational Excellence (OPEX)',
        desc: 'A structured approach to operational excellence, building a system for continuously reducing waste and variation.',
        descAr: 'نهج منظم للتميز التشغيلي، يبني نظامًا للتقليل المستمر من الهدر والتباين.' },
      { ar: 'خدمة العملاء وتجربة العميل', en: 'Customer Service & Customer Experience',
        desc: 'Covers the operational side of customer experience — service standards, recovery, and the metrics that track them.',
        descAr: 'يغطي الجانب التشغيلي لتجربة العميل — معايير الخدمة، ومعالجة الأخطاء، والمؤشرات التي تتبعها.' },
      { ar: 'تخطيط العمليات وتصميم رحلة الخدمة', en: 'Process Planning & Service Journey Design',
        desc: 'Teaches mapping a service journey end to end and planning the processes that deliver it reliably.',
        descAr: 'يعلّم رسم رحلة الخدمة من البداية للنهاية، وتخطيط العمليات التي تقدّمها بشكل موثوق.' },
      { ar: 'قياس وتطوير مؤشرات الأداء', en: 'Measuring & Developing Performance Indicators',
        desc: 'Covers choosing operational KPIs that reflect real performance rather than easy-to-collect vanity metrics.',
        descAr: 'يغطي اختيار مؤشرات أداء تشغيلية تعكس الأداء الفعلي بدلاً من مؤشرات سهلة الجمع لكن غير ذات دلالة.' },
      { ar: 'مختبرات الكفاءة - تعلم قائم على المحاكاة', en: 'Competency Labs — Simulation-Based Learning',
        desc: 'Simulation-based labs where participants practice operational decision-making under realistic, time-pressured scenarios.',
        descAr: 'معامل قائمة على المحاكاة يتدرب فيها المشاركون على اتخاذ قرارات تشغيلية ضمن سيناريوهات واقعية وضاغطة زمنيًا.' },
      { ar: 'مخاطر التشغيل في تقديم الخدمات', en: 'Operational Risk in Service Delivery',
        desc: 'Identifies where operational risk hides inside service-delivery processes, and how to build controls around it.',
        descAr: 'يحدد أين تكمن المخاطر التشغيلية داخل عمليات تقديم الخدمة، وكيفية بناء ضوابط حولها.' },
      { ar: 'كتابة السياسات والتواصل الداخلي الفعال', en: 'Policy Writing & Effective Internal Communication',
        desc: 'Practical skills for writing policies people actually read and follow, and communicating operational change clearly.',
        descAr: 'مهارات عملية لكتابة سياسات يقرأها الموظفون ويلتزمون بها فعليًا، ولإيصال التغيير التشغيلي بوضوح.' }
    ]
  },
  {
    titleAr: 'تقنية المعلومات وأمن المعلومات والأمن السيبراني',
    titleEn: 'IT, Information Security & Cybersecurity',
    descriptionAr: 'قيادة التحول الرقمي وتأمين المعلومات من خلال الاستشارات الذكية، وأنظمة المؤسسات، وحلول الأمن السيبراني المتقدمة.',
    descriptionEn: 'Leading digital transformation and information security through smart consulting, enterprise systems, and advanced cybersecurity solutions.',
    programs: [
      { ar: 'وظائف Oracle - الموارد البشرية / المشتريات', en: 'Oracle Functions — HR / Procurement',
        desc: 'Hands-on training on the HR and procurement modules within Oracle, focused on day-to-day end-user tasks.',
        descAr: 'تدريب عملي على وحدتَي الموارد البشرية والمشتريات ضمن نظام Oracle، بتركيز على المهام اليومية للمستخدم النهائي.' },
      { ar: 'Excel متقدم لتحليل البيانات', en: 'Advanced Excel for Data Analysis',
        desc: 'Moves beyond basic formulas into pivot tables, advanced functions, and dashboards for real data analysis work.',
        descAr: 'يتجاوز الصيغ الأساسية إلى الجداول المحورية والدوال المتقدمة ولوحات المعلومات لأعمال تحليل بيانات فعلية.' },
      { ar: 'Power BI لمستخدمي الأعمال', en: 'Power BI for Business Users',
        desc: 'Teaches business users to build their own Power BI dashboards without depending on a dedicated analytics team.',
        descAr: 'يعلّم مستخدمي الأعمال بناء لوحات معلومات Power BI الخاصة بهم دون الاعتماد على فريق تحليلات مخصص.' },
      { ar: 'أساسيات الأمن السيبراني (CC - ISC2)', en: 'Cybersecurity Fundamentals (CC — ISC2)',
        desc: 'An entry-level ISC2 Certified in Cybersecurity (CC) track covering the core concepts every professional should know.',
        descAr: 'مسار تمهيدي لشهادة ISC2 Certified in Cybersecurity (CC)، يغطي المفاهيم الأساسية التي ينبغي أن يعرفها كل مختص.' },
      { ar: 'CISA - مدقق نظم المعلومات المعتمد', en: 'CISA — Certified Information Systems Auditor',
        desc: 'Preparation for the CISA credential, focused on auditing, controlling, and assuring information systems.',
        descAr: 'إعداد للحصول على شهادة CISA، بتركيز على تدقيق نظم المعلومات وضبطها وضمان موثوقيتها.' },
      { ar: 'CCISP - متخصص الأمن السيبراني المعتمد', en: 'CCISP — Certified Cybersecurity Specialist',
        desc: 'A specialist-level cybersecurity certification covering threat detection, incident response, and defensive architecture.',
        descAr: 'شهادة تخصصية في الأمن السيبراني تغطي كشف التهديدات، والاستجابة للحوادث، والبنية الدفاعية.' },
      { ar: 'التحول الرقمي المعتمد (GAFM® – CDTO)', en: 'Certified Digital Transformation Officer (GAFM® – CDTO)',
        desc: 'Prepares professionals to lead digital-transformation initiatives, from strategy and roadmap through execution.',
        descAr: 'يؤهل المختصين لقيادة مبادرات التحول الرقمي، من الاستراتيجية وخارطة الطريق وصولاً إلى التنفيذ.' },
      { ar: 'التوعية بالحوسبة السحابية وSaaS', en: 'Cloud Computing & SaaS Awareness',
        desc: 'An awareness-level introduction to cloud computing models and the specific risks and benefits of SaaS adoption.',
        descAr: 'مقدمة توعوية لنماذج الحوسبة السحابية، والمخاطر والفوائد الخاصة باعتماد نموذج SaaS.' },
      { ar: 'حوكمة تقنية المعلومات لغير المختصين', en: 'IT Governance for Non-Specialists',
        desc: 'Explains IT governance concepts in plain terms for non-technical managers who need to make informed IT decisions.',
        descAr: 'يشرح مفاهيم حوكمة تقنية المعلومات بأسلوب مبسّط للمدراء غير التقنيين الذين يحتاجون لاتخاذ قرارات تقنية مدروسة.' }
    ]
  }
];

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  const instructor = await prisma.user.upsert({
    where: { nationalId: '1000000099' },
    update: {},
    create: {
      nationalId: '1000000099',
      name: 'Mada Alhyat Training Team',
      passwordHash,
      role: 'TRAINER'
    }
  });

  let created = 0, skipped = 0;

  for (const axis of AXES) {
    for (const program of axis.programs) {
      const existing = await prisma.course.findFirst({ where: { title: program.en } });
      if (existing) { skipped++; continue; }

      await prisma.course.create({
        data: {
          title: program.en,
          titleAr: program.ar,
          category: axis.titleAr, // kept in Arabic — see schema.prisma note on category/categoryEn
          categoryEn: axis.titleEn,
          description: program.desc || `${axis.descriptionEn} (${program.en})`,
          descriptionAr: program.descAr || `${axis.descriptionAr} (${program.ar})`,
          price: PLACEHOLDER_PRICE,
          instructorId: instructor.id,
          modules: {
            create: [
              {
                title: 'Overview',
                titleAr: 'نظرة عامة',
                order: 1,
                lessons: {
                  create: [
                    {
                      title: 'Program introduction (placeholder — add real lessons and video)',
                      titleAr: 'مقدمة البرنامج (نص مؤقت — أضيفوا دروسًا وفيديو حقيقيين)',
                      order: 1,
                      durationSeconds: 600
                    }
                  ]
                }
              }
            ]
          }
        }
      });
      created++;
    }
  }

  console.log(`Done. Created ${created} courses across ${AXES.length} axes (${skipped} already existed and were skipped).`);
  console.log('Every course was created with a placeholder price of 1 SAR and a single placeholder lesson.');
  console.log('Open admin.html, log in as the trainer below, and for each course: set a real price, build out real modules/lessons, and upload real video.');
  console.log('  Trainer login: nationalId=1000000099  password=ChangeMe123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
