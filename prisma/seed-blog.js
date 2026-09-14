// Populates BlogPost records with genuine, substantive articles across
// the center's core business areas (GRC, AML, internal audit, ESG,
// PM, IT governance). Written by Claude as original editorial content
// for the platform — not claims about the company itself, so these
// are authored freely, the same way any blog contributor would write.
// Run with: npm run seed:blog

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
    title: 'GRC for Growing Organizations: Where to Start',
    titleAr: 'الحوكمة والمخاطر والامتثال للمؤسسات النامية: من أين تبدأ؟',
    category: 'إدارة المخاطر والامتثال',
    excerpt: 'Governance, risk, and compliance can feel overwhelming for a growing organization. Here is a practical, staged approach.',
    excerptAr: 'قد تبدو الحوكمة والمخاطر والامتثال مرهقة لمؤسسة في طور النمو. إليك نهجًا عمليًا ومتدرجًا للبدء.',
    body: `Most organizations don't build GRC (Governance, Risk, and Compliance) capability all at once — and they shouldn't try to. Attempting a full enterprise framework before you have the basics in place usually produces a binder nobody reads rather than a program that changes behavior.

A more practical sequence looks like this:

1. **Start with a risk register, not a framework.** List the risks that could actually hurt the business this year — operational, financial, regulatory, reputational — and rank them by likelihood and impact. This alone forces useful conversations.

2. **Assign clear ownership.** Every risk on the register needs a named owner, not a department. "IT" is not an owner; the IT manager is.

3. **Formalize the controls you already have.** Most organizations are already doing more risk management than they realize — approval chains, segregation of duties, access reviews. Document what exists before designing what's missing.

4. **Pick one recognized framework as a reference, not a cage.** COSO, ISO 31000, or a sector-specific standard can guide your structure without dictating every detail. Adapt it to your size.

5. **Report on a cadence, not just on request.** A short quarterly risk report to leadership — even three pages — builds the habit of oversight that regulators and investors both look for.

GRC maturity is a journey measured in quarters, not weeks. The organizations that succeed treat it as an operating discipline, not a compliance exercise to survive an audit.`,
    bodyAr: `لا تبني معظم المؤسسات قدرات الحوكمة والمخاطر والامتثال (GRC) دفعة واحدة — ولا ينبغي لها ذلك. محاولة تطبيق إطار مؤسسي كامل قبل إرساء الأساسيات غالبًا ما تنتج ملفًا لا يقرؤه أحد، بدلاً من برنامج يُحدث فرقًا فعليًا في السلوك.

التسلسل العملي الأكثر واقعية يكون كالتالي:

1. **ابدأ بسجل مخاطر، لا بإطار عمل كامل.** اجمع المخاطر التي قد تضر بالعمل فعليًا هذا العام — تشغيلية، مالية، تنظيمية، سمعية — ورتّبها حسب احتمالية الحدوث والأثر. هذه الخطوة وحدها تفتح نقاشات مفيدة.

2. **حدّد ملكية واضحة لكل خطر.** كل خطر في السجل يحتاج مالكًا محددًا بالاسم، لا إدارة عامة. "تقنية المعلومات" ليست مالكًا؛ مدير تقنية المعلومات هو المالك.

3. **وثّق الضوابط الموجودة فعليًا قبل كل شيء.** معظم المؤسسات تمارس إدارة مخاطر أكثر مما تدرك — سلاسل الموافقات، الفصل بين المهام، مراجعات الصلاحيات. وثّق ما هو موجود قبل تصميم ما هو ناقص.

4. **اختر إطارًا معتمدًا واحدًا كمرجع، لا كقيد.** يمكن لـ COSO أو ISO 31000 أو معيار قطاعي متخصص أن يوجّه هيكلك دون فرض كل تفصيلة. كيّفه بما يناسب حجم مؤسستك.

5. **ارفع تقاريرك بانتظام، لا عند الطلب فقط.** تقرير مخاطر ربعي موجز للإدارة العليا — حتى لو كان ثلاث صفحات — يبني عادة الرقابة التي تبحث عنها الجهات التنظيمية والمستثمرون على حد سواء.

نضج الحوكمة والمخاطر والامتثال رحلة تُقاس بالأرباع السنوية، لا بالأسابيع. المؤسسات الناجحة تتعامل معها كانضباط تشغيلي، لا كمجرد تمرين للنجاة من تدقيق.`
  },
  {
    title: 'Five AML Red Flags Every Finance Team Should Know',
    titleAr: 'خمس إشارات إنذار لمكافحة غسل الأموال يجب أن يعرفها كل فريق مالي',
    category: 'مكافحة غسل الأموال والجرائم المالية',
    excerpt: 'You don\'t need to be a compliance officer to spot suspicious activity. Here are the patterns finance teams see first.',
    excerptAr: 'لست بحاجة لأن تكون ضابط امتثال لتكتشف نشاطًا مشبوهًا. إليك الأنماط التي يلاحظها الفريق المالي أولاً.',
    body: `Anti-money laundering compliance is usually framed as a specialist function, but in practice, the finance and accounts teams are often the first to see the warning signs — long before a formal AML review ever happens.

Five patterns worth flagging immediately:

1. **Payments that don't match the invoice.** A vendor invoiced in one country but paid from an account in another, with no clear business reason, is a classic layering technique.

2. **Round-number transactions just under reporting thresholds.** Genuine business payments rarely land on suspiciously clean numbers just below a reporting limit, repeated across multiple transactions.

3. **New customers or vendors requesting unusual urgency.** Pressure to bypass standard onboarding or due diligence "just this once" is a common social-engineering tactic.

4. **Complex ownership structures with no clear commercial logic.** If you can't explain in one sentence why a counterparty needs three layers of shell entities, that's worth escalating.

5. **Cash-intensive activity inconsistent with the stated business model.** A consulting firm receiving large cash deposits, for example, doesn't match its declared operations.

None of these five, on their own, proves wrongdoing. But finance staff who know to flag them — rather than explain them away — are the first line of defense any AML program actually relies on.`,
    bodyAr: `عادة ما يُنظر إلى الامتثال لمكافحة غسل الأموال كوظيفة متخصصة، لكن في الواقع، فرق المالية والحسابات غالبًا ما تكون أول من يلاحظ علامات الإنذار — قبل وقت طويل من أي مراجعة رسمية لمكافحة غسل الأموال.

خمسة أنماط تستحق الإبلاغ الفوري:

1. **مدفوعات لا تطابق الفاتورة.** فاتورة صادرة من دولة وسداد من حساب في دولة أخرى، دون سبب تجاري واضح، هي أسلوب تمويه كلاسيكي.

2. **معاملات بأرقام مستديرة تحت حدود الإبلاغ مباشرة.** المدفوعات التجارية الحقيقية نادرًا ما تنتهي بأرقام نظيفة بشكل مريب تحت حد الإبلاغ، بشكل متكرر عبر عدة معاملات.

3. **عملاء أو موردون جدد يطلبون استعجالًا غير معتاد.** الضغط لتجاوز إجراءات التسجيل أو العناية الواجبة المعتادة "لمرة واحدة فقط" أسلوب هندسة اجتماعية شائع.

4. **هياكل ملكية معقدة دون منطق تجاري واضح.** إن لم تستطع تفسير سبب حاجة طرف مقابل لثلاث طبقات من الكيانات الوهمية في جملة واحدة، فهذا يستحق التصعيد.

5. **نشاط نقدي مكثف لا يتوافق مع نموذج العمل المُعلن.** شركة استشارات تستقبل إيداعات نقدية كبيرة، على سبيل المثال، لا تتناسب مع نشاطها المُعلن.

لا يثبت أي من هذه الأنماط الخمسة بمفرده وجود مخالفة. لكن موظفي المالية الذين يعرفون كيفية الإبلاغ عنها — بدلاً من تبريرها — هم خط الدفاع الأول الذي يعتمد عليه أي برنامج مكافحة غسل أموال فعليًا.`
  },
  {
    title: 'Building an Internal Audit Function From Scratch',
    titleAr: 'بناء وظيفة التدقيق الداخلي من الصفر',
    category: 'مكافحة الاحتيال والتحقيقات',
    excerpt: 'A first-time internal audit function doesn\'t need to be elaborate — it needs to be credible. Here\'s how to build that credibility early.',
    excerptAr: 'وظيفة التدقيق الداخلي الأولى لا تحتاج أن تكون معقدة — بل أن تكون موثوقة. إليك كيف تبني هذه الموثوقية مبكرًا.',
    body: `Organizations setting up internal audit for the first time often over-invest in structure and under-invest in credibility — and credibility is the thing that actually determines whether the function has any impact.

A few principles that matter more than the org chart:

**Report to the audit committee, not to the CFO.** Internal audit that reports into the function it's meant to oversee will eventually be asked to soften a finding. Independence isn't a formality — it's the entire value proposition.

**Start with a risk-based audit plan, not an exhaustive one.** Your first-year plan should cover the three or four areas with the highest combined likelihood and impact, not every process in the business. A focused plan that gets finished builds more trust than an ambitious one that doesn't.

**Write findings people can act on.** A finding that says "controls around vendor onboarding are weak" is less useful than one that says "37% of new vendors in Q2 were onboarded without a completed due-diligence checklist, exposing the business to X." Specificity is what turns a finding into a fix.

**Follow up — publicly.** The single biggest credibility killer for a new internal audit function is findings that quietly disappear. A simple open-items tracker, reviewed each quarter, does more for the function's reputation than any individual audit report.

Internal audit earns its seat at the table one credible, specific, followed-through finding at a time — not through the sophistication of its methodology on day one.`,
    bodyAr: `المؤسسات التي تُنشئ وظيفة التدقيق الداخلي لأول مرة غالبًا ما تفرط في الاستثمار بالهيكل التنظيمي وتقلّل من الاستثمار في المصداقية — والمصداقية هي ما يحدد فعليًا مدى تأثير هذه الوظيفة.

بعض المبادئ التي تهم أكثر من الهيكل التنظيمي نفسه:

**ارفع تقاريرك للجنة التدقيق، لا للمدير المالي.** التدقيق الداخلي الذي يرفع تقاريره للوظيفة التي يُفترض أن يراقبها سيُطلب منه في النهاية تخفيف نتيجة ما. الاستقلالية ليست شكلية — إنها جوهر القيمة المُقدَّمة بالكامل.

**ابدأ بخطة تدقيق قائمة على المخاطر، لا خطة شاملة.** يجب أن تغطي خطتك للسنة الأولى ثلاثة أو أربعة مجالات ذات أعلى احتمالية وأثر مجتمعين، لا كل عملية في المؤسسة. خطة مركّزة تُنجز تبني ثقة أكبر من خطة طموحة لا تُنجز.

**اكتب نتائج قابلة للتنفيذ.** نتيجة تقول "ضوابط تسجيل الموردين ضعيفة" أقل فائدة من نتيجة تقول "37% من الموردين الجدد في الربع الثاني تم تسجيلهم دون إكمال قائمة العناية الواجبة، مما يعرّض المؤسسة لكذا". التحديد هو ما يحوّل النتيجة إلى إصلاح فعلي.

**تابع النتائج — بشكل معلن.** أكبر قاتل للمصداقية لوظيفة تدقيق داخلي جديدة هو نتائج تختفي بهدوء. متتبّع بسيط للبنود المفتوحة، يُراجَع كل ربع سنة، يخدم سمعة الوظيفة أكثر من أي تقرير تدقيق فردي مهما كان متقنًا.

يكسب التدقيق الداخلي مكانته على طاولة القرار نتيجة موثوقة ومحددة ومُتابَعة في كل مرة — لا من خلال تعقيد منهجيته منذ اليوم الأول.`
  },
  {
    title: 'ESG Reporting Basics for Saudi Companies',
    titleAr: 'أساسيات تقارير الاستدامة (ESG) للشركات السعودية',
    category: 'إدارة المخاطر والامتثال',
    excerpt: 'ESG reporting is moving from optional to expected across the region. Here\'s a practical starting point.',
    excerptAr: 'تقارير الاستدامة تتحول من اختيارية إلى متوقعة في المنطقة. إليك نقطة بداية عملية.',
    body: `With Vision 2030 pushing sustainability higher on the national agenda, and Tadawul-listed companies facing growing ESG disclosure expectations, more organizations — including private and mid-sized ones — are being asked by banks, investors, and large customers to report on ESG performance, often for the first time.

If you're starting from zero, resist the urge to build a comprehensive report immediately. A more workable sequence:

**Environmental — start with what you already measure.** Utility bills give you energy consumption. Waste contracts give you volumes. You likely have 60% of your baseline data already sitting in existing invoices.

**Social — document what's already policy.** Saudization rates, safety incident records, and training hours are often already tracked for regulatory reasons (GOSI, Ministry of Human Resources). ESG reporting largely means presenting this data with a sustainability lens, not collecting new data.

**Governance — this is usually your strongest starting point.** Board composition, internal controls, and anti-corruption policies overlap heavily with GRC work most organizations have already begun.

**Pick a reporting framework proportional to your size.** GRI Standards are the most widely recognized starting point; full alignment with frameworks like SASB or TCFD can come later as reporting matures.

The organizations that struggle with ESG reporting are usually the ones trying to build a perfect report on the first attempt. The ones that succeed publish an honest, partial report in year one and expand its scope each year after.`,
    bodyAr: `مع دفع رؤية 2030 للاستدامة إلى مكانة أعلى في الأجندة الوطنية، وتزايد توقعات الإفصاح عن الاستدامة (ESG) للشركات المدرجة في تداول، أصبحت مؤسسات أكثر — بما فيها الخاصة والمتوسطة الحجم — تُطالَب من البنوك والمستثمرين والعملاء الكبار بالإفصاح عن أداء الاستدامة، غالبًا لأول مرة.

إن كنتم تبدأون من الصفر، قاوموا الرغبة في بناء تقرير شامل فورًا. التسلسل العملي الأنسب:

**البيئة — ابدأ بما تقيسونه بالفعل.** فواتير الخدمات تمنحكم استهلاك الطاقة. عقود النفايات تمنحكم الكميات. غالبًا لديكم 60% من بيانات خط الأساس موجودة فعليًا في الفواتير الحالية.

**الاجتماعي — وثّق ما هو سياسة قائمة بالفعل.** معدلات السعودة، وسجلات حوادث السلامة، وساعات التدريب غالبًا ما تُتابَع بالفعل لأسباب نظامية (التأمينات الاجتماعية، وزارة الموارد البشرية). الإفصاح عن الاستدامة يعني غالبًا عرض هذه البيانات بمنظور استدامة، لا جمع بيانات جديدة.

**الحوكمة — عادة ما تكون نقطة بدايتكم الأقوى.** تكوين مجلس الإدارة والضوابط الداخلية وسياسات مكافحة الفساد تتداخل بشكل كبير مع أعمال الحوكمة والمخاطر التي بدأتها معظم المؤسسات بالفعل.

**اختاروا إطار إفصاح يتناسب مع حجمكم.** معايير GRI هي نقطة البداية الأكثر شيوعًا؛ التوافق الكامل مع أطر مثل SASB أو TCFD يمكن أن يأتي لاحقًا مع نضج الإفصاح.

المؤسسات التي تواجه صعوبة في تقارير الاستدامة هي عادة تلك التي تحاول بناء تقرير مثالي من المحاولة الأولى. أما التي تنجح فتنشر تقريرًا صادقًا وجزئيًا في السنة الأولى وتوسّع نطاقه كل عام بعدها.`
  },
  {
    title: 'IT Governance and Cybersecurity: Where to Begin',
    titleAr: 'حوكمة تقنية المعلومات والأمن السيبراني: من أين تبدأ؟',
    category: 'تقنية المعلومات وأمن المعلومات والأمن السيبراني',
    excerpt: 'Cybersecurity governance doesn\'t start with tools. It starts with knowing what you\'re protecting and why.',
    excerptAr: 'حوكمة الأمن السيبراني لا تبدأ بالأدوات. تبدأ بمعرفة ما تحمونه ولماذا.',
    body: `Many organizations approach cybersecurity as a shopping list — firewalls, endpoint protection, SIEM tools — before answering a more basic question: what, specifically, are we protecting, and what happens if it's compromised?

A governance-first approach looks different:

**Start with an asset and data inventory.** You can't govern what you haven't mapped. Which systems hold customer data, financial records, or intellectual property? Most organizations are surprised by how scattered this picture is once they actually document it.

**Classify before you protect.** Not all data deserves the same level of control. A public marketing document and a customer database with national ID numbers need very different handling — treating them the same wastes budget on the former and under-protects the latter.

**Assign accountability at the leadership level, not just the IT department.** Regulatory frameworks like the NCA's Essential Cybersecurity Controls (ECC) in Saudi Arabia explicitly expect governance ownership beyond IT — including board-level awareness of cyber risk.

**Build an incident response plan before you need one.** The organizations that handle breaches well aren't the ones with the most sophisticated tools — they're the ones who know, in advance, who makes the call to disclose, who talks to regulators, and who talks to customers.

**Train people, not just systems.** A significant share of breaches still start with a phishing email or a weak password, not a sophisticated exploit. Awareness training is often the highest-return investment in the entire cybersecurity budget.

Tools matter. But they're the last step in a governance process, not the first — and organizations that skip the earlier steps usually end up with expensive tools protecting the wrong things.`,
    bodyAr: `تتعامل مؤسسات كثيرة مع الأمن السيبراني كقائمة تسوق — جدران حماية، حماية نقاط النهاية، أدوات SIEM — قبل الإجابة عن سؤال أكثر أساسية: ما الذي نحميه تحديدًا، وماذا يحدث إن تعرّض للاختراق؟

النهج القائم على الحوكمة أولاً يبدو مختلفًا:

**ابدأ بجرد الأصول والبيانات.** لا يمكنك حوكمة ما لم تُحدّده. أي الأنظمة تحمل بيانات العملاء أو السجلات المالية أو الملكية الفكرية؟ تتفاجأ معظم المؤسسات بمدى تشتت هذه الصورة عند توثيقها فعليًا.

**صنّف قبل أن تحمي.** ليست كل البيانات تستحق نفس مستوى الضبط. مستند تسويقي عام وقاعدة بيانات عملاء تحتوي أرقام هوية وطنية تحتاجان تعاملاً مختلفًا تمامًا — معاملتهما بنفس الطريقة تهدر الميزانية على الأول وتقصّر في حماية الثاني.

**حدّد المسؤولية على مستوى الإدارة العليا، لا قسم تقنية المعلومات فقط.** أطر تنظيمية مثل الضوابط الأساسية للأمن السيبراني (ECC) الصادرة عن الهيئة الوطنية للأمن السيبراني تتوقع صراحةً ملكية حوكمية تتجاوز تقنية المعلومات — بما في ذلك وعي مجلس الإدارة بمخاطر الأمن السيبراني.

**ابنِ خطة استجابة للحوادث قبل أن تحتاجها.** المؤسسات التي تتعامل جيدًا مع الاختراقات ليست تلك التي تملك أكثر الأدوات تطورًا — بل تلك التي تعرف مسبقًا من يتخذ قرار الإفصاح، ومن يتحدث مع الجهات التنظيمية، ومن يتحدث مع العملاء.

**درّب الأفراد، لا الأنظمة فقط.** لا تزال نسبة كبيرة من الاختراقات تبدأ برسالة تصيّد إلكتروني أو كلمة مرور ضعيفة، لا باستغلال تقني معقّد. التدريب على التوعية غالبًا ما يكون الاستثمار الأعلى عائدًا في ميزانية الأمن السيبراني بأكملها.

الأدوات مهمة. لكنها الخطوة الأخيرة في عملية حوكمية، لا الأولى — والمؤسسات التي تتخطى الخطوات المبكرة غالبًا ما تنتهي بأدوات باهظة تحمي الأشياء الخاطئة.`
  },
  {
    title: 'Project Portfolio Management: Doing Fewer Things, Better',
    titleAr: 'إدارة محافظ المشاريع: إنجاز أعمال أقل، بجودة أعلى',
    category: 'إدارة المشاريع والبرامج والمحافظ',
    excerpt: 'Most portfolio problems aren\'t about project management skill — they\'re about having too many projects in the first place.',
    excerptAr: 'معظم مشاكل المحافظ ليست متعلقة بمهارة إدارة المشاريع — بل بوجود عدد مشاريع أكبر مما ينبغي من الأساس.',
    body: `When project delivery consistently underperforms across an organization, the instinctive response is to invest in better project management — more training, better tools, more rigorous methodology. Often, the real problem sits one level up: portfolio management, or the lack of it.

A few signs your organization has a portfolio problem rather than a project problem:

**Every project is "high priority."** If everything is priority one, nothing is. A functioning portfolio process forces genuine trade-offs — which means saying no, or not yet, to good ideas that don't fit current capacity.

**Resources are shared across too many active initiatives.** A senior engineer allocated across six "concurrent" projects isn't actually working on six projects — they're context-switching, and every switch has a real cost the schedule doesn't show.

**Projects are approved based on who asked, not what they're worth.** Without a consistent scoring model — value, risk, strategic fit, resource cost — the loudest sponsor usually wins, regardless of the project's actual merit.

**Nobody can say, without checking three systems, how many projects are currently active.** If portfolio visibility requires a manual exercise, governance isn't actually happening in real time.

The fix isn't more project managers — it's a portfolio governance layer that decides, deliberately, which projects deserve resources this quarter, and which should wait. Organizations that make this shift often find they complete more of real value by formally starting less.`,
    bodyAr: `عندما يتراجع أداء تسليم المشاريع بشكل مستمر عبر المؤسسة، يكون الرد الغريزي هو الاستثمار في إدارة مشاريع أفضل — تدريب أكثر، أدوات أفضل، منهجية أكثر صرامة. لكن المشكلة الحقيقية غالبًا ما تكمن مستوى أعلى: إدارة المحافظ، أو غيابها.

بعض العلامات التي تشير لمشكلة محفظة لا مشكلة مشروع:

**كل مشروع "أولوية قصوى".** إن كان كل شيء أولوية أولى، فلا شيء كذلك فعليًا. عملية محفظة فعّالة تفرض مفاضلات حقيقية — أي قول "لا" أو "ليس الآن" لأفكار جيدة لا تناسب الطاقة الحالية.

**الموارد موزّعة على مشاريع نشطة أكثر من اللازم.** مهندس أول موزّع على ستة مشاريع "متزامنة" لا يعمل فعليًا على ستة مشاريع — إنه يبدّل السياق باستمرار، وكل تبديل له تكلفة حقيقية لا يُظهرها الجدول الزمني.

**تُعتمد المشاريع بناءً على من طلبها، لا على قيمتها.** دون نموذج تقييم ثابت — القيمة، المخاطر، التوافق الاستراتيجي، تكلفة الموارد — يفوز عادة الراعي الأعلى صوتًا، بغض النظر عن جدارة المشروع الفعلية.

**لا يستطيع أحد تحديد عدد المشاريع النشطة حاليًا دون مراجعة ثلاثة أنظمة.** إن كانت رؤية المحفظة تتطلب عملية يدوية، فإن الحوكمة لا تحدث فعليًا في الوقت الحقيقي.

الحل ليس مزيدًا من مديري المشاريع — بل طبقة حوكمة للمحفظة تقرر، بوعي، أي المشاريع تستحق الموارد هذا الربع، وأيها ينبغي أن ينتظر. المؤسسات التي تحدث هذا التحول غالبًا ما تُنجز قيمة حقيقية أكبر ببدء عدد أقل من المشاريع رسميًا.`
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
