// Second batch of blog articles — same approach as seed-blog.js:
// original editorial content covering axes not yet addressed, plus
// a piece on the business case for compliance/training investment
// (this is Claude's own analysis, not a claim about the client).
// Run with: npm run seed:blog2

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
    title: 'The Business Case for Investing in Compliance and Governance',
    titleAr: 'لماذا يُعد الاستثمار في الامتثال والحوكمة قرارًا تجاريًا ذكيًا؟',
    category: 'إدارة المخاطر والامتثال',
    excerpt: 'Compliance is often budgeted as a cost center. The data tells a different story — it\'s one of the higher-return investments a growing organization can make.',
    excerptAr: 'غالبًا ما تُدرَج ميزانية الامتثال كمركز تكلفة. لكن الواقع يروي قصة مختلفة — إنه من أعلى الاستثمارات عائدًا لمؤسسة في طور النمو.',
    body: `When budgets tighten, compliance, risk, and internal training functions are often first in line for cuts — treated as overhead rather than as a driver of business value. That framing usually costs more than it saves.

Consider the asymmetry. A well-run GRC and training function typically costs a small, predictable percentage of revenue each year. The cost of getting it wrong — a regulatory fine, a fraud loss, a failed audit that delays a funding round, a data breach that damages customer trust — is rarely predictable, and rarely small. Regulators in Saudi Arabia and across the region have also raised the stakes: AML enforcement, cybersecurity requirements under the NCA's Essential Controls, and ESG disclosure expectations are all tightening, not loosening.

There's also a growth argument, not just a defensive one. Institutional investors and large enterprise customers increasingly run due diligence checklists before signing — governance structure, AML controls, cybersecurity posture, and ESG reporting are now standard questions in vendor onboarding and investment term sheets. Organizations that can answer them quickly, with documentation ready, close deals faster than those scrambling to build a policy the week it's requested.

Trained people compound this value. A workforce with real GRC, project management, and financial literacy doesn't just avoid mistakes — it makes faster, better-informed decisions across the business, because risk awareness becomes part of how people work rather than a separate function that reviews their work after the fact.

The organizations that treat compliance and professional training as strategic infrastructure — not a checkbox — are usually the same ones that scale fastest, because they've already built the trust and discipline that scaling requires.`,
    bodyAr: `عندما تُشدَّد الميزانيات، غالبًا ما تكون وظائف الامتثال والمخاطر والتدريب الداخلي أول ما يُخفَّض — تُعامَل كتكلفة إضافية لا كمحرّك لقيمة الأعمال. هذا التأطير غالبًا ما يكلّف أكثر مما يوفّر.

تأمّلوا عدم التناسق هنا. وظيفة حوكمة ومخاطر وامتثال مُدارة جيدًا تكلّف عادة نسبة صغيرة ومتوقعة من الإيرادات سنويًا. أما تكلفة الخطأ — غرامة تنظيمية، خسارة احتيال، تدقيق فاشل يؤخّر جولة تمويل، اختراق بيانات يضر بثقة العملاء — فنادرًا ما تكون متوقعة، ونادرًا ما تكون صغيرة. كما رفعت الجهات التنظيمية في السعودية والمنطقة من مستوى المخاطر: إنفاذ مكافحة غسل الأموال، ومتطلبات الأمن السيبراني وفق الضوابط الأساسية للهيئة الوطنية للأمن السيبراني، وتوقعات الإفصاح عن الاستدامة — كلها تتشدد لا تتراخى.

هناك أيضًا حجة نمو، لا دفاعية فقط. المستثمرون المؤسسيون وكبار عملاء الشركات يعتمدون بشكل متزايد على قوائم تحقق للعناية الواجبة قبل التوقيع — هيكل الحوكمة، ضوابط مكافحة غسل الأموال، وضع الأمن السيبراني، وتقارير الاستدامة أصبحت الآن أسئلة معيارية في تسجيل الموردين وشروط الاستثمار. المؤسسات القادرة على الإجابة بسرعة، بوثائق جاهزة، تُغلق الصفقات أسرع من تلك التي تتسابق لبناء سياسة في أسبوع طلبها.

القوى العاملة المدرَّبة تضاعف هذه القيمة. فريق يمتلك وعيًا حقيقيًا بالحوكمة والمخاطر والامتثال، وإدارة المشاريع، والثقافة المالية، لا يتجنب الأخطاء فقط — بل يتخذ قرارات أسرع وأفضل معلوماتية عبر المؤسسة، لأن الوعي بالمخاطر يصبح جزءًا من طريقة العمل، لا وظيفة منفصلة تراجع العمل بعد وقوعه.

المؤسسات التي تتعامل مع الامتثال والتدريب المهني كبنية تحتية استراتيجية — لا كمربع اختيار — هي غالبًا ذاتها التي تنمو أسرع، لأنها بنت بالفعل الثقة والانضباط اللذين يتطلبهما النمو.`
  },
  {
    title: 'Building a Speak-Up Culture: Beyond the Whistleblower Policy',
    titleAr: 'بناء ثقافة "تحدّث بصراحة": ما بعد سياسة الإبلاغ عن المخالفات',
    category: 'مكافحة الفساد والحوكمة الأخلاقية',
    excerpt: 'Most organizations have a whistleblower policy. Few have a culture where people actually feel safe using it.',
    excerptAr: 'معظم المؤسسات لديها سياسة إبلاغ عن المخالفات. القليل منها لديه ثقافة يشعر فيها الموظفون فعليًا بالأمان لاستخدامها.',
    body: `Nearly every mid-sized organization today has a whistleblower policy and a reporting channel — often required by a governance framework or an ISO 37001 anti-bribery certification. Far fewer have a culture where employees genuinely believe reporting is safe, valued, and acted upon. The gap between the two is where most ethics failures actually happen.

A policy document doesn't build trust. These practices do:

**Close the loop, even when you can't share details.** When someone reports a concern and hears nothing back, the lesson they learn is that reporting doesn't matter. A simple acknowledgment — "we received this, we're looking into it" — followed by eventual closure, even a general one, keeps the channel credible.

**Make anonymous genuinely anonymous.** If your reporting channel is a shared inbox that the ethics committee can trace back to an IP address or a badge swipe, employees will find out, and trust evaporates. Third-party-hosted channels solve this cleanly and are worth the modest cost.

**Model it from the top.** A code of conduct that leadership doesn't visibly follow trains employees to treat the whole framework as theater. When a senior leader is held to the same standard as a junior employee — publicly, even if the details stay private — that single event does more for culture than a year of training.

**Separate the investigation from the reporting line's management.** An employee who reports a concern about their own manager needs confidence that the manager won't be the one deciding what happens next.

Certifications like ISO 37001 and frameworks from bodies like Nazaha give you the structure. But structure without psychological safety produces a policy nobody uses — and the organizations that get burned by ethics failures are usually the ones that had the right policy on paper the whole time.`,
    bodyAr: `تمتلك تقريبًا كل مؤسسة متوسطة الحجم اليوم سياسة للإبلاغ عن المخالفات وقناة إبلاغ — غالبًا كمتطلب من إطار حوكمي أو شهادة ISO 37001 لمكافحة الرشوة. لكن عددًا أقل بكثير يمتلك ثقافة يؤمن فيها الموظفون فعليًا بأن الإبلاغ آمن، ومُقدَّر، ويُتخذ إجراء بشأنه. الفجوة بين الاثنين هي حيث تقع معظم إخفاقات الأخلاقيات فعليًا.

وثيقة السياسة وحدها لا تبني الثقة. هذه الممارسات تفعل:

**أغلقوا الحلقة، حتى إن تعذّر مشاركة التفاصيل.** عندما يُبلغ أحدهم عن مخاوف ولا يسمع أي رد، يتعلّم أن الإبلاغ لا يهم. إقرار بسيط — "استلمنا هذا، نراجعه" — يتبعه إغلاق نهائي، حتى لو كان عامًا، يحافظ على مصداقية القناة.

**اجعلوا المجهول مجهولًا فعليًا.** إن كانت قناة الإبلاغ لديكم صندوق بريد مشترك يمكن للجنة الأخلاقيات تتبعه لعنوان IP أو بطاقة دخول، سيكتشف الموظفون ذلك، وتتبخر الثقة. القنوات المستضافة من طرف ثالث تحل هذا بوضوح وتستحق التكلفة المتواضعة.

**كونوا قدوة من القمة.** مدونة سلوك لا تتبعها الإدارة العليا بوضوح تُعلّم الموظفين معاملة الإطار بأكمله كمسرحية. عندما يُحاسَب قائد كبير بنفس معيار موظف مبتدئ — علنًا، حتى لو بقيت التفاصيل خاصة — هذا الحدث الواحد يفعل للثقافة أكثر من عام كامل من التدريب.

**افصلوا التحقيق عن إدارة خط الإبلاغ.** موظف يُبلغ عن مخاوف تخص مديره المباشر يحتاج ثقة بأن المدير لن يكون من يقرر ما يحدث بعد ذلك.

شهادات مثل ISO 37001 وأطر من جهات مثل نزاهة تمنحكم الهيكل. لكن الهيكل بدون أمان نفسي ينتج سياسة لا يستخدمها أحد — والمؤسسات التي تتضرر من إخفاقات أخلاقية هي غالبًا تلك التي كانت تملك السياسة الصحيحة على الورق طوال الوقت.`
  },
  {
    title: 'ISO Certification Is the Floor, Not the Finish Line',
    titleAr: 'شهادة الآيزو خط البداية، لا خط النهاية',
    category: 'نظم ومعايير الجودة',
    excerpt: 'Getting certified is the easy part. The organizations that actually benefit from ISO standards are the ones that keep working after the certificate arrives.',
    excerptAr: 'الحصول على الشهادة هو الجزء السهل. المؤسسات التي تستفيد فعليًا من معايير الآيزو هي تلك التي تواصل العمل بعد وصول الشهادة.',
    body: `A predictable pattern plays out at many organizations pursuing ISO 9001 or similar quality certifications: intense activity in the months before the audit, a successful certification, a celebration — and then a slow drift back to old habits until the next surveillance audit forces another sprint.

This "certification sprint" pattern produces a certificate but rarely produces the operational improvement the standard is actually designed to create. A few shifts change that:

**Treat non-conformances as information, not failures to hide.** A quality system that produces zero non-conformance reports isn't perfect — it's not being used honestly. The value of CAPA (Corrective and Preventive Action) processes comes from surfacing real problems, not from a clean audit trail.

**Assign quality ownership beyond the quality department.** If process owners see quality as "the QA team's job," the system will always be reactive. Quality metrics built into operational KPIs — not a separate report reviewed once a quarter — keep the standard alive between audits.

**Use internal audits as a genuine improvement tool, not a rehearsal.** Internal audits scheduled a month before the external one, focused on making sure paperwork matches reality, miss the point. Internal audits scheduled throughout the year, focused on finding real gaps, are what actually drive improvement.

**Measure the outcomes the standard is meant to produce — not just compliance with it.** Fewer customer complaints, faster defect resolution, reduced rework — these are the actual point of a quality management system. If those numbers aren't moving, the certificate is decoration.

The certificate on the wall tells customers you met a standard on one day. The habits built around it tell them whether you still do.`,
    bodyAr: `يتكرر نمط معروف في مؤسسات كثيرة تسعى لشهادة ISO 9001 أو ما شابهها: نشاط مكثف في الأشهر التي تسبق التدقيق، اعتماد ناجح، احتفال — ثم انجراف تدريجي للعادات القديمة حتى يفرض تدقيق المراقبة التالي جولة جديدة.

هذا النمط "سباق الشهادة" ينتج شهادة، لكن نادرًا ما ينتج التحسين التشغيلي الذي صُمم المعيار أصلًا لتحقيقه. بعض التحولات تغيّر ذلك:

**تعاملوا مع حالات عدم المطابقة كمعلومات، لا كإخفاقات يجب إخفاؤها.** نظام جودة لا ينتج أي تقرير عدم مطابقة ليس مثاليًا — إنه غير مُستخدَم بصدق. قيمة عمليات CAPA (الإجراءات التصحيحية والوقائية) تأتي من إظهار المشاكل الحقيقية، لا من سجل تدقيق نظيف.

**حدّدوا ملكية الجودة خارج قسم الجودة نفسه.** إن رأى أصحاب العمليات الجودة كـ"مهمة فريق ضمان الجودة"، سيبقى النظام رد فعل دائمًا. مؤشرات الجودة المدمجة في مؤشرات الأداء التشغيلية — لا تقرير منفصل يُراجَع مرة كل ربع — تُبقي المعيار حيًا بين التدقيقات.

**استخدموا التدقيق الداخلي كأداة تحسين حقيقية، لا بروفة.** تدقيقات داخلية مجدولة قبل شهر من التدقيق الخارجي، تركّز على تطابق الأوراق مع الواقع، تفوّت الهدف. تدقيقات داخلية موزّعة على مدار العام، تركّز على إيجاد فجوات حقيقية، هي ما يدفع التحسين فعليًا.

**قيسوا النتائج التي صُمم المعيار لتحقيقها — لا مجرد الامتثال له.** شكاوى عملاء أقل، حل أسرع للعيوب، إعادة عمل أقل — هذه هي النقطة الفعلية لنظام إدارة الجودة. إن لم تتحرك هذه الأرقام، فالشهادة مجرد ديكور.

الشهادة على الجدار تخبر العملاء أنكم استوفيتم معيارًا في يوم واحد. العادات المبنية حولها تخبرهم إن كنتم لا تزالون تفعلون ذلك.`
  },
  {
    title: 'HR as a Strategic Partner, Not Just an Administrative Function',
    titleAr: 'الموارد البشرية كشريك استراتيجي، لا مجرد وظيفة إدارية',
    category: 'إدارة الموارد البشرية',
    excerpt: 'The shift from processing paperwork to shaping business strategy is the single biggest opportunity in HR today.',
    excerptAr: 'الانتقال من معالجة الأوراق إلى صياغة استراتيجية العمل هو أكبر فرصة منفردة أمام الموارد البشرية اليوم.',
    body: `In many organizations, HR is still measured primarily on transactional efficiency: how fast payroll runs, how quickly a vacancy is filled, how smoothly onboarding paperwork moves. These matter, but they're the floor, not the ceiling — and organizations that stop there miss HR's larger potential as a driver of business performance.

A few markers separate transactional HR from strategic HR:

**Workforce planning tied to business strategy, not headcount requests.** Strategic HR asks "what capabilities will the business need in 18 months, and where are the gaps?" — not just "which open roles need filling this quarter."

**People analytics that inform real decisions.** Turnover data broken down by manager, not just by department, often reveals more about retention than any exit interview. Performance data linked to training investment shows which development programs actually move outcomes.

**Succession planning that goes beyond the C-suite.** Every organization has a handful of roles where a sudden departure would genuinely hurt the business — not just senior leadership. Strategic HR identifies those roles at every level and builds a bench, quietly, before it's needed.

**A seat at the table before decisions are made, not after.** When HR is consulted on a restructuring, an acquisition, or a new market entry only after the plan is set, it can only manage consequences. When it's consulted while the plan is forming, it can shape a better one.

None of this requires abandoning administrative excellence — payroll still needs to run on time. But the organizations getting real value from HR treat it as a function that helps decide where the business goes, not only one that processes what happens after the decision is made.`,
    bodyAr: `في كثير من المؤسسات، لا تزال الموارد البشرية تُقاس بشكل أساسي على الكفاءة الإجرائية: سرعة صرف الرواتب، سرعة شغل الشاغر، سلاسة إجراءات التوظيف الورقية. هذه أمور مهمة، لكنها الحد الأدنى لا الأقصى — والمؤسسات التي تتوقف عند هذا الحد تفوّت إمكانات الموارد البشرية الأكبر كمحرّك لأداء الأعمال.

بعض المؤشرات تفصل بين الموارد البشرية الإجرائية والاستراتيجية:

**تخطيط قوى عاملة مرتبط باستراتيجية العمل، لا بطلبات التوظيف.** الموارد البشرية الاستراتيجية تسأل "ما الكفاءات التي سيحتاجها العمل خلال 18 شهرًا، وأين الفجوات؟" — لا فقط "أي وظائف شاغرة تحتاج شغلًا هذا الربع".

**تحليلات أفراد تُبنى عليها قرارات حقيقية.** بيانات دوران الموظفين مقسّمة حسب المدير، لا القسم فقط، غالبًا ما تكشف عن الاستبقاء أكثر من أي مقابلة خروج. بيانات الأداء المرتبطة بالاستثمار التدريبي تُظهر أي برامج تطوير تُحرّك النتائج فعليًا.

**تخطيط تعاقب يتجاوز الإدارة العليا.** لدى كل مؤسسة عدد من الأدوار التي سيضر رحيلها المفاجئ بالعمل فعليًا — ليس فقط الإدارة العليا. الموارد البشرية الاستراتيجية تحدد تلك الأدوار على كل مستوى وتبني بدائل، بهدوء، قبل الحاجة إليها.

**مقعد على الطاولة قبل اتخاذ القرارات، لا بعدها.** عندما تُستشار الموارد البشرية بشأن إعادة هيكلة أو استحواذ أو دخول سوق جديد بعد وضع الخطة فقط، لا يمكنها سوى إدارة النتائج. عندما تُستشار أثناء تشكّل الخطة، يمكنها صياغة خطة أفضل.

لا شيء من هذا يتطلب التخلي عن التميز الإداري — لا يزال الراتب يحتاج أن يُصرف في موعده. لكن المؤسسات التي تجني قيمة حقيقية من الموارد البشرية تتعامل معها كوظيفة تساعد في تحديد وجهة العمل، لا وظيفة تعالج فقط ما يحدث بعد اتخاذ القرار.`
  },
  {
    title: 'The Real Cost of Process Debt',
    titleAr: 'التكلفة الحقيقية لـ"ديون العمليات"',
    category: 'إدارة العمليات والتميز التشغيلي',
    excerpt: 'Like technical debt in software, unmanaged process complexity accumulates quietly — until it becomes the biggest constraint on growth.',
    excerptAr: 'مثل الديون التقنية في البرمجيات، يتراكم تعقيد العمليات غير المُدار بهدوء — حتى يصبح أكبر عائق أمام النمو.',
    body: `Software teams have a well-known concept: technical debt, the accumulated cost of shortcuts taken to move fast, which eventually slows everything down until it's paid off. Operations teams have the same problem, and it's rarely named as clearly.

Process debt looks like this: a manual workaround introduced during a busy quarter that never got automated. An approval step added after one specific incident that now applies to every transaction, regardless of size. Three different departments each maintaining their own version of "the customer list" because no one owns a single source of truth. None of these were bad decisions in isolation — they were often the right call under time pressure. The problem is what happens when dozens of them accumulate.

The cost shows up in predictable ways:

**Onboarding takes longer than it should**, because new employees have to learn undocumented workarounds that exist nowhere in the official process.

**Small requests take disproportionately long**, because they route through approval steps designed for a different, larger problem.

**Nobody can say with confidence how a process actually works** — only how it's supposed to work on paper, which is often a different thing entirely.

**Improvement projects stall**, because half the effort goes into first figuring out the current, undocumented state before anyone can redesign it.

The fix isn't a single heroic re-engineering project — those rarely survive contact with daily operations. It's a discipline: when a workaround becomes permanent, document it properly or eliminate it. When an approval step is added for an exception, set a review date to remove it once the exception has passed. Treat process complexity as a metric worth tracking, the same way a software team tracks technical debt — because the organizations that let it accumulate unchecked eventually find that their biggest constraint on growth isn't the market. It's their own operations.`,
    bodyAr: `تمتلك فرق البرمجيات مفهومًا معروفًا: الديون التقنية، وهي التكلفة المتراكمة للحلول السريعة المُتخذة للتحرك بسرعة، والتي تُبطئ كل شيء في النهاية حتى تُسدَّد. فرق العمليات تواجه نفس المشكلة، ونادرًا ما تُسمّى بهذا الوضوح.

"ديون العمليات" تبدو هكذا: حل بديل يدوي أُدخل في ربع مزدحم ولم تتم أتمتته أبدًا. خطوة موافقة أُضيفت بعد حادثة واحدة محددة وتُطبَّق الآن على كل معاملة، بغض النظر عن حجمها. ثلاثة أقسام مختلفة يحتفظ كل منها بنسخته الخاصة من "قائمة العملاء" لأن لا أحد يملك مصدرًا واحدًا موحدًا للحقيقة. لم يكن أي من هذه قرارات سيئة بمعزل عن غيرها — بل كانت غالبًا القرار الصحيح تحت ضغط الوقت. المشكلة فيما يحدث عندما تتراكم عشرات منها.

تظهر التكلفة بطرق يمكن توقعها:

**التوظيف الجديد يستغرق وقتًا أطول مما ينبغي**، لأن الموظفين الجدد يجب أن يتعلموا حلولًا بديلة غير موثّقة لا وجود لها في العملية الرسمية.

**الطلبات الصغيرة تستغرق وقتًا غير متناسب**، لأنها تمر عبر خطوات موافقة صُممت لمشكلة مختلفة وأكبر.

**لا أحد يستطيع أن يقول بثقة كيف تعمل العملية فعليًا** — فقط كيف يُفترض أن تعمل على الورق، وهو غالبًا أمر مختلف تمامًا.

**مشاريع التحسين تتعثر**، لأن نصف الجهد يذهب أولًا لفهم الوضع الحالي غير الموثّق قبل أن يستطيع أحد إعادة تصميمه.

الحل ليس مشروع إعادة هندسة بطولي واحد — نادرًا ما تنجو هذه من الاصطدام بالعمليات اليومية. إنه انضباط: عندما يصبح حل بديل دائمًا، وثّقوه بشكل صحيح أو ألغوه. عندما تُضاف خطوة موافقة لاستثناء ما، حدّدوا تاريخ مراجعة لإزالتها بعد انتهاء الاستثناء. تعاملوا مع تعقيد العمليات كمؤشر يستحق التتبع، تمامًا كما يتتبع فريق البرمجيات ديونه التقنية — لأن المؤسسات التي تترك هذا التراكم دون ضبط تكتشف في النهاية أن أكبر عائق أمام نموها ليس السوق. إنه عملياتها الخاصة.`
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
