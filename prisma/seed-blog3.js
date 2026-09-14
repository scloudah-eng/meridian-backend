// Third batch of blog articles — this time focused on the business/
// technology solutions side of the business (GRC platforms, AML tech,
// cybersecurity tooling, ERP, BI) rather than training/consulting.
// Same approach as seed-blog.js and seed-blog2.js: original editorial
// content, run with: npm run seed:blog3

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(title) {
  return title.toLowerCase().trim()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

const POSTS = [
  {
    title: 'Choosing a GRC Platform: What Actually Matters',
    titleAr: 'اختيار منصة GRC: ما الذي يهم فعليًا؟',
    category: 'إدارة المخاطر والامتثال',
    excerpt: 'GRC software demos all look impressive. Here\'s what separates a platform that gets used from one that gets abandoned after year one.',
    excerptAr: 'كل عروض برامج GRC التجريبية تبدو مبهرة. إليك ما يفرّق بين منصة تُستخدم فعليًا وأخرى تُهجَر بعد سنة واحدة.',
    body: `Governance, risk, and compliance software has a well-known failure pattern: an enthusiastic rollout, a few months of active use, and then a slow retreat back to spreadsheets while the platform quietly becomes an expensive line item nobody opens. The vendor selection process is usually where this gets decided, long before the first login.

A few criteria matter more than the feature list a demo will show you:

**How much configuration does day-one actually require?** Platforms that need six months of consulting-led setup before anyone can use them lose momentum before they prove value.

**Can the people who own the risk actually update it themselves?** If updating a risk register requires submitting a ticket to an admin team, the data goes stale within a quarter.

**What does the audit trail actually capture?** A platform that shows who changed a risk rating, when, and what triggered it, is what actually holds up under regulatory scrutiny.

**Integration with what people already use daily** matters more than a dedicated mobile app most GRC platforms oversell. Reminders that show up where people already work get done.

The platforms with the best long-term adoption are rarely the ones with the most modules. They're the ones that got embedded into a handful of real workflows quickly.`,
    bodyAr: `تمتلك برامج الحوكمة والمخاطر والامتثال (GRC) نمط فشل معروفًا: إطلاق متحمس، أشهر قليلة من الاستخدام الفعلي، ثم تراجع تدريجي للعودة لجداول Excel بينما تتحول المنصة بهدوء لبند مكلف لا يفتحه أحد.

بعض المعايير تهم أكثر من قائمة الميزات:

**كم يتطلب اليوم الأول من الإعداد فعليًا؟** المنصات التي تحتاج ستة أشهر من إعداد استشاري تفقد زخمها قبل أن تثبت قيمتها.

**هل يستطيع أصحاب المخاطر أنفسهم تحديثها؟** إن تطلّب التحديث تذكرة لفريق إداري، تصبح البيانات قديمة خلال ربع سنة.

**ماذا يسجّل مسار التدقيق فعليًا؟** منصة تُظهر من غيّر تصنيف الخطر، ومتى، وما الذي أدى لذلك، هي ما يصمد أمام التدقيق.

**التكامل مع ما يستخدمه الناس يوميًا** يهم أكثر من تطبيق جوال مخصص. التذكيرات التي تظهر حيث يعمل الناس بالفعل تُنجَز.

المنصات ذات التبني الأفضل نادرًا ما تملك أكبر عدد من الوحدات. إنها تلك التي اندمجت في سير عمل حقيقي بسرعة.`
  },
  {
    title: 'AML Transaction Monitoring: Tuning Out the Noise',
    titleAr: 'أنظمة مراقبة معاملات AML: كيف تخفّض الإنذارات الكاذبة؟',
    category: 'مكافحة غسل الأموال والجرائم المالية',
    excerpt: 'A monitoring system that flags everything is functionally the same as one that flags nothing.',
    excerptAr: 'نظام مراقبة يُنبّه على كل شيء يعادل عمليًا نظامًا لا يُنبّه على شيء.',
    body: `A common mistake when deploying AML transaction monitoring is treating alert volume as success — more rules, more alerts, more thoroughness. In practice, alert fatigue is one of the most common ways real suspicious activity gets missed.

**Start with typologies relevant to your actual customer base**, not a generic rule library. Begin with the patterns most plausible for your specific business.

**Track false-positive rates by rule**, not just in aggregate. Aggregate metrics hide exactly the information needed to fix the problem.

**Use risk scoring to prioritize the queue.** A corporate account with an established history and a newly opened account represent very different risk levels — static alerting treats them the same.

**Feed investigation outcomes back into tuning on a schedule.** If an analyst closes fifty alerts from the same rule as false positives, that's a tuning signal.

**Resist adding a new rule for every typology in the news.** A quarterly review asking "is this still earning its alert volume?" keeps the signal-to-noise ratio from degrading.

The goal isn't fewer alerts for their own sake — it's a system where the alerts an analyst sees are worth their attention.`,
    bodyAr: `من الأخطاء الشائعة عند تطبيق مراقبة معاملات AML التعامل مع حجم التنبيهات كمؤشر نجاح — قواعد أكثر، تنبيهات أكثر. في الواقع، إرهاق التنبيهات من أكثر الطرق شيوعًا التي يُفوَّت فيها نشاط مشبوه حقيقي.

**ابدأوا بأنماط ذات صلة بقاعدة عملائكم الفعلية**، لا بمكتبة قواعد عامة. ابدأوا بالأنماط الأكثر ترجيحًا لعملكم تحديدًا.

**تتبّعوا معدل الإنذارات الكاذبة لكل قاعدة**، لا الإجمالي فقط. المؤشرات الإجمالية تُخفي المعلومات اللازمة لحل المشكلة.

**استخدموا تقييم المخاطر لترتيب أولوية قائمة الانتظار.** حساب مؤسسي بتاريخ ثابت وحساب جديد يمثلان مستويي مخاطر مختلفين — التنبيه الثابت يعاملهما بنفس الطريقة.

**أعيدوا تغذية نتائج التحقيقات لعملية الضبط بجدول منتظم.** إغلاق خمسين تنبيهًا كإنذارات كاذبة إشارة ضبط.

**قاوموا إضافة قاعدة جديدة لكل نمط جديد في الأخبار.** مراجعة ربعية تمنع تدهور نسبة الإشارة للضوضاء.

الهدف ليس تنبيهات أقل لذاتها — بل نظام تستحق فيه التنبيهات انتباه المحلل.`
  },
  {
    title: 'SIEM Tools Won\'t Fix a Governance Gap',
    titleAr: 'أدوات SIEM لن تُصلح فجوة الحوكمة',
    category: 'تقنية المعلومات وأمن المعلومات والأمن السيبراني',
    excerpt: 'Security monitoring technology is only as good as the decisions made about what to do with what it finds.',
    excerptAr: 'تقنية مراقبة الأمن السيبراني لا تساوي أكثر من جودة القرارات بشأن ما تكتشفه.',
    body: `SIEM tools are often purchased as the solution to a security visibility problem — and they do solve that. What they don't solve alone is what happens after visibility exists: who looks at alerts, who decides what's urgent, who has authority to act.

**Who is the on-call owner for a critical alert, and what's the actual response SLA?** "The security team" is not an answer a 2am incident can act on.

**What counts as an incident requiring escalation** beyond the security team — to leadership, to regulators under frameworks like the NCA's Essential Cybersecurity Controls? Deciding this under pressure produces worse decisions than deciding in advance.

**How does the SIEM's output connect to the broader risk register?** A tool generating technical alerts in isolation tends to become a specialist silo rather than part of governance.

**Who reviews false positives and tunes detection rules, and how often?** SIEM rules degrade in relevance over time without active maintenance.

The tool is necessary. It's rarely sufficient. Organizations that get real value treat governance decisions — ownership, escalation, response time — as part of the deployment, not an afterthought.`,
    bodyAr: `تُشترى أدوات SIEM غالبًا كحل لمشكلة رؤية أمنية — وهي تحل ذلك بالفعل. ما لا تحله بمفردها هو ما يحدث بعد وجود الرؤية: من يراجع التنبيهات، ومن يقرر ما هو عاجل، ومن يملك صلاحية التصرف.

**من هو المالك المناوب لتنبيه حرج، وما زمن الاستجابة الفعلي؟** "فريق الأمن" ليس إجابة يمكن لحادثة الساعة 2 صباحًا التصرف بناءً عليها.

**ما الذي يُعتبر حادثة تستدعي التصعيد** خارج فريق الأمن — للإدارة العليا، للجهات التنظيمية وفق أطر مثل الضوابط الأساسية للهيئة الوطنية للأمن السيبراني؟ اتخاذ هذا تحت الضغط ينتج قرارات أسوأ.

**كيف يرتبط مخرج SIEM بسجل المخاطر الأوسع؟** أداة تُنتج تنبيهات معزولة تميل لأن تصبح وظيفة منعزلة بدل جزء من الحوكمة.

**من يراجع الإنذارات الكاذبة ويضبط القواعد، وبأي وتيرة؟** تتدهور صلة قواعد SIEM دون صيانة فعّالة.

الأداة ضرورية. نادرًا ما تكون كافية. المؤسسات التي تجني قيمة حقيقية تتعامل مع قرارات الحوكمة كجزء من النشر، لا كفكرة لاحقة.`
  },
  {
    title: 'ERP Selection: The Question Vendors Won\'t Ask You',
    titleAr: 'اختيار نظام ERP: السؤال الذي لن يطرحه عليكم المزوّدون',
    category: 'المالية والمحاسبة والمعاملات التجارية',
    excerpt: 'Every ERP vendor will ask what modules you need. Almost none will ask what you\'re willing to stop doing.',
    excerptAr: 'كل مزوّد ERP سيسألكم عن الوحدات التي تحتاجونها. لا أحد تقريبًا سيسألكم عمّا أنتم مستعدون للتوقف عن فعله.',
    body: `ERP selection typically starts with a requirements document mapping every current process to a needed feature. This produces the single biggest cause of ERP implementations going over budget: an attempt to replicate every quirk of the old system in the new one.

**Separate "the business needs this" from "we've always done it this way."** A three-step approval chain might reflect real risk controls, or be a workaround for a decade-old system limitation.

**Evaluate vendors against your actual messiest process**, not your cleanest one. Every ERP handles a simple invoice-to-payment flow well; fewer handle your specific multi-entity, multi-currency scenario.

**Budget meaningfully for change management**, not just software. Getting a finance team that's used the same process for eight years to adopt a new one is where projects actually stall.

**Resist heavy customization in year one.** A close-enough standard process adopted now, refined later, usually outperforms a heavily customized system built to replicate old habits.

**Ask what happens when something breaks at month-end close.** Vendor support response time during a critical close matters more than almost any feature on the requirements document.

Organizations that get real value are rarely the ones that replicated old processes most faithfully — they're the ones that asked which processes still deserved to exist.`,
    bodyAr: `تبدأ عمليات اختيار ERP عادة بوثيقة متطلبات تُطابق كل عملية حالية بميزة مطلوبة. هذا ينتج السبب الأكبر لتجاوز مشاريع ERP الميزانية: محاولة استنساخ كل خاصية في النظام القديم.

**افصلوا بين "العمل يحتاج هذا" و"هكذا اعتدنا دائمًا".** سلسلة موافقات من ثلاث خطوات قد تعكس ضوابط حقيقية، أو تكون حلًا بديلًا لقيد نظام قديم.

**قيّموا المزوّدين وفق أفوضى عملياتكم**، لا أنظفها. كل ERP يتعامل جيدًا مع تدفق بسيط؛ عدد أقل يتعامل مع سيناريوكم متعدد الكيانات والعملات.

**خصصوا ميزانية حقيقية لإدارة التغيير**، لا فقط للبرمجيات. جعل فريق اعتاد نفس العملية لثماني سنوات يتبنى جديدة هو ما يُعثّر المشاريع فعليًا.

**قاوموا التخصيص المفرط في السنة الأولى.** عملية معيارية "قريبة بما يكفي" تُعتمد الآن عادة تتفوق على نظام مُخصَّص بشدة.

**اسألوا ماذا يحدث عندما يتعطّل شيء عند إغلاق نهاية الشهر.** زمن استجابة الدعم أثناء إغلاق حرج يهم أكثر من أي ميزة في وثيقة المتطلبات.

المؤسسات التي تجني قيمة حقيقية نادرًا ما استنسخت عملياتها القديمة بأمانة — إنها سألت أي العمليات لا تزال تستحق الوجود.`
  },
  {
    title: 'BI Dashboards People Actually Open',
    titleAr: 'لوحات ذكاء الأعمال التي يفتحها الناس فعليًا',
    category: 'إدارة العمليات والتميز التشغيلي',
    excerpt: 'Most business intelligence dashboards are built once, celebrated once, and never opened again.',
    excerptAr: 'معظم لوحات ذكاء الأعمال تُبنى مرة، يُحتفى بها مرة، ولا تُفتح مجددًا.',
    body: `A familiar pattern: an impressive dashboard gets built for a leadership meeting, generates enthusiasm, then quietly stops being opened within weeks — while the BI license keeps renewing. The tool wasn't the problem. What got built with it usually was.

**Build for a decision, not a topic.** A dashboard titled "Sales Performance" invites browsing once. One that answers "which accounts need a call this week" gets opened every week because it drives a recurring action.

**One owner reviews it on a fixed cadence, out loud, with others.** A dashboard feeding a Monday meeting stays accurate because inaccuracy becomes visible immediately.

**Fewer metrics, chosen deliberately, beat comprehensive coverage.** Thirty metrics let everyone focus on the three that confirm what they already believed. Four well-chosen ones force a genuine look.

**The data pipeline needs an owner, not just the dashboard.** A beautiful dashboard on a manually updated spreadsheet is one vacation away from being wrong.

**Kill dashboards nobody opens, deliberately.** Two hundred unopened dashboards train people to ignore all of them, including the good ones.

The gap between organizations that get real value from BI and those that don't is rarely a licensing question — it's whether dashboards were built around a specific recurring decision, with an accountable owner, from day one.`,
    bodyAr: `نمط مألوف: تُبنى لوحة مبهرة لاجتماع إدارة عليا، تولّد حماسًا، ثم تتوقف عن الفتح بهدوء خلال أسابيع — بينما يستمر تجديد ترخيص BI. الأداة لم تكن المشكلة. ما بُني بها عادة ما كان المشكلة.

**ابنوا للقرار، لا للموضوع.** لوحة "أداء المبيعات" تدعو للتصفح مرة. لوحة تجيب "أي الحسابات تحتاج اتصالًا هذا الأسبوع" تُفتح كل أسبوع لأنها تدفع إجراءً متكررًا.

**مالك واحد يراجعها بوتيرة ثابتة، بصوت مسموع، مع آخرين.** لوحة تُغذّي اجتماع الاثنين تبقى دقيقة لأن عدم الدقة يصبح مرئيًا فورًا.

**مؤشرات أقل، مُختارة بوعي، تتفوق على تغطية شاملة.** ثلاثون مؤشرًا تمنح الجميع إذنًا للتركيز على ما يؤكد اعتقادهم. أربعة مُختارة جيدًا تفرض نظرة حقيقية.

**خط أنابيب البيانات يحتاج مالكًا، لا اللوحة فقط.** لوحة جميلة على جدول بيانات يدوي تبعد إجازة واحدة عن الخطأ.

**احذفوا اللوحات التي لا يفتحها أحد، بوعي.** مئتا لوحة غير مفتوحة تُدرّب الناس على تجاهلها جميعًا.

الفجوة بين المؤسسات التي تجني قيمة حقيقية من BI وتلك التي لا تجني نادرًا ما تكون مسألة ترخيص — إنها ما إذا بُنيت اللوحات حول قرار متكرر محدد، بمالك مسؤول، منذ اليوم الأول.`
  }
];

async function main() {
  const author = await prisma.user.findUnique({ where: { nationalId: '1000000001' } });
  if (!author) {
    console.error('Seed admin (nationalId 1000000001) not found — run `npm run seed` first.');
    process.exit(1);
  }

  let created = 0, skipped = 0;
  for (const post of POSTS) {
    const slug = slugify(post.title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) { skipped++; continue; }

    await prisma.blogPost.create({
      data: {
        slug,
        title: post.title,
        titleAr: post.titleAr,
        excerpt: post.excerpt,
        excerptAr: post.excerptAr,
        body: post.body,
        bodyAr: post.bodyAr,
        category: post.category,
        published: true,
        publishedAt: new Date(),
        authorId: author.id
      }
    });
    created++;
  }

  console.log(`Done. Created ${created} blog posts (${skipped} already existed and were skipped).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
