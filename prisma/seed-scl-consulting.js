// Populates ConsultingService records from the same company profile PDF
// used for prisma/seed-scl-catalog.js — specifically the "الخدمات
// الاستشارية (SCL)" column for each of the 10 axes, which lists real
// consulting engagements (distinct from the "البرامج التدريبية" column
// already imported as Courses).
//
// REAL: every service's title (English + exact Arabic from the PDF) and
// its axis/category, taken directly from the document.
// NOT imported: the document's "الحلول التقنية / نظم المعلومات" column
// (technology/software solutions) is a third, separate business line —
// say if you'd like that imported too, as a distinct model.
//
// Run with: npm run seed:consulting

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const AXES = [
  {
    titleAr: 'مكافحة الاحتيال والتحقيقات', titleEn: 'Fraud Prevention & Investigations',
    services: [
      { ar: 'تقييم مخاطر الاحتيال وتحليل فجوات الرقابة', en: 'Fraud Risk Assessment & Control Gap Analysis',
        desc: 'An engagement that maps where fraud risk actually sits in your processes and identifies the control gaps that leave it exposed.',
        descAr: 'مشروع استشاري يحدد أين تكمن مخاطر الاحتيال فعليًا في عملياتكم، ويكشف فجوات الرقابة التي تتركها معرَّضة.' },
      { ar: 'التحقيق في الاحتيال والسلوكيات غير المشروعة (داخلي وخارجي)', en: 'Fraud & Misconduct Investigations (Internal & External)',
        desc: 'End-to-end investigation of a suspected fraud or misconduct case, internal or involving external parties, with documented findings.',
        descAr: 'تحقيق شامل في حالة اشتباه بالاحتيال أو سلوك غير مشروع، داخليًا أو بمشاركة أطراف خارجية، مع نتائج موثّقة.' },
      { ar: 'إعداد برنامج المبلغين عن المخالفات وبروتوكولات الإبلاغ', en: 'Whistleblower Program & Reporting Protocol Design',
        desc: 'Designs a whistleblower channel and reporting protocol that employees actually trust enough to use.',
        descAr: 'تصميم قناة للمبلغين عن المخالفات وبروتوكول إبلاغ يثق به الموظفون بما يكفي لاستخدامه فعليًا.' },
      { ar: 'العناية الواجبة بطرف ثالث (الموردين والمقاولين)', en: 'Third-Party Due Diligence (Vendors & Contractors)',
        desc: 'Vets vendors and contractors before onboarding to catch fraud and integrity red flags before they become your problem.',
        descAr: 'فحص الموردين والمقاولين قبل التعاقد معهم لرصد مؤشرات الاحتيال والنزاهة قبل أن تتحول إلى مشكلة عليكم.' },
      { ar: 'تطوير سياسات مكافحة الاحتيال وبرامج أخلاقيات الموظفين', en: 'Anti-Fraud Policy & Employee Ethics Program Development',
        desc: 'Builds the anti-fraud policy and employee ethics program your organization is currently missing or has outgrown.',
        descAr: 'بناء سياسة مكافحة الاحتيال وبرنامج أخلاقيات الموظفين الذي تفتقر إليه مؤسستكم حاليًا أو الذي لم يعد كافيًا لحجمها.' },
      { ar: 'اختبار الرقابة الداخلية ودعم تدقيق الطب الشرعي', en: 'Internal Control Testing & Forensic Audit Support',
        desc: 'Tests whether existing internal controls actually work, and supports a forensic audit when something has gone wrong.',
        descAr: 'اختبار ما إذا كانت الضوابط الداخلية الحالية فعّالة فعليًا، ودعم التدقيق الجنائي عند حدوث خلل ما.' },
      { ar: 'الدعم في الدعاوى القضائية وتوثيق قضايا الاحتيال', en: 'Litigation Support & Fraud Case Documentation',
        desc: 'Provides expert documentation and support for a fraud case heading toward legal action.',
        descAr: 'يقدّم توثيقًا ودعمًا احترافيًا لقضية احتيال متجهة نحو إجراء قانوني.' }
    ]
  },
  {
    titleAr: 'إدارة المخاطر والامتثال', titleEn: 'Risk & Compliance Management',
    services: [
      { ar: 'تقييم الحوكمة وتصميم أطر العمل', en: 'Governance Assessment & Framework Design',
        desc: 'Assesses your current governance structure and designs the framework needed to close what is missing.',
        descAr: 'تقييم بنية الحوكمة الحالية لديكم وتصميم الإطار اللازم لسد ما هو ناقص فيها.' },
      { ar: 'تقييمات مخاطر مؤسسية شاملة (ISO 31000, COSO)', en: 'Comprehensive Enterprise Risk Assessments (ISO 31000, COSO)',
        desc: 'A full enterprise risk assessment run against the ISO 31000 and COSO frameworks, covering the organization end to end.',
        descAr: 'تقييم شامل للمخاطر المؤسسية وفق إطاري ISO 31000 وCOSO، يغطي المؤسسة من البداية للنهاية.' },
      { ar: 'إعداد نظام التدقيق الداخلي وتحويله', en: 'Internal Audit System Setup & Transformation',
        desc: 'Sets up an internal audit function from scratch, or transforms an existing one that is not delivering value.',
        descAr: 'إنشاء وظيفة تدقيق داخلي من الصفر، أو تحويل وظيفة قائمة لا تحقق القيمة المرجوة.' },
      { ar: 'تقييم نضج إدارة المخاطر', en: 'Risk Management Maturity Assessment',
        desc: 'Benchmarks your risk management practices against a recognized maturity model and identifies the next step up.',
        descAr: 'قياس ممارسات إدارة المخاطر لديكم مقابل نموذج نضج معتمد، وتحديد الخطوة التالية للارتقاء بها.' },
      { ar: 'تطوير سجل مخاطر استراتيجي (ERM-FRM، التزام)', en: 'Strategic Risk Register Development (ERM-FRM, Compliance)',
        desc: 'Builds a strategic-level risk register linking enterprise risk, financial risk, and compliance obligations in one place.',
        descAr: 'بناء سجل مخاطر استراتيجي يربط المخاطر المؤسسية والمالية والتزامات الامتثال في مكان واحد.' },
      { ar: 'أطر تحمل المخاطر والتسامح', en: 'Risk Appetite & Tolerance Frameworks',
        desc: 'Defines how much risk your organization is actually willing to accept, and sets thresholds leadership can act on.',
        descAr: 'تحديد مستوى المخاطر الذي تقبله مؤسستكم فعليًا، ووضع حدود يمكن للقيادة اتخاذ إجراء بناءً عليها.' },
      { ar: 'تحليل فجوات الامتثال التنظيمي', en: 'Regulatory Compliance Gap Analysis',
        desc: 'Compares current practice against applicable regulations and produces a prioritized remediation plan.',
        descAr: 'مقارنة الممارسات الحالية بالأنظمة المعمول بها، وإعداد خطة معالجة مرتبة حسب الأولوية.' }
    ]
  },
  {
    titleAr: 'مكافحة الفساد والحوكمة الأخلاقية', titleEn: 'Anti-Corruption & Ethical Governance',
    services: [
      { ar: 'تقييم مخاطر الفساد وتحليل التعرض', en: 'Corruption Risk Assessment & Exposure Analysis',
        desc: 'Identifies where your organization is most exposed to corruption risk and how severe that exposure actually is.',
        descAr: 'تحديد أين تتعرض مؤسستكم لمخاطر الفساد بشكل أكبر، ومدى خطورة هذا التعرض فعليًا.' },
      { ar: 'تصميم سياسات مكافحة الرشوة ومدونات السلوك', en: 'Anti-Bribery Policy & Code of Conduct Design',
        desc: 'Drafts an anti-bribery policy and code of conduct tailored to your sector and operating footprint.',
        descAr: 'صياغة سياسة مكافحة الرشوة ومدونة السلوك بما يتناسب مع قطاعكم ونطاق عملكم.' },
      { ar: 'سياسات تعارض المصالح وأطر الحوكمة', en: 'Conflict-of-Interest Policies & Governance Frameworks',
        desc: 'Builds the conflict-of-interest policy and disclosure process that protects both the organization and its people.',
        descAr: 'بناء سياسة تعارض المصالح وإجراء الإفصاح الذي يحمي المؤسسة وأفرادها معًا.' },
      { ar: 'تطوير لجان الأخلاقيات وبروتوكولات الرقابة', en: 'Ethics Committee Development & Oversight Protocols',
        desc: 'Stands up an ethics committee with clear oversight protocols and decision-making authority.',
        descAr: 'إنشاء لجنة أخلاقيات ببروتوكولات رقابة واضحة وصلاحيات قرار محددة.' },
      { ar: 'تقييم الفجوات القانونية في مكافحة الفساد', en: 'Legal Gap Assessment in Anti-Corruption',
        desc: 'Reviews current anti-corruption practice against applicable law and flags the gaps that create legal exposure.',
        descAr: 'مراجعة ممارسات مكافحة الفساد الحالية مقابل الأنظمة المعمول بها، وتحديد الفجوات التي تشكّل تعرّضًا قانونيًا.' },
      { ar: 'سياسات الإبلاغ الداخلي والإجراءات التصعيدية', en: 'Internal Reporting Policies & Escalation Procedures',
        desc: 'Defines how a corruption concern should be reported internally and escalated through the right channels.',
        descAr: 'تحديد كيفية الإبلاغ الداخلي عن شبهة فساد وتصعيدها عبر القنوات الصحيحة.' },
      { ar: 'التكامل مع برامج GRC (الحوكمة والمخاطر والامتثال)', en: 'Integration with GRC Programs',
        desc: 'Integrates anti-corruption controls into your broader governance, risk, and compliance program instead of running them separately.',
        descAr: 'دمج ضوابط مكافحة الفساد ضمن برنامج الحوكمة والمخاطر والامتثال الأوسع لديكم بدلاً من إدارتها بمعزل عنه.' },
      { ar: 'الحملات التوعوية والاستشارات الثقافية للامتثال', en: 'Awareness Campaigns & Compliance Culture Consulting',
        desc: 'Designs internal awareness campaigns that shift how employees actually think about compliance, not just what they sign.',
        descAr: 'تصميم حملات توعية داخلية تُغيّر نظرة الموظفين الفعلية للامتثال، وليس فقط ما يوقّعون عليه.' }
    ]
  },
  {
    titleAr: 'مكافحة غسل الأموال والجرائم المالية', titleEn: 'Anti-Money Laundering & Financial Crime (AML/CFT)',
    services: [
      { ar: 'تحليل فجوات تقييم مخاطر غسل الأموال وتمويل الإرهاب', en: 'AML/CFT Risk Assessment Gap Analysis',
        desc: 'Reviews your current AML/CFT risk assessment against regulatory expectations and identifies what is missing.',
        descAr: 'مراجعة تقييم مخاطر غسل الأموال وتمويل الإرهاب الحالي لديكم مقابل التوقعات الرقابية، وتحديد ما هو ناقص.' },
      { ar: 'تصميم السياسات والإجراءات الخاصة بـ AML/CFT', en: 'AML/CFT Policy & Procedure Design',
        desc: 'Drafts the AML/CFT policies and procedures your compliance function needs to operate on day one.',
        descAr: 'صياغة سياسات وإجراءات مكافحة غسل الأموال وتمويل الإرهاب التي تحتاجها وظيفة الامتثال للعمل من اليوم الأول.' },
      { ar: 'تدقيق داخلي وفحص الصحة التنظيمية لأنظمة AML', en: 'Internal Audit & Regulatory Health Check of AML Systems',
        desc: 'An independent health check of your AML systems and controls before a regulator does it for you.',
        descAr: 'فحص مستقل لسلامة أنظمة وضوابط مكافحة غسل الأموال لديكم قبل أن تقوم الجهة الرقابية بذلك نيابة عنكم.' },
      { ar: 'إنشاء أطر حوكمة AML/CFT ودعم الفحوصات', en: 'AML/CFT Governance Framework Setup & Examination Support',
        desc: 'Builds AML/CFT governance structure and provides direct support during a regulatory examination.',
        descAr: 'بناء بنية حوكمة لمكافحة غسل الأموال وتمويل الإرهاب، وتقديم دعم مباشر أثناء الفحص الرقابي.' },
      { ar: 'دعم الفحص والاستعداد الرقابي', en: 'Regulatory Examination Readiness Support',
        desc: 'Prepares your team and documentation ahead of a scheduled regulatory examination.',
        descAr: 'إعداد الفريق والمستندات قبل موعد الفحص الرقابي المقرر.' },
      { ar: 'مصفوفة مخاطر AML وتصميم مؤشرات KRIs', en: 'AML Risk Matrix & KRI Design',
        desc: 'Builds an AML risk matrix and the key risk indicators that give early warning before an issue escalates.',
        descAr: 'بناء مصفوفة مخاطر لمكافحة غسل الأموال ومؤشرات المخاطر الرئيسية التي تنذر مبكرًا قبل تفاقم المشكلة.' },
      { ar: 'تصميم واختبار الرقابة الداخلية (CDD, EDD, STR)', en: 'Internal Control Design & Testing (CDD, EDD, STR)',
        desc: 'Designs and tests the customer due diligence, enhanced due diligence, and suspicious transaction reporting controls.',
        descAr: 'تصميم واختبار ضوابط التحقق من العملاء، والتحقق المعزز، والإبلاغ عن المعاملات المشبوهة.' },
      { ar: 'العناية الواجبة بالبائعين والأطراف الثالثة في AML', en: 'AML Vendor & Third-Party Due Diligence',
        desc: 'Screens vendors and third parties for AML risk exposure before they are onboarded into your supply chain.',
        descAr: 'فحص الموردين والأطراف الثالثة من ناحية مخاطر غسل الأموال قبل إدراجهم ضمن سلسلة التوريد.' }
    ]
  },
  {
    titleAr: 'إدارة المشاريع والبرامج والمحافظ', titleEn: 'Project, Program & Portfolio Management',
    services: [
      { ar: 'تصميم مكتب إدارة المشاريع وتقييم النضج', en: 'PMO Design & Maturity Assessment',
        desc: 'Designs a PMO structure fit for your organization size and assesses how mature your current project practice is.',
        descAr: 'تصميم بنية مكتب إدارة مشاريع يناسب حجم مؤسستكم، وتقييم مستوى نضج ممارسات المشاريع الحالية.' },
      { ar: 'أطر الحوكمة للمشاريع والبرامج', en: 'Project & Program Governance Frameworks',
        desc: 'Builds the decision rights and escalation structure that keeps multiple projects accountable to one governance model.',
        descAr: 'بناء هيكل صلاحيات القرار والتصعيد الذي يُخضع مشاريع متعددة لنموذج حوكمة واحد.' },
      { ar: 'مواءمة استراتيجية المشاريع وتحليل القيمة', en: 'Project Strategy Alignment & Value Analysis',
        desc: 'Checks whether your project portfolio is actually delivering on strategic objectives, and where it is not.',
        descAr: 'فحص ما إذا كانت محفظة مشاريعكم تحقق فعليًا الأهداف الاستراتيجية، وأين لا تحققها.' },
      { ar: 'تخطيط وتحسين دورة حياة المشروع', en: 'Project Lifecycle Planning & Optimization',
        desc: 'Reviews and streamlines the project lifecycle stages that are currently slowing delivery down.',
        descAr: 'مراجعة وتبسيط مراحل دورة حياة المشروع التي تُبطئ التسليم حاليًا.' },
      { ar: 'نماذج أولويات المحافظ (القيمة مقابل المخاطر)', en: 'Portfolio Prioritization Models (Value vs. Risk)',
        desc: 'Builds a value-versus-risk model for deciding which projects in the portfolio deserve funding first.',
        descAr: 'بناء نموذج قيمة مقابل مخاطر لتحديد أي مشاريع المحفظة تستحق التمويل أولاً.' },
      { ar: 'استشارات تخصيص الموارد والميزانيات', en: 'Resource & Budget Allocation Consulting',
        desc: 'Advises on allocating limited resources and budget across competing project demands.',
        descAr: 'تقديم استشارة حول توزيع الموارد والميزانية المحدودة على مطالب مشاريع متنافسة.' },
      { ar: 'مراجعة أداء المشاريع وخطط الاسترداد', en: 'Project Performance Review & Recovery Planning',
        desc: 'Diagnoses a struggling project and builds a concrete recovery plan to get it back on track.',
        descAr: 'تشخيص مشروع متعثر وبناء خطة استرداد ملموسة لإعادته إلى مساره الصحيح.' },
      { ar: 'الالتزام الرقابي لمشاريع الجهات الحكومية (مرتبطة برؤية 2030)', en: 'Regulatory Compliance for Government Projects (Vision 2030 aligned)',
        desc: 'Ensures a government-sector project meets the regulatory and reporting requirements tied to Vision 2030 alignment.',
        descAr: 'التأكد من أن مشروعًا في القطاع الحكومي يستوفي المتطلبات الرقابية والتقارير المرتبطة بالتوافق مع رؤية 2030.' }
    ]
  },
  {
    titleAr: 'المالية والمحاسبة والمعاملات التجارية', titleEn: 'Finance, Accounting & Commercial Transactions',
    services: [
      { ar: 'دراسات الجدوى المالية والتشغيلية', en: 'Financial & Operational Feasibility Studies',
        desc: 'Produces a full feasibility study covering both the financial case and the operational reality of a proposed initiative.',
        descAr: 'إعداد دراسة جدوى كاملة تغطي الجانب المالي والواقع التشغيلي لمبادرة مقترحة.' },
      { ar: 'إعداد الميزانيات، التنبؤ، واستشارات مراقبة التكاليف', en: 'Budgeting, Forecasting & Cost Control Consulting',
        desc: 'Hands-on support building a realistic budget, forecast, and the cost controls to keep both on track.',
        descAr: 'دعم عملي لبناء ميزانية وتوقعات مالية واقعية، وضوابط التكلفة اللازمة لضبطها.' },
      { ar: 'دراسات تقييم الاستثمار والعائد (ROI)', en: 'Investment Valuation & ROI Studies',
        desc: 'Evaluates a proposed investment and models the expected return before capital is committed.',
        descAr: 'تقييم استثمار مقترح ونمذجة العائد المتوقع قبل الالتزام برأس المال.' },
      { ar: 'إدارة التدفق النقدي واستراتيجيات رأس المال العامل', en: 'Cash Flow Management & Working Capital Strategies',
        desc: 'Improves cash flow visibility and designs working-capital strategies to keep the organization liquid.',
        descAr: 'تحسين الرؤية على التدفق النقدي وتصميم استراتيجيات رأس المال العامل للحفاظ على السيولة المؤسسية.' },
      { ar: 'العناية الواجبة المالية وتقييم الأعمال', en: 'Financial Due Diligence & Business Valuation',
        desc: 'Conducts financial due diligence and business valuation ahead of an investment, acquisition, or partnership.',
        descAr: 'إجراء العناية المالية الواجبة وتقييم الأعمال قبل استثمار أو استحواذ أو شراكة.' },
      { ar: 'تصميم دليل الحسابات والهيكل المحاسبي', en: 'Chart of Accounts & Accounting Structure Design',
        desc: 'Designs or rebuilds a chart of accounts and accounting structure that actually fits how the business operates.',
        descAr: 'تصميم أو إعادة بناء دليل الحسابات والهيكل المحاسبي بما يتناسب فعليًا مع طريقة عمل المؤسسة.' },
      { ar: 'تطوير حالات العمل للمشاريع العامة والخاصة', en: 'Business Case Development for Public & Private Projects',
        desc: 'Builds the business case that gets a public or private-sector project approved and funded.',
        descAr: 'إعداد دراسة الجدوى التجارية التي تحصل بموجبها مبادرة في القطاع العام أو الخاص على الموافقة والتمويل.' },
      { ar: 'دعم الاندماجات والاستحواذ بعد التنفيذ', en: 'Post-Merger & Acquisition Integration Support',
        desc: 'Supports the integration work after a merger or acquisition closes, where most of the real risk actually lives.',
        descAr: 'دعم أعمال الدمج بعد إتمام صفقة اندماج أو استحواذ، حيث تكمن معظم المخاطر الفعلية.' },
      { ar: 'هيكلة نماذج الأعمال وتدفقات الإيرادات', en: 'Business Model & Revenue Stream Structuring',
        desc: 'Reworks a business model and its revenue streams to fit a changing market or growth stage.',
        descAr: 'إعادة صياغة نموذج العمل وتدفقات الإيرادات ليتناسب مع سوق متغير أو مرحلة نمو جديدة.' }
    ]
  },
  {
    titleAr: 'إدارة الموارد البشرية', titleEn: 'Human Resources Management',
    services: [
      { ar: 'التخطيط الاستراتيجي للقوى العاملة', en: 'Strategic Workforce Planning',
        desc: 'Models future headcount and skill needs against business strategy so hiring plans stop being reactive.',
        descAr: 'نمذجة احتياجات القوى العاملة والمهارات المستقبلية وفق استراتيجية العمل بحيث تتوقف خطط التوظيف عن كونها ردة فعل.' },
      { ar: 'أطر إدارة المواهب والتخطيط للتعاقب الوظيفي', en: 'Talent Management & Succession Planning Frameworks',
        desc: 'Builds a talent-management framework and succession plan for your critical roles before a gap becomes urgent.',
        descAr: 'بناء إطار لإدارة المواهب وخطة تعاقب وظيفي للأدوار الحرجة قبل أن تتحول أي فجوة إلى أزمة عاجلة.' },
      { ar: 'تطوير أدلة السياسات والإجراءات', en: 'Policy & Procedure Manual Development',
        desc: 'Drafts the HR policy and procedure manual your organization is currently missing or has outgrown.',
        descAr: 'صياغة دليل سياسات وإجراءات الموارد البشرية الذي تفتقر إليه مؤسستكم أو الذي لم يعد كافيًا لحجمها.' },
      { ar: 'تحليل الوظائف، والوصف الوظيفي، ونظم التدرج الوظيفي', en: 'Job Analysis, Descriptions & Grading Systems',
        desc: 'Produces accurate job descriptions and a grading system built on real job-analysis data, not guesswork.',
        descAr: 'إعداد أوصاف وظيفية دقيقة ونظام تدرج وظيفي مبني على بيانات تحليل وظيفي حقيقية وليس تخمينًا.' },
      { ar: 'تصميم الهيكل التنظيمي وتحسينه', en: 'Organizational Structure Design & Optimization',
        desc: 'Redesigns an organizational structure that has outgrown its original shape and now slows decisions down.',
        descAr: 'إعادة تصميم هيكل تنظيمي تجاوز شكله الأصلي وأصبح يُبطئ اتخاذ القرار.' },
      { ar: 'تحسين عمليات التوظيف والتأهيل', en: 'Recruitment & Onboarding Process Improvement',
        desc: 'Streamlines the hiring and onboarding process to cut time-to-productivity for new employees.',
        descAr: 'تبسيط عملية التوظيف والتأهيل لتقليل الوقت اللازم ليصبح الموظف الجديد منتجًا.' },
      { ar: 'إدارة التغيير في التحول الرقمي للموارد البشرية', en: 'Change Management for HR Digital Transformation',
        desc: 'Manages the people side of rolling out new HR systems, which usually determines whether the rollout actually sticks.',
        descAr: 'إدارة الجانب البشري عند تطبيق أنظمة موارد بشرية جديدة، وهو ما يحدد عادة نجاح التطبيق من استمراريته.' },
      { ar: 'مراجعة التدقيق والتزام الموارد البشرية', en: 'HR Audit & Compliance Review',
        desc: 'Audits HR practice against labor law and internal policy to catch compliance exposure before it becomes a dispute.',
        descAr: 'تدقيق ممارسات الموارد البشرية مقابل نظام العمل والسياسات الداخلية لرصد أي تعرّض قبل تحوله إلى نزاع.' },
      { ar: 'نماذج الكفاءات ومسارات التطور المهني', en: 'Competency Models & Career Development Pathways',
        desc: 'Builds competency models and clear career pathways that give employees a real reason to grow with you.',
        descAr: 'بناء نماذج كفاءات ومسارات تطور مهني واضحة تمنح الموظفين سببًا حقيقيًا للنمو معكم.' }
    ]
  },
  {
    titleAr: 'نظم ومعايير الجودة', titleEn: 'Quality Management Systems & Standards',
    services: [
      { ar: 'تقييم الفجوات وفق ISO 9001, 14001, 45001', en: 'Gap Assessment against ISO 9001, 14001, 45001',
        desc: 'Assesses current practice against ISO 9001, 14001, and 45001 and produces a certification-readiness gap report.',
        descAr: 'تقييم الممارسات الحالية مقابل معايير ISO 9001 و14001 و45001، وإعداد تقرير فجوات للاستعداد للاعتماد.' },
      { ar: 'تطوير أدلة الجودة والإجراءات التشغيلية', en: 'Quality Manuals & Operating Procedures Development',
        desc: 'Writes the quality manual and operating procedures that back up your quality management system.',
        descAr: 'صياغة دليل الجودة والإجراءات التشغيلية التي يستند إليها نظام إدارة الجودة لديكم.' },
      { ar: 'أطر التدقيق الداخلي للجودة', en: 'Internal Quality Audit Frameworks',
        desc: 'Builds an internal quality audit framework so nonconformities are caught before an external auditor finds them.',
        descAr: 'بناء إطار تدقيق جودة داخلي بحيث تُكتشف حالات عدم المطابقة قبل أن يرصدها مدقق خارجي.' },
      { ar: 'إعداد مؤشرات الأداء والجودة ولوحات القيادة', en: 'Quality KPI & Leadership Dashboard Development',
        desc: 'Designs quality KPIs and a leadership dashboard that surfaces problems while they are still small.',
        descAr: 'تصميم مؤشرات أداء للجودة ولوحة قيادة تُظهر المشكلات وهي لا تزال صغيرة.' },
      { ar: 'استشارات الاستعداد لشهادات الجودة', en: 'Quality Certification Readiness Consulting',
        desc: 'Prepares your organization end to end for a quality certification audit, from documentation to staff readiness.',
        descAr: 'إعداد مؤسستكم بالكامل لتدقيق شهادة الجودة، من التوثيق إلى جاهزية الموظفين.' },
      { ar: 'بناء ثقافة الجودة والتوعية المؤسسية', en: 'Quality Culture Building & Organizational Awareness',
        desc: 'Works on the cultural side of quality — getting staff to see quality as their job, not the quality department\u2019s.',
        descAr: 'يعمل على الجانب الثقافي للجودة — بحيث يرى الموظفون الجودة كمسؤوليتهم وليس مسؤولية إدارة الجودة وحدها.' },
      { ar: 'دعم العلاقة بين المدققين والمؤسسات', en: 'Auditor–Organization Relationship Support',
        desc: 'Supports the working relationship between your organization and external auditors through the certification cycle.',
        descAr: 'دعم العلاقة العملية بين مؤسستكم والمدققين الخارجيين طوال دورة الاعتماد.' },
      { ar: 'توحيد الإجراءات والتحسين المستمر', en: 'Procedure Standardization & Continuous Improvement',
        desc: 'Standardizes procedures across departments and embeds a continuous-improvement cycle around them.',
        descAr: 'توحيد الإجراءات عبر الإدارات المختلفة، وترسيخ دورة تحسين مستمر حولها.' },
      { ar: 'دعم برامج الجوائز الوطنية للجودة (مثل جائزة الملك عبدالعزيز)', en: 'National Quality Award Support (e.g. King Abdulaziz Quality Award)',
        desc: 'Supports an application to a national quality award program, including self-assessment and submission preparation.',
        descAr: 'دعم التقديم لبرنامج جائزة وطنية للجودة، بما يشمل التقييم الذاتي وإعداد ملف التقديم.' }
    ]
  },
  {
    titleAr: 'إدارة العمليات والتميز التشغيلي', titleEn: 'Operations Management & Operational Excellence',
    services: [
      { ar: 'إعادة هندسة العمليات (BPR)', en: 'Business Process Reengineering (BPR)',
        desc: 'Redesigns a core business process from the ground up instead of patching an outdated one.',
        descAr: 'إعادة تصميم عملية عمل جوهرية من الأساس بدلاً من ترقيع عملية قديمة.' },
      { ar: 'تحسين كفاءة تقديم الخدمات', en: 'Service Delivery Efficiency Improvement',
        desc: 'Finds and removes the friction points slowing down how a service actually gets delivered.',
        descAr: 'تحديد نقاط الاحتكاك التي تُبطئ تقديم الخدمة فعليًا، والعمل على إزالتها.' },
      { ar: 'تصميم السياسات وتوثيق الإجراءات', en: 'Policy Design & Procedure Documentation',
        desc: 'Documents the operating procedures that currently exist only in people\u2019s heads.',
        descAr: 'توثيق الإجراءات التشغيلية التي لا تزال موجودة فقط في أذهان الموظفين.' },
      { ar: 'تشخيص الأداء وتحليل الأسباب الجذرية', en: 'Performance Diagnostics & Root-Cause Analysis',
        desc: 'Diagnoses a recurring operational problem down to its actual root cause, not just its symptoms.',
        descAr: 'تشخيص مشكلة تشغيلية متكررة للوصول إلى سببها الجذري الفعلي، وليس أعراضها فقط.' },
      { ar: 'تحليل واستغلال الموارد وتحسينها', en: 'Resource Utilization Analysis & Optimization',
        desc: 'Analyzes how resources are actually being used and identifies where capacity is going to waste.',
        descAr: 'تحليل كيفية استخدام الموارد فعليًا، وتحديد أين تُهدر الطاقة الاستيعابية.' },
      { ar: 'هيكلة اتفاقيات الخدمة والأطر التعاقدية', en: 'Service Agreement & Contractual Framework Structuring',
        desc: 'Structures service level agreements and contractual frameworks that are clear enough to actually enforce.',
        descAr: 'هيكلة اتفاقيات مستوى الخدمة والأطر التعاقدية بوضوح كافٍ لتطبيقها فعليًا.' },
      { ar: 'تصميم وتقييم نماذج التشغيل', en: 'Operating Model Design & Evaluation',
        desc: 'Designs or evaluates the operating model that determines how work actually flows through the organization.',
        descAr: 'تصميم أو تقييم نموذج التشغيل الذي يحدد كيفية تدفق العمل فعليًا داخل المؤسسة.' },
      { ar: 'استمرارية الأعمال وإدارة مخاطر التشغيل', en: 'Business Continuity & Operational Risk Management',
        desc: 'Builds a business continuity plan and the operational risk controls that keep the organization running through disruption.',
        descAr: 'بناء خطة استمرارية أعمال وضوابط مخاطر تشغيلية تحافظ على استمرار المؤسسة خلال أي اضطراب.' },
      { ar: 'تحول خدمات القطاع العام', en: 'Public Sector Service Transformation',
        desc: 'Supports a public-sector entity redesigning how it delivers services to citizens or other agencies.',
        descAr: 'دعم جهة حكومية في إعادة تصميم كيفية تقديمها للخدمات للمواطنين أو الجهات الأخرى.' }
    ]
  },
  {
    titleAr: 'تقنية المعلومات وأمن المعلومات والأمن السيبراني', titleEn: 'IT, Information Security & Cybersecurity',
    services: [
      { ar: 'استراتيجية التحول الرقمي وتصميم خارطة الطريق', en: 'Digital Transformation Strategy & Roadmap Design',
        desc: 'Builds a digital transformation strategy and a realistic roadmap for getting there in phases.',
        descAr: 'بناء استراتيجية تحول رقمي وخارطة طريق واقعية لتحقيقها على مراحل.' },
      { ar: 'الحوكمة وأطر الرقابة التقنية (مثل COBIT, NIST)', en: 'IT Governance & Control Frameworks (COBIT, NIST)',
        desc: 'Implements IT governance controls based on COBIT and NIST, adapted to your organization\u2019s actual scale.',
        descAr: 'تطبيق ضوابط حوكمة تقنية المعلومات وفق إطاري COBIT وNIST، بما يتناسب مع حجم مؤسستكم فعليًا.' },
      { ar: 'تقييم المخاطر وتدقيق أمن المعلومات', en: 'Information Security Risk Assessment & Audit',
        desc: 'Assesses information-security risk across your systems and audits current controls against it.',
        descAr: 'تقييم مخاطر أمن المعلومات عبر أنظمتكم، وتدقيق الضوابط الحالية في مواجهتها.' },
      { ar: 'اختبار الاختراق والتقييمات الفنية', en: 'Penetration Testing & Technical Assessments',
        desc: 'Runs controlled penetration testing to find exploitable weaknesses before a real attacker does.',
        descAr: 'إجراء اختبار اختراق مُتحكَّم به لاكتشاف الثغرات القابلة للاستغلال قبل أن يجدها مهاجم حقيقي.' },
      { ar: 'تدقيق أنظمة تقنية المعلومات (IT Audit)', en: 'IT Systems Audit',
        desc: 'A formal audit of IT systems and controls, producing findings your leadership and auditors can rely on.',
        descAr: 'تدقيق رسمي لأنظمة وضوابط تقنية المعلومات، يُنتج نتائج يمكن لقيادتكم ومدققيكم الاعتماد عليها.' },
      { ar: 'مراجعة الأداء واختيار الأنظمة', en: 'System Performance Review & Selection',
        desc: 'Reviews current system performance and advises on selecting a replacement or upgrade when needed.',
        descAr: 'مراجعة أداء الأنظمة الحالية وتقديم استشارة حول اختيار بديل أو ترقية عند الحاجة.' },
      { ar: 'استشارات حوكمة الأمن السيبراني', en: 'Cybersecurity Governance Consulting',
        desc: 'Advises on the governance structure behind your cybersecurity program — ownership, reporting, and accountability.',
        descAr: 'تقديم استشارة حول بنية الحوكمة الخاصة ببرنامج الأمن السيبراني — الملكية، والإبلاغ، والمساءلة.' },
      { ar: 'تطوير السياسات الأمنية ومعايير الامتثال', en: 'Security Policy Development & Compliance Standards',
        desc: 'Drafts the security policies and compliance standards your IT function is currently operating without.',
        descAr: 'صياغة السياسات الأمنية ومعايير الامتثال التي تعمل وظيفة تقنية المعلومات لديكم حاليًا بدونها.' },
      { ar: 'تمكين الحكومة الذكية والخدمات الإلكترونية', en: 'Smart Government & E-Services Enablement',
        desc: 'Supports a government entity in launching or improving digital and e-government services.',
        descAr: 'دعم جهة حكومية في إطلاق أو تحسين خدماتها الرقمية والحكومية الإلكترونية.' }
    ]
  }
];

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  const consultant = await prisma.user.upsert({
    where: { nationalId: '1000000098' },
    update: {},
    create: {
      nationalId: '1000000098',
      name: 'Mada Alhyat Consulting Team',
      passwordHash,
      role: 'CONSULTANT'
    }
  });

  let created = 0, skipped = 0;

  for (const axis of AXES) {
    for (const service of axis.services) {
      const existing = await prisma.consultingService.findFirst({ where: { title: service.en } });
      if (existing) { skipped++; continue; }

      await prisma.consultingService.create({
        data: {
          title: service.en,
          titleAr: service.ar,
          category: axis.titleAr,
          categoryEn: axis.titleEn,
          description: service.desc || `${axis.titleEn} consulting engagement: ${service.en}.`,
          descriptionAr: service.descAr || `خدمة استشارية ضمن محور ${axis.titleAr}: ${service.ar}.`,
          consultantId: consultant.id
        }
      });
      created++;
    }
  }

  console.log(`Done. Created ${created} consulting services across ${AXES.length} axes (${skipped} already existed and were skipped).`);
  console.log('  Consultant login: nationalId=1000000098  password=ChangeMe123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
