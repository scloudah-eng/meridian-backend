// A dedicated article on GRC (Governance, Risk & Compliance) as an
// integrated framework — the topic introduced in the Consulting
// Overview section but not yet covered by a standalone article.
// Run with: npm run seed:blog5

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
    title: 'GRC: Why Governance, Risk, and Compliance Work Better as One System',
    titleAr: 'GRC: لماذا تعمل الحوكمة والمخاطر والامتثال بشكل أفضل كمنظومة واحدة؟',
    category: 'إدارة المخاطر والامتثال',
    excerpt: 'Most organizations run governance, risk, and compliance as three separate functions that barely talk to each other. GRC as a discipline exists because that separation has a real cost.',
    excerptAr: 'تُدير معظم المؤسسات الحوكمة والمخاطر والامتثال كثلاث وظائف منفصلة بالكاد تتواصل فيما بينها. تُبنى منهجية GRC لأن هذا الانفصال له تكلفة حقيقية.',
    body: `Walk into most organizations and ask three separate questions — who handles governance, who handles risk, and who handles compliance — and you'll often get three different names, three different reporting lines, and three different sets of spreadsheets tracking overlapping concerns. GRC (Governance, Risk, and Compliance) exists as a discipline precisely because this separation, while organizationally convenient, creates real and measurable costs.

**What each piece actually does, and where they overlap**

Governance is the structure of decision rights — who is accountable for what, how authority is delegated, and how the board oversees management. Risk management is the discipline of identifying, assessing, and responding to uncertainty that could affect objectives. Compliance is the function of meeting external and internal requirements — laws, regulations, contracts, and internal policy. On paper these are distinct. In practice, they constantly intersect: a compliance gap is a risk; a risk that materializes often traces back to a governance failure — an unclear decision right, a control nobody owned, an escalation path that didn't exist.

**What separation actually costs**

When these three functions run independently, a few predictable problems show up:

**The same risk gets assessed three times, differently.** Internal audit rates a control one way, the risk function rates the underlying exposure another way, and compliance tracks the regulatory requirement separately — three registers, three sets of numbers, none of which quite agree with each other when a board member asks a simple question.

**Controls get built to satisfy the loudest requirement, not the actual risk.** A control designed purely to close a compliance checklist item, without input from risk management on whether it addresses the underlying exposure, often satisfies the auditor without meaningfully reducing risk.

**Governance decisions get made without full risk visibility.** A strategic decision — entering a new market, launching a new product — gets approved at the governance level without the risk and compliance implications being surfaced early enough to matter, because those functions weren't in the room.

**Reporting to the board becomes three disconnected presentations** instead of one coherent picture of "here's what could go wrong, here's what we're required to do about it, and here's who's accountable for each piece."

**What integration actually looks like in practice**

GRC integration doesn't necessarily mean merging three departments into one — for most mid-sized organizations, that's neither realistic nor necessary. What it does mean, in the engagements that actually move the needle:

**A shared risk and control taxonomy.** Governance, risk, and compliance teams use the same language and the same register for describing a given exposure, so a conversation about "third-party vendor risk" means the same thing to all three functions rather than three separate definitions.

**Controls mapped once, satisfying multiple requirements simultaneously.** A well-designed control can often satisfy a regulatory requirement, mitigate an operational risk, and support a governance objective all at once — but only if someone is deliberately mapping controls across all three lenses instead of building them in isolation per function.

**One integrated reporting line to leadership and the board**, even if the underlying teams remain organizationally separate, so decision-makers see a unified picture rather than reconciling three inconsistent narratives themselves.

**Technology that supports the integration, not just the individual functions.** A GRC platform is only as useful as the shared taxonomy and process behind it — buying integrated software without doing the organizational work first typically just digitizes the disconnect rather than fixing it.

The organizations that get real value from GRC as a discipline aren't necessarily the ones with the biggest dedicated GRC department. They're the ones where governance, risk, and compliance — whoever owns each piece — are working from the same picture of what could go wrong and who's accountable for it.`,
    bodyAr: `ادخل إلى معظم المؤسسات واسأل ثلاثة أسئلة منفصلة — من يتولى الحوكمة، من يتولى المخاطر، من يتولى الامتثال — وستحصل غالبًا على ثلاثة أسماء مختلفة، وثلاثة خطوط تقارير مختلفة، وثلاث مجموعات من جداول البيانات التي تتتبع اهتمامات متداخلة. توجد منهجية GRC (الحوكمة والمخاطر والامتثال) كتخصص لأن هذا الانفصال، رغم ملاءمته التنظيمية، يخلق تكاليف حقيقية وقابلة للقياس.

**ما تفعله كل وظيفة فعليًا، وأين تتداخل**

الحوكمة هي هيكل حقوق اتخاذ القرار — من المسؤول عن ماذا، كيف تُفوَّض الصلاحية، وكيف يشرف مجلس الإدارة على الإدارة التنفيذية. إدارة المخاطر هي تخصص تحديد وتقييم والاستجابة لعدم اليقين الذي قد يؤثر على الأهداف. الامتثال هو وظيفة تلبية المتطلبات الخارجية والداخلية — القوانين، الأنظمة، العقود، والسياسة الداخلية. على الورق، هذه أمور متمايزة. عمليًا، تتقاطع باستمرار: فجوة الامتثال هي مخاطرة؛ والمخاطرة التي تتحقق غالبًا ما يعود أصلها لفشل حوكمي — حق قرار غير واضح، ضابط لم يمتلكه أحد، مسار تصعيد لم يكن موجودًا.

**ما تكلفه هذا الانفصال فعليًا**

عندما تعمل هذه الوظائف الثلاث بشكل مستقل، تظهر بعض المشاكل المتوقعة:

**تُقيَّم نفس المخاطرة ثلاث مرات، بشكل مختلف.** يُقيّم التدقيق الداخلي ضابطًا بطريقة، وتُقيّم وظيفة المخاطر التعرّض الأساسي بطريقة أخرى، ويتتبع الامتثال المتطلب التنظيمي بشكل منفصل — ثلاثة سجلات، ثلاث مجموعات أرقام، لا تتفق تمامًا عندما يسأل أحد أعضاء المجلس سؤالًا بسيطًا.

**تُبنى الضوابط لإرضاء أعلى المتطلبات صوتًا، لا المخاطرة الفعلية.** ضابط مصمم فقط لإغلاق بند في قائمة تدقيق الامتثال، دون مدخلات من إدارة المخاطر حول ما إذا كان يعالج التعرض الأساسي، غالبًا ما يُرضي المدقق دون تقليل المخاطرة بشكل جوهري.

**تُتخذ قرارات الحوكمة دون رؤية كاملة للمخاطر.** قرار استراتيجي — دخول سوق جديد، إطلاق منتج جديد — يُعتمد على مستوى الحوكمة دون أن تُطرح تداعياته على المخاطر والامتثال مبكرًا بما يكفي ليكون له تأثير، لأن تلك الوظائف لم تكن في الغرفة.

**يصبح رفع التقارير لمجلس الإدارة ثلاثة عروض تقديمية منفصلة** بدل صورة واحدة متماسكة عن "إليك ما قد يحدث خطأ، وإليك ما هو مطلوب منا حياله، وإليك من المسؤول عن كل جزء."

**كيف يبدو التكامل فعليًا في الممارسة**

لا يعني تكامل GRC بالضرورة دمج ثلاث إدارات في واحدة — بالنسبة لمعظم المؤسسات متوسطة الحجم، هذا ليس واقعيًا ولا ضروريًا. ما يعنيه فعليًا، في المشاريع التي تُحدث فرقًا حقيقيًا:

**تصنيف مشترك للمخاطر والضوابط.** تستخدم فرق الحوكمة والمخاطر والامتثال نفس اللغة ونفس السجل لوصف تعرّض معيّن، بحيث تعني محادثة عن "مخاطر الموردين الخارجيين" نفس الشيء لكل الوظائف الثلاث بدل ثلاثة تعريفات منفصلة.

**ضوابط تُخطَّط مرة واحدة، تُلبّي متطلبات متعددة في آن واحد.** يمكن لضابط مصمَّم جيدًا أن يُلبّي متطلبًا تنظيميًا، ويخفف مخاطرة تشغيلية، ويدعم هدفًا حوكميًا في آن واحد — لكن فقط إذا كان أحدهم يخطط الضوابط عمدًا عبر العدسات الثلاث بدل بنائها بمعزل عن بعضها لكل وظيفة.

**خط تقارير واحد متكامل للإدارة العليا ومجلس الإدارة**، حتى لو ظلت الفرق الأساسية منفصلة تنظيميًا، بحيث يرى صنّاع القرار صورة موحّدة بدل التوفيق بين ثلاث روايات متضاربة بأنفسهم.

**تقنية تدعم التكامل، لا الوظائف الفردية فقط.** منصة GRC مفيدة بقدر التصنيف المشترك والعملية خلفها — شراء برمجيات متكاملة دون القيام بالعمل التنظيمي أولًا عادة ما يُرقمن الانفصال بدل إصلاحه.

المؤسسات التي تحصل على قيمة حقيقية من GRC كتخصص ليست بالضرورة تلك التي لديها أكبر إدارة GRC مخصصة. إنها تلك التي تعمل فيها الحوكمة والمخاطر والامتثال — أيًا كان من يملك كل جزء — من نفس الصورة لما قد يحدث خطأ ومن المسؤول عنه.`
  }
];

async function main() {
  const author = await prisma.user.findUnique({ where: { email: 'admin@lltc.sa' } });
  if (!author) {
    console.error('Admin account (admin@lltc.sa) not found — run the email backfill script first.');
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
