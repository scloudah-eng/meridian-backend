// Populates BusinessSolution records from the same company profile PDF
// used for the course and consulting catalogs — specifically the
// "الحلول التقنية / نظم المعلومات" (Technology Solutions / Information
// Systems) column for each of the 10 axes. This is the company's third
// real business line (distinct from courses and consulting), delivered
// in partnership with TenIntelligence and BenchMatrix (named on every
// page of that column in the source PDF).
//
// Run with: npm run seed:solutions

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AXES = [
  {
    titleAr: 'مكافحة الاحتيال والتحقيقات', titleEn: 'Fraud Prevention & Investigations',
    items: [
      { ar: 'منصات تسجيل مخاطر الاحتيال المؤتمتة', en: 'Automated Fraud Risk Registration Platforms' },
      { ar: 'برامج تتبع الحالات وإدارة التحقيقات', en: 'Case Tracking & Investigation Management Software' },
      { ar: 'أدوات تصعيد الأحداث وسلاسل الأدلة', en: 'Incident Escalation & Evidence Chain Tools' },
      { ar: 'أدوات الأدلة الرقمية واستخراج البيانات', en: 'Digital Evidence & Data Extraction Tools' },
      { ar: 'تنبيهات المخاطر ومحفزات سير العمل الآلي', en: 'Risk Alerts & Automated Workflow Triggers' },
      { ar: 'لوحات مؤشرات مخاطر الاحتيال (KRIs)', en: 'Fraud Risk Indicator (KRI) Dashboards' },
      { ar: 'أدوات استخبارات جنائية بالشراكة (عبر TenIntelligence)', en: 'Forensic Intelligence Tools (via TenIntelligence partnership)' }
    ]
  },
  {
    titleAr: 'إدارة المخاطر والامتثال', titleEn: 'Risk & Compliance Management',
    items: [
      { ar: 'منصات إدارة المخاطر التشغيلية (iRGC – BenchMatrix)', en: 'Operational Risk Management Platforms (iRGC – BenchMatrix)' },
      { ar: 'برمجيات سجلات مخاطر الامتثال', en: 'Compliance Risk Register Software' },
      { ar: 'تتبع القضايا ومراقبة الضوابط المؤتمتة', en: 'Case Tracking & Automated Control Monitoring' },
      { ar: 'لوحات مؤشرات المخاطر وخرائط حرارية', en: 'Risk Indicator Dashboards & Heat Maps' },
      { ar: 'أدوات محاكاة مونت كارلو ونماذج رأس المال', en: 'Monte Carlo Simulation & Capital Modeling Tools' },
      { ar: 'أدوات إعداد التقارير المؤتمتة وسير العمل للحوكمة', en: 'Automated Governance Reporting & Workflow Tools' },
      { ar: 'أنظمة تتبع الوثائق وسير العمل التنظيمي', en: 'Document Tracking & Regulatory Workflow Systems' }
    ]
  },
  {
    titleAr: 'مكافحة الفساد والحوكمة الأخلاقية', titleEn: 'Anti-Corruption & Ethical Governance',
    items: [
      { ar: 'أنظمة إدارة الامتثال الأخلاقي', en: 'Ethics Compliance Management Systems' },
      { ar: 'أنظمة الإبلاغ عن المخالفات (قنوات آمنة)', en: 'Whistleblower Reporting Systems (Secure Channels)' },
      { ar: 'أنظمة التحقق من النزاهة للطرف الثالث', en: 'Third-Party Integrity Verification Systems' },
      { ar: 'أنظمة تتبع الفساد والرشوة', en: 'Corruption & Bribery Tracking Systems' },
      { ar: 'إدارة الحوادث وسلاسل التحقيق', en: 'Incident Management & Investigation Chains' },
      { ar: 'إفصاح الموظف وتعهدات تضارب المصالح', en: 'Employee Disclosure & Conflict-of-Interest Declarations' },
      { ar: 'أتمتة الإفصاح، والموافقة، والمراجعة', en: 'Disclosure, Approval & Review Automation' },
      { ar: 'تحليلات مؤشرات الخروقات الأخلاقية', en: 'Ethical Breach Indicator Analytics' }
    ]
  },
  {
    titleAr: 'مكافحة غسل الأموال والجرائم المالية', titleEn: 'Anti-Money Laundering & Financial Crime (AML/CFT)',
    items: [
      { ar: 'أنظمة مراقبة AML وفحص المعاملات', en: 'AML Transaction Monitoring Systems' },
      { ar: 'أدوات تحقق تلقائي من العملاء (CDD)', en: 'Automated Customer Due Diligence (CDD) Tools' },
      { ar: 'فحص قوائم العقوبات (OFAC، الأمم المتحدة، الاتحاد الأوروبي)', en: 'Sanctions List Screening (OFAC, UN, EU)' },
      { ar: 'تتبع الأنشطة المشبوهة (SAR) وأتمتة تقاريرها', en: 'Suspicious Activity (SAR) Tracking & Report Automation' },
      { ar: 'إدارة الحالات لقضايا AML', en: 'AML Case Management' },
      { ar: 'أدوات فحص KYC / PEP', en: 'KYC / PEP Screening Tools' },
      { ar: 'لوحات مؤشرات التدقيق والامتثال', en: 'Audit & Compliance Indicator Dashboards' },
      { ar: 'أتمتة التقارير التنظيمية', en: 'Regulatory Report Automation' }
    ]
  },
  {
    titleAr: 'إدارة المشاريع والبرامج والمحافظ', titleEn: 'Project, Program & Portfolio Management',
    items: [
      { ar: 'منصات إدارة محافظ المشاريع (PPM)', en: 'Project Portfolio Management (PPM) Platforms' },
      { ar: 'حلول أوراكل بريمافيرا / MS Project', en: 'Oracle Primavera / MS Project Solutions' },
      { ar: 'لوحات مؤشرات KPIs والميزانيات والجداول الزمنية', en: 'KPI, Budget & Timeline Dashboards' },
      { ar: 'دمج أدوات PMI التقليدية والهجينة (Agile / Hybrid)', en: 'PMI Traditional & Hybrid Tool Integration (Agile/Hybrid)' },
      { ar: 'أتمتة سير العمل وقوالب التقارير', en: 'Workflow Automation & Report Templates' },
      { ar: 'أدوات تتبع القضايا والمخاطر والتبعيات', en: 'Issue, Risk & Dependency Tracking Tools' },
      { ar: 'أدوات إدارة المستندات والبوابات المرحلية', en: 'Document Management & Stage-Gate Tools' },
      { ar: 'نمذجة سيناريوهات المحافظ وتوقعاتها', en: 'Portfolio Scenario Modeling & Forecasting' }
    ]
  },
  {
    titleAr: 'المالية والمحاسبة والمعاملات التجارية', titleEn: 'Finance, Accounting & Commercial Transactions',
    items: [
      { ar: 'اختيار أنظمة ERP (أوراكل، SAP، مايكروسوفت)', en: 'ERP System Selection (Oracle, SAP, Microsoft)' },
      { ar: 'تنفيذ النماذج المالية (GL, AP, AR)', en: 'Financial Module Implementation (GL, AP, AR)' },
      { ar: 'أتمتة سير عمل المعاملات المالية', en: 'Financial Transaction Workflow Automation' },
      { ar: 'أدوات إصدار الفواتير الإلكترونية والتكامل', en: 'E-Invoicing Tools & Integration' },
      { ar: 'لوحات مؤشرات KPIs المالية', en: 'Financial KPI Dashboards' },
      { ar: 'أنظمة تقارير مالية وتدقيق', en: 'Financial Reporting & Audit Systems' },
      { ar: 'إدارة الوثائق وسير عمل الموافقات', en: 'Document Management & Approval Workflows' },
      { ar: 'تتبع النفقات الفعلي بشكل فوري', en: 'Real-Time Expense Tracking' },
      { ar: 'وحدات التنبؤ والتخطيط بالسيناريو', en: 'Forecasting & Scenario Planning Modules' }
    ]
  },
  {
    titleAr: 'إدارة الموارد البشرية', titleEn: 'Human Resources Management',
    items: [
      { ar: 'أنظمة إدارة الموارد البشرية (HRMS)', en: 'Human Resource Management Systems (HRMS)' },
      { ar: 'لوحات معلومات وتحليلات الأفراد', en: 'People Analytics Dashboards' },
      { ar: 'أنظمة إدارة الأداء والرواتب', en: 'Performance & Payroll Management Systems' },
      { ar: 'الحضور والانصراف وأتمتة الرواتب', en: 'Time & Attendance with Payroll Automation' },
      { ar: 'أدوات تتبع مؤشرات الأداء للموظفين والفرق', en: 'Employee & Team Performance Tracking Tools' },
      { ar: 'بوابات الخدمة الذاتية للموظفين (ESS)', en: 'Employee Self-Service (ESS) Portals' },
      { ar: 'أنظمة التقييم والمكافآت', en: 'Appraisal & Rewards Systems' },
      { ar: 'التكامل مع أنظمة ERP (مثل Oracle HR، SAP HR)', en: 'ERP Integration (e.g. Oracle HR, SAP HR)' },
      { ar: 'إدارة طلبات خدمات الموارد البشرية عبر الإنترنت', en: 'Online HR Service Request Management' }
    ]
  },
  {
    titleAr: 'نظم ومعايير الجودة', titleEn: 'Quality Management Systems & Standards',
    items: [
      { ar: 'برامج تنفيذ وتتبع نظم الجودة (QMS)', en: 'Quality Management System (QMS) Implementation & Tracking' },
      { ar: 'أدوات تتبع وتصحيح الانحرافات (CAPA)', en: 'Corrective & Preventive Action (CAPA) Tools' },
      { ar: 'أنظمة تعيين المخاطر وتخطيط العمليات', en: 'Risk Assignment & Process Planning Systems' },
      { ar: 'نظم تقارير حالات عدم المطابقة', en: 'Non-Conformance Reporting Systems' },
      { ar: 'الأنظمة الرقمية المتكاملة لـ QHSE', en: 'Integrated Digital QHSE Systems' },
      { ar: 'برامج تدقيق وفحص النماذج', en: 'Audit & Form Inspection Software' },
      { ar: 'أنظمة إدارة الوثائق والمراجعات', en: 'Document & Review Management Systems' },
      { ar: 'الامتثال لمتطلبات الجهات التنظيمية', en: 'Regulatory Compliance Tools' },
      { ar: 'أدوات وتقارير الجودة المرئية', en: 'Visual Quality Tools & Reporting' }
    ]
  },
  {
    titleAr: 'إدارة العمليات والتميز التشغيلي', titleEn: 'Operations Management & Operational Excellence',
    items: [
      { ar: 'أدوات تخطيط العمليات وأتمتة سير العمل', en: 'Process Planning & Workflow Automation Tools' },
      { ar: 'لوحات مراقبة مؤشرات الأداء (KPI) واتفاقيات الخدمة (SLA)', en: 'KPI & SLA Monitoring Dashboards' },
      { ar: 'أدوات بناء ومراجعة السياسات الرقمية', en: 'Digital Policy Authoring & Review Tools' },
      { ar: 'تتبع الحوادث وأدوات التصعيد', en: 'Incident Tracking & Escalation Tools' },
      { ar: 'تكامل سير العمل مع أنظمة ERP - CRM', en: 'ERP–CRM Workflow Integration' },
      { ar: 'لوحات الأداء وتقارير الوقت الفعلي', en: 'Real-Time Performance Dashboards & Reports' },
      { ar: 'أنظمة التذاكر وطلبات الخدمة', en: 'Ticketing & Service Request Systems' },
      { ar: 'تحليلات التكلفة والإنتاجية', en: 'Cost & Productivity Analytics' },
      { ar: 'إدارة العمليات الورقية والمهام الميدانية عبر الجوال', en: 'Paperless Operations & Mobile Field Task Management' }
    ]
  },
  {
    titleAr: 'تقنية المعلومات وأمن المعلومات والأمن السيبراني', titleEn: 'IT, Information Security & Cybersecurity',
    items: [
      { ar: 'تنفيذ أنظمة ERP (Oracle، SAP، Microsoft Dynamics)', en: 'ERP System Implementation (Oracle, SAP, Microsoft Dynamics)' },
      { ar: 'حلول ذكاء الأعمال ولوحات القيادة (Power BI، Tableau)', en: 'Business Intelligence & Dashboards (Power BI, Tableau)' },
      { ar: 'أدوات مراقبة أمن المعلومات (SIEM)', en: 'Information Security Monitoring Tools (SIEM)' },
      { ar: 'حماية البيانات والتوافق مع لوائح الخصوصية', en: 'Data Protection & Privacy Compliance' },
      { ar: 'تكامل الأنظمة مع المنصات الوطنية (مثل أبشر، فاتورة)', en: 'Integration with National Platforms (e.g. Absher, Fatoora)' },
      { ar: 'أدوات أتمتة سير العمل والمنصات منخفضة التعليمات البرمجية', en: 'Workflow Automation & Low-Code Platforms' },
      { ar: 'أدوات إدارة الهوية والوصول (IAM)', en: 'Identity & Access Management (IAM) Tools' },
      { ar: 'منصات السحابة والتخزين والتوقيعات الرقمية', en: 'Cloud, Storage & Digital Signature Platforms' },
      { ar: 'أدوات تحليل الثغرات وإدارة الحوادث الأمنية', en: 'Vulnerability Analysis & Security Incident Management Tools' }
    ]
  }
];

async function main() {
  let created = 0, skipped = 0;
  const partnerBrand = 'TenIntelligence · BenchMatrix';

  for (const axis of AXES) {
    for (const item of axis.items) {
      const existing = await prisma.businessSolution.findFirst({ where: { title: item.en } });
      if (existing) { skipped++; continue; }

      await prisma.businessSolution.create({
        data: {
          title: item.en,
          titleAr: item.ar,
          category: axis.titleAr,
          categoryEn: axis.titleEn,
          description: `${axis.titleEn} technology solution: ${item.en}.`,
          descriptionAr: `حل تقني ضمن محور ${axis.titleAr}: ${item.ar}.`,
          partnerBrand
        }
      });
      created++;
    }
  }

  console.log(`Done. Created ${created} business/technology solutions across ${AXES.length} axes (${skipped} already existed and were skipped).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
