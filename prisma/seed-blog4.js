// Fourth blog batch — new consulting-adjacent topics not covered by
// batches 1-3: ESG assurance, treasury advisory, HR transformation
// consulting, PMO advisory, and quality consulting engagements.
// Run with: npm run seed:blog4

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
    title: 'Why ESG Assurance Is Becoming a Real Requirement, Not a Nice-to-Have',
    titleAr: 'لماذا أصبح ضمان الاستدامة (ESG) متطلبًا حقيقيًا، لا رفاهية؟',
    category: 'إدارة المخاطر والامتثال',
    excerpt: 'Publishing an ESG report is one thing. Having it independently assured is what increasingly separates credible disclosure from marketing.',
    excerptAr: 'نشر تقرير استدامة شيء. الحصول على ضمان مستقل له شيء آخر يفصل بشكل متزايد بين الإفصاح الموثوق والتسويق.',
    body: `Early ESG reporting in most markets was self-published and largely unquestioned. That's changing quickly. Investors, lenders, and large customers increasingly ask a follow-up question after seeing an ESG report: who verified this?

ESG assurance — an independent party reviewing and attesting to the accuracy of sustainability disclosures — is following a path similar to financial audit a generation ago: optional and rare, then expected for large public companies, then a standard expectation across the market.

A few reasons this shift is accelerating:

**Greenwashing scrutiny has real teeth now.** Regulators in multiple markets have begun taking action against companies whose sustainability claims don't hold up to examination. An unassured report carries more legal exposure than it once did.

**Lenders are pricing it in.** Sustainability-linked loans, increasingly common in the region, often tie interest rates to ESG performance — and lenders want assurance over the metrics that determine their return, not just a company's own account of them.

**Assurance levels vary, and that distinction matters.** "Limited assurance" (a review-level check) is far less rigorous than "reasonable assurance" (audit-level verification), and the market is starting to notice which one a company has actually obtained. A report that says "assured" without specifying the level is often doing limited assurance and hoping nobody asks.

**It's cheaper to build for assurance from the start than to retrofit it.** Companies that design their ESG data collection process with assurance in mind — clear data trails, consistent definitions, documented sources — spend far less getting assured than those trying to backfill evidence after the fact.

Organizations publishing ESG reports today without a path toward assurance aren't necessarily doing anything wrong yet. But the bar is moving, and the companies preparing for assurance now — even before it's formally required — are the ones that won't be scrambling when a lender, investor, or regulator asks the follow-up question.`,
    bodyAr: `كانت تقارير الاستدامة المبكرة في معظم الأسواق تُنشر ذاتيًا ودون تشكيك يُذكر. هذا يتغيّر بسرعة. يسأل المستثمرون والمقرضون وكبار العملاء بشكل متزايد سؤالًا تاليًا بعد رؤية تقرير استدامة: من تحقق من هذا؟

ضمان الاستدامة (ESG Assurance) — مراجعة طرف مستقل وتصديقه على دقة إفصاحات الاستدامة — يسلك مسارًا شبيهًا بالتدقيق المالي قبل جيل: اختياري ونادر، ثم متوقَّع للشركات العامة الكبرى، ثم توقعًا معياريًا عبر السوق.

بعض أسباب تسارع هذا التحول:

**التدقيق في "الغسيل الأخضر" أصبح له أنياب حقيقية الآن.** بدأت جهات تنظيمية في أسواق متعددة اتخاذ إجراءات ضد شركات لا تصمد ادعاءات استدامتها أمام الفحص. تقرير غير مضمون يحمل تعرضًا قانونيًا أكبر مما كان عليه سابقًا.

**المقرضون يسعّرونه فعليًا.** القروض المرتبطة بالاستدامة، الشائعة بشكل متزايد في المنطقة، غالبًا ما تربط أسعار الفائدة بأداء الاستدامة — ويريد المقرضون ضمانًا على المؤشرات التي تحدد عائدهم، لا مجرد رواية الشركة الخاصة عنها.

**مستويات الضمان تتفاوت، وهذا الفرق مهم.** "الضمان المحدود" (فحص بمستوى مراجعة) أقل صرامة بكثير من "الضمان المعقول" (تحقق بمستوى تدقيق)، والسوق بدأ يلاحظ أي منهما حصلت عليه الشركة فعليًا. تقرير يقول "مضمون" دون تحديد المستوى غالبًا ما يكون ضمانًا محدودًا يأمل ألا يسأل أحد.

**البناء من أجل الضمان منذ البداية أرخص من تعديله لاحقًا.** الشركات التي تصمم عملية جمع بيانات الاستدامة لديها مع مراعاة الضمان — مسارات بيانات واضحة، تعريفات متسقة، مصادر موثّقة — تنفق أقل بكثير للحصول على الضمان من تلك التي تحاول سد فجوة الأدلة لاحقًا.

المؤسسات التي تنشر تقارير استدامة اليوم دون مسار نحو الضمان لا ترتكب بالضرورة خطأً بعد. لكن السقف يتحرك، والشركات التي تستعد للضمان الآن — حتى قبل أن يصبح مطلوبًا رسميًا — هي التي لن تتسابق عندما يسأل مقرض أو مستثمر أو جهة تنظيمية السؤال التالي.`
  },
  {
    title: 'Treasury Advisory: The Questions Worth Asking Before You Need the Answers',
    titleAr: 'استشارات الخزينة: الأسئلة التي تستحق طرحها قبل أن تحتاج إجاباتها',
    category: 'المالية والمحاسبة والمعاملات التجارية',
    excerpt: 'Most treasury problems are discovered during a crisis. The organizations that avoid that discover them in a quiet quarterly review instead.',
    excerptAr: 'معظم مشاكل الخزينة تُكتشف أثناء أزمة. المؤسسات التي تتجنب ذلك تكتشفها بدلًا من ذلك في مراجعة ربعية هادئة.',
    body: `Treasury advisory engagements are often requested reactively — after a liquidity scare, a failed funding round, or a currency swing that hurt more than expected. The value of the advisory work is real either way, but the organizations that ask for it proactively get to choose their own timeline instead of having one forced on them.

A few questions worth asking on a quiet quarter, not a hard one:

**If our largest customer paid 60 days late next quarter, would we notice in time to act?** Many finance teams can answer this only after building a cash flow model under pressure. Building it now, calmly, is the same work with a much better outcome.

**Do we actually know our real cost of capital, or are we using a number from three years ago?** Interest rate environments shift; a stale cost-of-capital figure quietly distorts every investment decision that uses it.

**How concentrated is our banking relationship, and does that concentration matter?** A single primary banking relationship is efficient until it isn't — during a bank-specific liquidity event, sanctions complication, or simple relationship-manager turnover that slows everything down.

**What's our actual FX exposure, not our assumed exposure?** Organizations that "don't really deal in foreign currency" often discover, once someone maps it properly, that supplier contracts, service agreements, or even domestic contracts pegged to imported input costs carry real currency risk nobody had quantified.

**If we needed emergency liquidity within a week, what's the actual playbook?** Not a theoretical one — the specific facilities, the specific contacts, the specific approval chain. Organizations that have written this down, even briefly, move dramatically faster than those improvising for the first time under pressure.

None of these questions require a crisis to be worth answering. The value of treasury advisory isn't fixing problems — it's the discipline of asking these questions on a calendar, rather than only when circumstances force the issue.`,
    bodyAr: `غالبًا ما تُطلب استشارات الخزينة بشكل رد فعل — بعد خوف من السيولة، جولة تمويل فاشلة، أو تقلب عملة أضر أكثر من المتوقع. قيمة العمل الاستشاري حقيقية في الحالتين، لكن المؤسسات التي تطلبه استباقيًا تختار جدولها الزمني الخاص بدلًا من أن يُفرض عليها.

بعض الأسئلة التي تستحق طرحها في ربع هادئ، لا ربع صعب:

**لو تأخر أكبر عملائنا 60 يومًا بالدفع الربع القادم، هل سنلاحظ ذلك بوقت كافٍ للتصرف؟** يستطيع كثير من الفرق المالية الإجابة على هذا فقط بعد بناء نموذج تدفق نقدي تحت ضغط. بناؤه الآن، بهدوء، هو نفس العمل بنتيجة أفضل بكثير.

**هل نعرف فعليًا تكلفة رأس المال الحقيقية لدينا، أم نستخدم رقمًا من ثلاث سنوات مضت؟** تتغير بيئات أسعار الفائدة؛ رقم تكلفة رأس مال قديم يُشوّه بهدوء كل قرار استثماري يستخدمه.

**ما مدى تركّز علاقتنا المصرفية، وهل يهم هذا التركّز؟** علاقة مصرفية أساسية واحدة كفؤة حتى لا تكون كذلك — أثناء حدث سيولة خاص ببنك معيّن، أو تعقيد عقوبات، أو حتى تبديل مدير علاقة يبطئ كل شيء.

**ما تعرضنا الفعلي لصرف العملات، لا تعرضنا المفترض؟** المؤسسات التي "لا تتعامل فعليًا بعملات أجنبية" غالبًا ما تكتشف، بمجرد أن يرسمها أحد بشكل صحيح، أن عقود الموردين أو اتفاقيات الخدمة أو حتى العقود المحلية المربوطة بتكاليف مدخلات مستوردة تحمل مخاطر عملة حقيقية لم يقيّمها أحد.

**لو احتجنا سيولة طارئة خلال أسبوع، ما الخطة الفعلية؟** ليست نظرية — التسهيلات المحددة، جهات الاتصال المحددة، سلسلة الموافقة المحددة. المؤسسات التي دوّنت هذا، حتى بإيجاز، تتحرك أسرع بكثير من تلك التي ترتجل لأول مرة تحت الضغط.

لا يتطلب أي من هذه الأسئلة أزمة ليستحق الإجابة. قيمة استشارات الخزينة ليست في حل المشاكل — إنها انضباط طرح هذه الأسئلة وفق جدول، لا فقط عندما تفرض الظروف الأمر.`
  },
  {
    title: 'HR Transformation Consulting: Why Most Projects Stall at "Policy Complete"',
    titleAr: 'استشارات التحول في الموارد البشرية: لماذا تتعثر معظم المشاريع عند "اكتمال السياسة"؟',
    category: 'إدارة الموارد البشرية',
    excerpt: 'A new HR policy document is not a transformation. The gap between the two is where most consulting engagements actually earn their fee.',
    excerptAr: 'وثيقة سياسة موارد بشرية جديدة ليست تحولًا. الفجوة بين الاثنين هي حيث تكسب معظم المشاريع الاستشارية أتعابها فعليًا.',
    body: `A recognizable pattern in HR transformation projects: months of careful work produce a polished new policy framework, a competency model, or a performance management redesign — genuinely good work, presented well, approved by leadership — and then adoption stalls at roughly the point where the consulting engagement officially ends.

The gap between "policy complete" and "transformation complete" is usually where the real value of a good consulting engagement lives, and it's worth naming explicitly rather than assuming it will happen on its own:

**A new policy without new manager behavior is just a document.** If line managers keep running performance conversations the old way, a beautifully designed new performance framework changes nothing for employees. Manager enablement — training, coaching, and early reinforcement — usually needs as much budget as the framework design itself, and often gets a fraction of it.

**Systems need to actually reflect the new policy, not just tolerate it.** An HR system still configured for the old performance cycle, the old job architecture, or the old approval chain quietly undermines a new policy every time someone tries to use it, because the tool fights the process.

**Communication needs to explain "why," not just announce "what."** Employees who receive a new policy without understanding the reasoning behind it tend to treat it as bureaucracy rather than genuine improvement — and treat it accordingly, complying minimally rather than engaging with it.

**Someone needs to own adoption after the consultants leave.** A transformation project with a defined end date but no internal owner accountable for sustained adoption tends to drift back toward old habits within a year, because nobody's job depends on the new way sticking.

Good HR consulting increasingly recognizes this and builds adoption planning into the engagement from day one — not as an afterthought once the policy document is finished, but as a co-equal deliverable alongside it. The policy is necessary. It was never sufficient on its own.`,
    bodyAr: `نمط معروف في مشاريع التحول بالموارد البشرية: أشهر من العمل الدقيق تُنتج إطار سياسة جديدًا أنيقًا، أو نموذج كفاءات، أو إعادة تصميم لإدارة الأداء — عمل جيد فعليًا، مُقدَّم بشكل جيد، معتمد من الإدارة العليا — ثم يتعثر التبني عند النقطة التي ينتهي فيها المشروع الاستشاري رسميًا تقريبًا.

الفجوة بين "اكتمال السياسة" و"اكتمال التحول" هي عادة حيث تعيش القيمة الحقيقية لمشروع استشاري جيد، وتستحق أن تُسمّى صراحة بدلًا من افتراض أنها ستحدث من تلقاء نفسها:

**سياسة جديدة دون سلوك مدير جديد مجرد وثيقة.** إن استمر المدراء المباشرون في إجراء محادثات الأداء بالطريقة القديمة، لا يغيّر إطار أداء جديد مصمَّم بشكل جميل شيئًا للموظفين. تمكين المدراء — تدريب، توجيه، وتعزيز مبكر — يحتاج عادة ميزانية توازي تصميم الإطار نفسه، وغالبًا ما يحصل على جزء بسيط منها.

**الأنظمة تحتاج أن تعكس السياسة الجديدة فعليًا، لا مجرد تحمّلها.** نظام موارد بشرية لا يزال مُعدًّا لدورة الأداء القديمة، أو الهيكل الوظيفي القديم، أو سلسلة الموافقة القديمة يقوّض بهدوء أي سياسة جديدة كلما حاول أحد استخدامها، لأن الأداة تقاوم العملية.

**التواصل يحتاج أن يشرح "لماذا"، لا فقط يُعلن "ماذا".** الموظفون الذين يستلمون سياسة جديدة دون فهم المنطق خلفها يميلون لمعاملتها كبيروقراطية لا تحسّنًا حقيقيًا — ويتعاملون معها بناءً على ذلك، بامتثال أدنى لا انخراط فعلي.

**يحتاج أحد ما لملكية التبني بعد رحيل الاستشاريين.** مشروع تحول له تاريخ انتهاء محدد لكن دون مالك داخلي مسؤول عن استدامة التبني يميل للانجراف نحو العادات القديمة خلال عام، لأن وظيفة لا أحد تعتمد على ترسّخ الطريقة الجديدة.

تدرك الاستشارات الجيدة في الموارد البشرية هذا بشكل متزايد وتبني تخطيط التبني ضمن المشروع منذ اليوم الأول — لا كفكرة لاحقة بعد اكتمال وثيقة السياسة، بل كمُخرَج مكافئ يرافقها. السياسة ضرورية. لم تكن كافية بمفردها قط.`
  },
  {
    title: 'PMO Advisory: Diagnosing a PMO That Isn\'t Delivering Value',
    titleAr: 'استشارات مكاتب إدارة المشاريع: تشخيص مكتب لا يُقدّم قيمة',
    category: 'إدارة المشاريع والبرامج والمحافظ',
    excerpt: 'A PMO that exists but adds no visible value has an identifiable cause — usually one of four, and rarely the one people assume.',
    excerptAr: 'مكتب إدارة مشاريع موجود لكن لا يضيف قيمة ملموسة له سبب يمكن تحديده — عادة أحد أربعة أسباب، ونادرًا ما يكون الذي يفترضه الناس.',
    body: `A common request in PMO advisory work: "we have a PMO, and nobody seems to think it's helping." The instinctive response is usually to add more process — more templates, more mandatory status reports, more governance gates. That instinct is often exactly backward.

Four more likely root causes, roughly in order of how often they actually turn out to be the real issue:

**The PMO has no actual authority, only visibility.** A PMO that can see every project's status but can't influence prioritization, resourcing, or scope decisions becomes an expensive reporting function rather than a value-adding one. Project managers learn quickly that PMO input is optional, and treat it that way.

**The PMO is measuring compliance instead of outcomes.** A PMO that tracks whether project managers filled in the status report template on time, rather than whether projects are actually delivering value, optimizes for the wrong behavior — and everyone in the organization can tell the difference, even if the PMO can't.

**The PMO was designed for a different portfolio than the one it actually governs.** A heavyweight stage-gate process built for large capital projects applied uniformly to small internal initiatives creates friction disproportionate to the risk being managed — and project managers respond by working around the PMO rather than through it.

**The PMO reports too low, or too politically weak, to matter.** A PMO buried three levels below the executives actually making resourcing decisions can produce excellent analysis that never reaches anyone positioned to act on it.

Diagnosing which of these applies — usually more than one — matters more than any generic "PMO maturity model" assessment, because the fix is different in each case: more authority, different metrics, a redesigned process for the actual portfolio, or a reporting line change. Adding process on top of the wrong root cause just makes a PMO people already ignore harder to ignore correctly.`,
    bodyAr: `طلب شائع في استشارات مكاتب إدارة المشاريع: "لدينا مكتب إدارة مشاريع، ولا يبدو أن أحدًا يعتقد أنه يساعد". الاستجابة الغريزية عادة إضافة عمليات أكثر — قوالب أكثر، تقارير حالة إلزامية أكثر، بوابات حوكمة أكثر. هذه الغريزة غالبًا ما تكون معكوسة تمامًا.

أربعة أسباب جذرية أكثر احتمالًا، مرتبة تقريبًا حسب تكرار كونها السبب الحقيقي فعليًا:

**المكتب لا يملك سلطة فعلية، فقط رؤية.** مكتب يستطيع رؤية حالة كل مشروع لكن لا يستطيع التأثير في الأولويات أو الموارد أو قرارات النطاق يصبح وظيفة تقارير مكلفة لا وظيفة مضيفة للقيمة. يتعلم مديرو المشاريع بسرعة أن مدخلات المكتب اختيارية، ويتعاملون معها كذلك.

**المكتب يقيس الامتثال بدل النتائج.** مكتب يتتبع هل ملأ مديرو المشاريع قالب تقرير الحالة في الوقت المحدد، بدلًا من هل المشاريع تُقدّم قيمة فعليًا، يُحسّن السلوك الخاطئ — ويستطيع الجميع في المؤسسة ملاحظة الفرق، حتى لو لم يستطع المكتب.

**صُمم المكتب لمحفظة مختلفة عن التي يحوكمها فعليًا.** عملية بوابات مرحلية ثقيلة بُنيت لمشاريع رأسمالية كبيرة، مُطبَّقة بشكل موحد على مبادرات داخلية صغيرة، تخلق احتكاكًا غير متناسب مع المخاطر المُدارة — ويستجيب مديرو المشاريع بالعمل حول المكتب لا من خلاله.

**المكتب يرفع تقاريره لمستوى منخفض جدًا، أو ضعيف سياسيًا جدًا، ليهم.** مكتب مدفون ثلاثة مستويات تحت التنفيذيين الذين يتخذون قرارات الموارد فعليًا يمكن أن ينتج تحليلًا ممتازًا لا يصل أبدًا لمن يستطيع التصرف بناءً عليه.

تشخيص أي من هذه ينطبق — عادة أكثر من واحد — يهم أكثر من أي تقييم "نموذج نضج مكتب" عام، لأن الحل يختلف في كل حالة: سلطة أكبر، مؤشرات مختلفة، عملية مُعاد تصميمها للمحفظة الفعلية، أو تغيير خط التقرير. إضافة عمليات فوق السبب الجذري الخاطئ فقط تجعل مكتبًا يتجاهله الناس بالفعل أصعب في تجاهله بشكل صحيح.`
  },
  {
    title: 'Quality Consulting: Why "We\'re ISO Certified" Isn\'t the Same as "We\'re Ready for an Audit"',
    titleAr: 'استشارات الجودة: لماذا "نحن معتمدون ISO" ليست نفسها "نحن جاهزون للتدقيق"؟',
    category: 'نظم ومعايير الجودة',
    excerpt: 'Certification and audit-readiness drift apart quietly over time. Quality consulting engagements exist largely to close that gap before a surveillance audit finds it.',
    excerptAr: 'الاعتماد والجاهزية للتدقيق ينفصلان بهدوء مع الوقت. توجد استشارات الجودة أساسًا لسد هذه الفجوة قبل أن يكتشفها تدقيق المراقبة.',
    body: `Organizations that earned ISO certification eighteen months ago often assume they remain "audit-ready" in the interim — and are genuinely surprised when a surveillance audit surfaces gaps that weren't there at initial certification. The surprise is common, and it points to a real misunderstanding about what certification actually confirms.

Certification confirms that a quality management system existed and functioned, as documented, on the day of the audit. It says nothing about whether that system is still functioning the same way eighteen months later — and in most organizations, it isn't, quietly, for reasons that make sense at the time:

**Staff turnover erodes institutional knowledge of the system.** The employee who understood exactly why a particular control existed and how to execute it correctly may have left, and their replacement learned an approximation from a colleague rather than from the documented procedure.

**Process drift happens gradually and rarely gets flagged.** A workaround introduced during a busy period becomes the new normal without anyone updating the documented procedure to match — creating a gap between what the system says happens and what actually happens.

**New products, services, or locations often aren't folded back into the quality system properly.** A business that's grown since certification frequently has quality processes that were designed for a smaller, simpler operation, quietly under-covering newer parts of the business.

**Internal audits become a formality rather than a genuine check.** Once the pressure of the certification audit passes, internal audits can slide into confirming what everyone already assumes rather than genuinely testing whether the system still works as documented.

Quality consulting engagements focused on audit readiness — rather than the initial certification push — exist specifically to catch this drift before a surveillance auditor does. The gap between "certified" and "actually audit-ready" widens quietly and continuously; the organizations that check for it periodically, rather than only when an audit is imminent, are the ones that never get an unpleasant surprise from a finding they could have caught themselves.`,
    bodyAr: `المؤسسات التي حصلت على اعتماد ISO قبل ثمانية عشر شهرًا غالبًا ما تفترض أنها لا تزال "جاهزة للتدقيق" في هذه الأثناء — وتتفاجأ فعليًا عندما يكشف تدقيق مراقبة فجوات لم تكن موجودة عند الاعتماد الأولي. هذه المفاجأة شائعة، وتشير لسوء فهم حقيقي حول ما يؤكده الاعتماد فعليًا.

الاعتماد يؤكد أن نظام إدارة جودة كان موجودًا ويعمل، كما هو موثّق، يوم التدقيق. لا يقول شيئًا عن استمرار عمل هذا النظام بنفس الطريقة بعد ثمانية عشر شهرًا — وفي معظم المؤسسات، لا يستمر، بهدوء، لأسباب منطقية في وقتها:

**دوران الموظفين يُآكل المعرفة المؤسسية بالنظام.** الموظف الذي فهم بالضبط لماذا وُجد ضابط معيّن وكيفية تنفيذه بشكل صحيح قد يكون رحل، وتعلّم بديله تقريبًا من زميل بدل الإجراء الموثّق.

**انجراف العملية يحدث تدريجيًا ونادرًا ما يُرصد.** حل بديل أُدخل خلال فترة مزدحمة يصبح الوضع الطبيعي الجديد دون أن يُحدّث أحد الإجراء الموثّق ليطابقه — مما يخلق فجوة بين ما يقول النظام أنه يحدث وما يحدث فعليًا.

**منتجات أو خدمات أو مواقع جديدة غالبًا لا تُدمَج بشكل صحيح في نظام الجودة.** عمل نما منذ الاعتماد غالبًا ما تكون لديه عمليات جودة صُممت لعملية أصغر وأبسط، تُغطي بهدوء الأجزاء الأحدث من العمل بشكل ناقص.

**التدقيق الداخلي يصبح إجراءً شكليًا لا فحصًا حقيقيًا.** بمجرد مرور ضغط تدقيق الاعتماد، يمكن أن ينزلق التدقيق الداخلي لتأكيد ما يفترضه الجميع بالفعل بدل اختبار استمرار عمل النظام كما هو موثّق فعليًا.

توجد مشاريع استشارات الجودة التي تركّز على الجاهزية للتدقيق — لا دفعة الاعتماد الأولية — تحديدًا لرصد هذا الانجراف قبل أن يرصده مدقق المراقبة. الفجوة بين "معتمد" و"جاهز للتدقيق فعليًا" تتسع بهدوء واستمرار؛ المؤسسات التي تفحصها دوريًا، لا فقط عند اقتراب تدقيق، هي التي لا تتفاجأ أبدًا بنتيجة كان بإمكانها اكتشافها بنفسها.`
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
