import { Translation, ElectricityTariff } from './types';

export const translations: Record<'ar' | 'en', Translation> = {
  ar: {
    title: "ليرتنا",
    subtitle: "أسعار العملات في سوريا وأدوات مالية ذكية",
    home: "الرئيسية",
    services: "خدماتنا",
    converter: "محول الليرة (قديم/جديد)",
    calculator: "حاسبة الباقي الذكية",
    newToOld: "من عملة جديدة إلى قديمة",
    oldToNew: "من عملة قديمة إلى جديدة",
    amount: "المبلغ",
    result: "القيمة المحولة",
    newLira: "ل.س جديدة",
    oldLira: "ل.س قديمة",
    totalPrice: "قيمة الفاتورة",
    amountPaid: "المبلغ المدفوع",
    changeNeeded: "الباقي للزبون",
    denominations: "توزيع الفئات النقدية",
    calculate: "احسب",
    reset: "مسح البيانات",
    marketRates: "نشرة أسعار الصرف",
    loading: "جاري جلب الأسعار...",
    notes: "تنويهات",
    cbs: "نشرة المصرف المركزي",
    blackMarket: "أسعار السوق الموازية",
    buy: "سعر الشراء",
    sell: "سعر المبيع",
    lastUpdate: "تحديث",
    from: "من عملة",
    to: "إلى عملة",
    aboutUs: "عن ليرتنا",
    privacyPolicy: "الخصوصية",
    contactUs: "تواصل معنا",
    api: "API للمطورين",
    aboutContent: "موقع ليرتنا (Liratna) هو المنصة الرقمية الأولى في سوريا التي تجمع بين دقة أسعار الصرف (الدولار، اليورو، الذهب) وبين الأدوات الخدمية التي يحتاجها المواطن يومياً. نقدم حلولاً تقنية لمشاكل العملة القديمة والجديدة، وحساب فواتير الكهرباء المعقدة، كل ذلك مجاناً وبدون إعلانات مزعجة. هدفنا رفع الوعي المالي وتسهيل حياة السوريين.",
    privacyTitle: "سياسة الخصوصية والأمان",
    privacyContent: [
      "في ليرتنا، نؤمن بأن البيانات المالية أمر حساس للغاية. لذا، صممنا موقعنا ليعمل بأقصى درجات الخصوصية.",
      "1. لا تخزين للبيانات: جميع العمليات الحسابية (التحويل، حاسبة الكهرباء) تتم محلياً على هاتفك أو حاسوبك. لا نرسل أي أرقام تدخلها إلى خوادمنا.",
      "2. التحليلات المجهولة: نستخدم أدوات تحليل بسيطة لمعرفة الصفحات الأكثر زيارة فقط، دون معرفة هوية الزائر أو موقعه الدقيق.",
      "3. ملفات الارتباط (Cookies): نستخدمها فقط لحفظ تفضيلاتك (مثل الوضع الليلي أو اللغة) لراحتك عند العودة للموقع.",
      "نحن ملتزمون بتقديم خدمة نزيهة وشفافة، خالية من أي برمجيات تتبع خبيثة."
    ],
    contactTitle: "فريق ليرتنا بخدمتكم",
    contactContent: [
        "رأيكم هو البوصلة التي توجهنا. إذا كان لديكم أي اقتراح لإضافة ميزة جديدة، أو واجهتم مشكلة في عرض الأسعار، لا تترددوا بالتواصل.",
        "نحن متواجدون على مدار الساعة عبر قنوات التواصل الاجتماعي لنقل نبض الشارع وأسعار السوق بدقة.",
        "يمكنكم مراسلتنا مباشرة عبر الروابط الموجودة أسفل الصفحة (واتساب، تيليجرام، فيسبوك).",
        "ليرتنا .. منكم وإليكم."
    ],
    downloadApp: "تطبيق ليرتنا",
    directDownload: "تحميل APK",
    appNote: "قريباً على المتاجر الرسمية.",
    rateError: "تعذر الاتصال بخادم الأسعار. يرجى التحقق من الإنترنت، سنعاود المحاولة تلقائياً.",
    homeTitle: "سعر الدولار والعملات في سوريا الآن",
    homeGuideTitle: "الدليل الاقتصادي الشامل للسوريين",
    homeGuidePara1: "هل تبحث عن **سعر الدولار اليوم في سوريا**؟ موقع ليرتنا يقدم لك الإجابة الأدق والأسرع. نحن نراقب حركة السوق السوداء (الموازية) ونشرة الحوالات والصرافة من **المصرف المركزي السوري** لحظة بلحظة. لا داعي للتشتت بين الصفحات؛ هنا تجد سعر اليورو، الليرة التركية، الريال السعودي، والذهب، في جدول واحد محدث وتفاعلي.",
    homeGuidePara2: "ليرتنا ليس مجرد لوحة أسعار؛ إنه مساعدك الشخصي. هل تعاني عند التعامل بالفئات النقدية؟ استخدم <a href=\"#converter\" class=\"text-emerald-600 dark:text-emerald-400 hover:underline font-bold\">محول الليرة السورية</a> للتنقل بين القديم والجديد بضغطة زر. هل تريد معرفة قيمة فاتورتك بدقة؟ <a href=\"#electricity\" class=\"text-emerald-600 dark:text-emerald-400 hover:underline font-bold\">حاسبة فاتورة الكهرباء 2025</a> تحسب لك التكلفة حسب الشرائح الجديدة فوراً. بالإضافة إلى <a href=\"#calculator\" class=\"text-emerald-600 dark:text-emerald-400 hover:underline font-bold\">حاسبة الباقي</a> التي تضمن حقك عند الشراء. موقع ليرتنا هو رفيقك المالي الذكي في سوريا.",
    mainNavigation: "تصفح الموقع",
    pageTitles: {
      home: "سعر الدولار اليوم في سوريا | تحديث لحظي للسوق السوداء والمركزي",
      converter: "محول الليرة السورية (قديم - جديد) | أداة تحويل العملة الدقيقة",
      calculator: "حاسبة الباقي والفئات النقدية | أدوات مالية سورية",
      electricity: "حاسبة فاتورة الكهرباء في سوريا 2025 | حساب التكلفة حسب الشرائح",
      privacy: "سياسة الخصوصية | موقع ليرتنا",
      contact: "اتصل بنا | فريق موقع ليرتنا",
      api: "API للمطورين | وثائق الواجهة البرمجية لموقع ليرتنا"
    },
    metaDescriptions: {
      home: "حصرياً: سعر الدولار في سوريا لحظة بلحظة من السوق السوداء والمركزي. اكتشف أدواتنا المجانية: حاسبة الكهرباء، ومحول العملة السورية. موقع ليرتنا - دليلك الموثوق.",
      converter: "أداة ذكية لتحويل العملة السورية من الفئات القديمة إلى الجديدة والعكس. دقة متناهية وسرعة في الحساب. جرب محول ليرتنا الآن.",
      calculator: "تخلص من حيرة حساب الباقي! حاسبة ليرتنا تساعدك في معرفة الفئات النقدية المستحقة بدقة عند البيع والشراء في سوريا.",
      electricity: "احسب قيمة فاتورة الكهرباء المنزلية والتجارية في سوريا وفق التعرفة الجديدة لعام 2025. اعرف شريحتك وتكلفة الكيلو واط بدقة.",
      privacy: "تعرف على كيفية حماية موقع ليرتنا لبياناتك. نحن نضمن خصوصية تامة وعدم تخزين لأي معلومات مالية.",
      contact: "تواصل مع فريق ليرتنا لأي استفسار حول أسعار الصرف أو الأدوات المالية. نحن هنا لخدمتكم.",
      api: "وثائق API الرسمية لموقع ليرتنا. تعلم كيفية الوصول إلى أسعار الصرف، تحويل العملات، وحساب فواتير الكهرباء برمجياً."
    },
    faq: [
        {
            question: "كم سعر الدولار اليوم في دمشق؟",
            answer: "يختلف السعر لحظياً. يقدم موقع ليرتنا تحديثاً مباشراً لسعر الدولار في دمشق وحلب وباقي المحافظات ضمن جدول 'السوق الموازية' في الصفحة الرئيسية."
        },
        {
            question: "كيف أحسب فاتورة الكهرباء في سوريا 2025؟",
            answer: "ببساطة، ادخل إلى قسم 'حاسبة الكهرباء' في موقع ليرتنا، اختر نوع عدادك (منزلي/تجاري)، وسجل رقم الاستهلاك؛ سيقوم الموقع بحساب القيمة مع الرسوم والشرائح فوراً."
        },
        {
            question: "ما الفرق بين الليرة القديمة والجديدة في التحويل؟",
            answer: "حسابياً، كل 1 ليرة جديدة تعادل 100 ليرة قديمة. أداة 'محول العملات' لدينا تقوم بهذه العملية تلقائياً لتسهيل قراءة الأرقام الكبيرة."
        },
        {
            question: "هل يعرض الموقع سعر تصريف الحوالات؟",
            answer: "نعم، نعرض سعر نشرة الحوالات والصرافة الصادرة عن مصرف سوريا المركزي، بالإضافة لسعر السوق، لتختار الطريقة الأنسب لك."
        }
    ],
    howToConverter: {
        title: "طريقة تحويل العملة السورية",
        description: "دليل سريع لاستخدام محول ليرتنا للعملات.",
        steps: [
            { name: "تحديد العملة", text: "اختر ما إذا كنت تريد التحويل من (قديم) أو (جديد)." },
            { name: "إدخال الرقم", text: "اكتب المبلغ في الخانة المخصصة." },
            { name: "النتيجة الفورية", text: "سيظهر المبلغ المقابل فوراً دون الحاجة لضغط أي زر." }
        ]
    },
    howToCalculator: {
        title: "كيف تحسب الباقي بدقة؟",
        description: "استخدم حاسبة ليرتنا لتجنب الأخطاء المالية.",
        steps: [
            { name: "قيمة الفاتورة", text: "سجل المبلغ المطلوب دفعه." },
            { name: "ما تم دفعه", text: "اضغط على صور العملات التي أعطاك إياها الزبون." },
            { name: "الباقي", text: "شاهد المبلغ الواجب إعادته وتوزيع الفئات النقدية المقترحة." }
        ]
    },
    howToElectricity: {
        title: "خطوات حساب فاتورة الكهرباء السورية",
        description: "اعرف قيمة فاتورتك قبل الدفع.",
        steps: [
            { name: "نوع الاشتراك", text: "اختر (منزلي) لأغلب البيوت، أو (تجاري) للمحلات." },
            { name: "كمية الاستهلاك", text: "ضع الرقم الذي ظهر على الساعة (بالكيلو واط)." },
            { name: "التفاصيل", text: "راجع الجدول التفصيلي لتعرف كيف تم حساب التكلفة لكل شريحة." }
        ]
    },
    electricityCalculator: "حاسبة الكهرباء 2025",
    consumption: "كمية الاستهلاك",
    kwh: "كيلو واط (K.W.H)",
    subscriptionType: "نوع العداد/الاشتراك",
    billDetails: "تفصيل الفاتورة والرسوم",
    tier: "الشريحة",
    rate: "سعر الكيلو",
    cost: "القيمة",
    totalBill: "إجمالي الدفع",
    syp: "ل.س",
    printRates: "طباعة النشرة",
    toggleAnimationOn: "تشغيل الخلفية",
    toggleAnimationOff: "إيقاف الخلفية",
  },
  en: {
    title: "Liratna",
    subtitle: "Syria Exchange Rates & Financial Tools",
    home: "Home",
    services: "Tools",
    converter: "Currency Converter",
    calculator: "Change Calculator",
    newToOld: "New to Old Currency",
    oldToNew: "Old to New Currency",
    amount: "Amount",
    result: "Converted Value",
    newLira: "New SYP",
    oldLira: "Old SYP",
    totalPrice: "Bill Amount",
    amountPaid: "Cash Given",
    changeNeeded: "Change Due",
    denominations: "Cash Breakdown",
    calculate: "Calculate",
    reset: "Clear",
    marketRates: "Exchange Rates",
    loading: "Fetching Rates...",
    notes: "Notices",
    cbs: "Central Bank Rates",
    blackMarket: "Black Market Rates",
    buy: "Buy",
    sell: "Sell",
    lastUpdate: "Updated",
    from: "From",
    to: "To",
    aboutUs: "About Liratna",
    privacyPolicy: "Privacy",
    contactUs: "Contact",
    api: "Developer API",
    aboutContent: "Liratna is Syria's premier digital platform combining accurate exchange rate tracking (USD, Euro, Gold) with essential daily utility tools. We offer technical solutions for the old/new currency confusion and complex electricity bill calculations, all for free and ad-free. Our goal is to enhance financial literacy and simplify life for Syrians.",
    privacyTitle: "Privacy & Security Policy",
    privacyContent: [
        "At Liratna, we believe financial data is sensitive. We designed our site with privacy-first architecture.",
        "1. No Data Storage: All calculations (Converter, Electricity) happen locally on your device. We never send your input numbers to our servers.",
        "2. Anonymous Analytics: We use simple analytics to track page popularity only, without identifying users or precise locations.",
        "3. Cookies: Used solely to remember your preferences (like Dark Mode or Language) for your convenience.",
        "We are committed to providing an honest, transparent service free from malicious tracking."
    ],
    contactTitle: "Liratna Team Support",
    contactContent: [
        "Your feedback guides us. If you have suggestions for new features or spot a rate discrepancy, please reach out.",
        "We are available 24/7 on social media channels to convey accurate market pulses.",
        "Message us directly via the links at the bottom of the page (WhatsApp, Telegram, Facebook).",
        "Liratna.. For you, from you."
    ],
    downloadApp: "Liratna App",
    directDownload: "Download APK",
    appNote: "Coming soon to official stores.",
    rateError: "Connection to rate server failed. Checking network...",
    homeTitle: "USD & Currency Rates in Syria Now",
    homeGuideTitle: "Comprehensive Syrian Economic Guide",
    homeGuidePara1: "Looking for the **USD rate in Syria today**? Liratna gives you the most accurate answer. We monitor the parallel (Black) market and **Central Bank of Syria** remittance bulletins moment by moment. No need to check multiple sources; find Euro, Turkish Lira, Saudi Riyal, and Gold rates in one interactive, updated table.",
    homeGuidePara2: "Liratna is more than a rate board; it's your personal assistant. Struggling with cash denominations? Use the <a href=\"#converter\" class=\"text-emerald-600 dark:text-emerald-400 hover:underline font-bold\">Syrian Lira Converter</a> to switch between old and new values instantly. Need to check your bill? The <a href=\"#electricity\" class=\"text-emerald-600 dark:text-emerald-400 hover:underline font-bold\">2025 Electricity Calculator</a> computes costs based on new tiers. Plus, the <a href=\"#calculator\" class=\"text-emerald-600 dark:text-emerald-400 hover:underline font-bold\">Change Calculator</a> ensures you get the right change. Liratna is your smart financial companion in Syria.",
    mainNavigation: "Site Navigation",
    pageTitles: {
      home: "USD Rate in Syria Today | Live Black Market & Central Bank",
      converter: "Syrian Lira Converter (Old/New) | Accurate Currency Tool",
      calculator: "Change & Cash Calculator | Syrian Financial Tools",
      electricity: "Syria Electricity Bill Calculator 2025 | New Tariffs",
      privacy: "Privacy Policy | Liratna",
      contact: "Contact Us | Liratna Team",
      api: "Developer API | Liratna API Documentation"
    },
    metaDescriptions: {
      home: "Exclusive: Live USD rates in Syria from Black Market and Central Bank. Discover our free tools: Electricity Calculator, Lira Converter. Liratna - Your trusted guide.",
      converter: "Smart tool to convert Syrian currency between old and new denominations. Extreme accuracy and speed. Try Liratna Converter now.",
      calculator: "Stop guessing the change! Liratna Calculator helps you calculate due change and cash denominations accurately for buying and selling in Syria.",
      electricity: "Calculate residential and commercial electricity bills in Syria according to the new 2025 tariffs. Know your tier and kWh cost accurately.",
      privacy: "Learn how Liratna protects your data. We guarantee complete privacy and zero storage of financial information.",
      contact: "Contact Liratna team for inquiries about exchange rates or financial tools. We are here to serve you.",
      api: "Official API documentation for Liratna. Learn how to programmatically access exchange rates, currency conversions, and electricity bill calculations."
    },
    faq: [
        {
            question: "What is the dollar rate in Damascus today?",
            answer: "Rates fluctuate instantly. Liratna provides live updates for USD in Damascus, Aleppo, and other governorates in the 'Parallel Market' table."
        },
        {
            question: "How to calculate Syria electricity bill 2025?",
            answer: "Simply go to 'Electricity Calculator' on Liratna, choose your meter type (Household/Commercial), enter consumption, and get the instant cost breakdown."
        },
        {
            question: "Difference between Old and New Lira in conversion?",
            answer: "Mathematically, 1 New Lira = 100 Old Lira. Our 'Currency Converter' tool handles this automatically to simplify reading large numbers."
        },
        {
            question: "Do you show remittance exchange rates?",
            answer: "Yes, we display the Remittance & Exchange Bulletin from the Central Bank of Syria alongside market rates so you can choose the best option."
        }
    ],
    howToConverter: {
        title: "How to Convert Syrian Currency",
        description: "Quick guide to using Liratna currency tool.",
        steps: [
            { name: "Select Currency", text: "Choose if you are converting from (Old) or (New)." },
            { name: "Enter Amount", text: "Type the value in the input field." },
            { name: "Instant Result", text: "See the converted amount immediately without pressing any buttons." }
        ]
    },
    howToCalculator: {
        title: "How to Calculate Change Accurately?",
        description: "Use Liratna calculator to avoid financial errors.",
        steps: [
            { name: "Bill Value", text: "Enter the total amount to pay." },
            { name: "Cash Paid", text: "Tap the currency icons given by the customer." },
            { name: "The Change", text: "View the return amount and suggested cash breakdown." }
        ]
    },
    howToElectricity: {
        title: "Steps to Calculate Syrian Electricity Bill",
        description: "Know your bill value before paying.",
        steps: [
            { name: "Subscription Type", text: "Select (Household) for homes or (Commercial) for shops." },
            { name: "Consumption", text: "Enter the number from your meter (in kWh)." },
            { name: "Details", text: "Review the detailed table to see cost per tier." }
        ]
    },
    electricityCalculator: "Electricity Calc 2025",
    consumption: "Consumption Amount",
    kwh: "kWh",
    subscriptionType: "Meter/Sub Type",
    billDetails: "Bill Breakdown & Fees",
    tier: "Tier",
    rate: "Price/kWh",
    cost: "Value",
    totalBill: "Total Due",
    syp: "SYP",
    printRates: "Print Rates",
    toggleAnimationOn: "Enable BG",
    toggleAnimationOff: "Disable BG",
  }
};

export const ELECTRICITY_TARIFFS: ElectricityTariff[] = [
  {
    id: 'household',
    name: { ar: 'منزلي (دورة واحدة)', en: 'Household' },
    type: 'tiered',
    tiers: [
      { limit: 300, price: 600 },
      { limit: null, price: 1400 }, // null limit means "and above"
    ]
  },
  { id: 'commercial', name: { ar: 'تجاري وحرفي', en: 'Commercial' }, type: 'flat', rate: 1400 },
  { id: 'billboards', name: { ar: 'لوحات إعلان', en: 'Billboards' }, type: 'flat', rate: 1800 },
  { id: 'charity', name: { ar: 'جمعيات خيرية', en: 'Charities' }, type: 'flat', rate: 1400 },
  { id: 'worship', name: { ar: 'دور عبادة', en: 'Places of Worship' }, type: 'flat', rate: 1400 },
  { id: 'tourism', name: { ar: 'سياحي وفنادق', en: 'Tourism' }, type: 'flat', rate: 1400 },
  { id: 'research', name: { ar: 'بحوث علمية', en: 'Scientific Research' }, type: 'flat', rate: 1400 },
  { id: 'official', name: { ar: 'دوائر رسمية', en: 'Official Depts.' }, type: 'flat', rate: 1400 },
  { id: 'public_lighting', name: { ar: 'إنارة عامة', en: 'Public Lighting' }, type: 'flat', rate: 1400 },
  { id: 'public_hospital', name: { ar: 'مشفى عام', en: 'Public Hospital' }, type: 'flat', rate: 1400 },
  { id: 'industrial', name: { ar: 'صناعي', en: 'Industrial' }, type: 'flat', rate: 1400 },
  { id: 'agricultural', name: { ar: 'زراعي وري', en: 'Agricultural' }, type: 'flat', rate: 1400 },
];

export const MAINTENANCE_MESSAGES: string[] = [
  "نحن نعمل على تحسين تجربتكم. سنعود قريباً.",
  "نقوم ببعض التحديثات الهامة. شكراً لصبركم.",
  "الموقع في استراحة قصيرة للتحسينات. نراكم بعد قليل!",
  "نعتذر عن الإزعاج، الصيانة ضرورية لخدمتكم بشكل أفضل.",
  "خبراؤنا يعملون الآن لجعل الموقع أسرع وأفضل.",
  "لحظات ونعود بنسخة محسنة. شكراً لتفهمكم.",
  "تحديثات جديدة في الطريق! الموقع سيعود للعمل قريباً.",
  "نحن نعتني ببعض الأمور التقنية. لن نطيل الغياب.",
  "صيانة دورية لضمان أفضل أداء. نقدر انتظاركم.",
  "الموقع غير متاح مؤقتاً. نعمل على إعادة الخدمة بأسرع وقت.",
  "نقوم بترقية خوادمنا لخدمة أسرع. دقائق ونعود.",
  "استراحة محارب! نعود قريباً بميزات جديدة.",
  "بعض السحر يحدث في الكواليس. ترقبوا!",
  "نحن نُلمّع كل زاوية في الموقع. انتظرونا.",
  "التطوير مستمر، والصيانة جزء منه. شكراً لثقتكم.",
  "نعمل على إصلاح بعض الأعطال الصغيرة. لن نتأخر.",
  "نعتذر، الموقع في وضع الصيانة المجدولة.",
  "تحسينات أمنية قيد التنفيذ. أمانكم أولويتنا.",
  "نحن نجهز لكم مفاجآت! انتظرونا قليلاً.",
  "الموقع يعود بعد قليل بحلة جديدة وأداء أقوى.",
  "فنجان قهوة ونعود. شكراً على صبركم الجميل."
];