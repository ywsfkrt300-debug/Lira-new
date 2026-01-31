import { Translation, ElectricityTariff } from '../types';

export const translations: Record<'ar' | 'en', Translation> = {
  ar: {
    title: "ليرتنا",
    subtitle: "محول العملات السورية وأسعار الصرف اللحظية",
    home: "الرئيسية",
    services: "الخدمات",
    converter: "محول العملات",
    calculator: "حاسبة الباقي",
    newToOld: "من جديد إلى قديم",
    oldToNew: "من قديم إلى جديد",
    amount: "المبلغ",
    result: "النتيجة",
    newLira: "ليرة جديدة",
    oldLira: "ليرة قديمة",
    totalPrice: "السعر الإجمالي",
    amountPaid: "المبلغ المدفوع",
    changeNeeded: "الباقي المستحق",
    denominations: "الفئات النقدية",
    calculate: "احسب",
    reset: "إعادة تعيين",
    marketRates: "أسعار الصرف الحية",
    loading: "جاري التحميل...",
    notes: "ملاحظات",
    cbs: "المصرف المركزي",
    blackMarket: "السوق السوداء",
    buy: "شراء",
    sell: "مبيع",
    lastUpdate: "آخر تحديث",
    from: "من",
    to: "إلى",
    aboutUs: "من نحن",
    privacyPolicy: "سياسة الخصوصية",
    contactUs: "اتصل بنا",
    aboutContent: "موقع ليرتنا هو منصة مستقلة تهدف لتسهيل العمليات المالية للمواطن السوري عبر توفير أدوات تحويل دقيقة بين فئات العملة القديمة والجديدة ومتابعة أسعار الصرف العالمية.",
    privacyTitle: "سياسة الخصوصية",
    privacyContent: [
      "في ليرتنا، خصوصيتك هي أولويتنا القصوى. تم تصميم هذه السياسة لمساعدتك على فهم كيفية تعاملنا مع البيانات.",
      "نحن لا نجمع أو نخزن أي معلومات تعريف شخصية (PII) من زوارنا. جميع الأدوات المتاحة على موقعنا، مثل محول العملات وحاسبة الباقي، تعمل بالكامل على جهازك (من جانب العميل). هذا يعني أن أي أرقام تدخلها لا تترك متصفحك أبداً ولا يتم إرسالها إلى خوادمنا.",
      "نستخدم خدمة تحليلات بسيطة (Supabase Analytics) لفهم كيفية استخدام موقعنا بشكل عام، مثل عدد الزيارات ونوع الأدوات المستخدمة. هذه البيانات مجهولة تماماً ولا ترتبط بأي فرد. هدفها الوحيد هو تحسين خدماتنا.",
      "لا نستخدم ملفات تعريف الارتباط (Cookies) لتتبعك عبر الإنترنت. قد يتم استخدام التخزين المحلي في متصفحك لحفظ تفضيلاتك، مثل اللغة أو المظهر المختار، لتحسين تجربتك عند العودة للموقع.",
      "نحن لا نشارك أي بيانات مع أطراف ثالثة، لأننا ببساطة لا نجمع أي بيانات شخصية لمشاركتها.",
      "قد يتم تحديث هذه السياسة من وقت لآخر. سنقوم بنشر أي تغييرات على هذه الصفحة."
    ],
    contactTitle: "اتصل بنا",
    contactContent: [
        "يسعدنا دائماً الاستماع إليك! سواء كان لديك سؤال، أو اقتراح لتحسين خدماتنا، أو ترغب فقط في إلقاء التحية، فإننا نرحب بتواصلك.",
        "أفضل وأسرع طريقة للتواصل معنا هي عبر منصات التواصل الاجتماعي الرسمية. فريقنا متواجد للرد على استفساراتكم وتقديم الدعم اللازم.",
        "يمكنك العثور على روابط مباشرة إلى صفحاتنا على فيسبوك، تيليجرام، واتساب، وإنستغرام في الصفحة الرئيسية للموقع. انقر على الأيقونة المناسبة للوصول إلينا.",
        "نحن نقدر ملاحظاتك ونعتبرها جزءاً أساسياً من تطوير منصة ليرتنا لتلبية احتياجاتكم بشكل أفضل."
    ],
    downloadApp: "حمل التطبيق الآن",
    directDownload: "تحميل مباشر",
    appNote: "تجربة أفضل وأسرع على هاتفك المحمول.",
    rateError: "تعذر تحميل الأسعار الحية. قد تكون هناك مشكلة في الشبكة أو في الخادم المصدر. يرجى المحاولة مرة أخرى لاحقاً.",
    homeTitle: "أسعار الصرف والعملات في سوريا اليوم",
    homeGuideTitle: "دليلك الشامل لليرة السورية",
    homeGuidePara1: "موقع ليرتنا هو وجهتك الأولى لكل ما يتعلق بالليرة السورية. نحن نقدم لك أحدث أسعار الصرف للدولار واليورو والليرة التركية وغيرها من العملات الرئيسية، مع بيانات محدثة لحظة بلحظة من السوق الموازية (السوداء) والمصرف المركزي السوري. هدفنا هو توفير الشفافية والدقة لمساعدتك في اتخاذ قرارات مالية مستنيرة.",
    homeGuidePara2: "بالإضافة إلى أسعار الصرف، يوفر ليرتنا مجموعة من الأدوات المالية المجانية والمصممة خصيصاً لتلبية احتياجات المستخدم السوري. استخدم <strong>محول العملات</strong> الخاص بنا للتحويل بسهولة بين الليرة السورية القديمة والجديدة، أو جرب <strong>حاسبة الباقي</strong> لتسهيل معاملاتك اليومية. كما يمكنك استخدام <strong>حاسبة فاتورة الكهرباء</strong> لتقدير فاتورتك الشهرية بدقة بناءً على استهلاكك ونوع اشتراكك.",
    pageTitles: {
      home: "أسعار الصرف الحية في سوريا",
      converter: "محول العملات",
      calculator: "حاسبة الباقي",
      electricity: "حاسبة الكهرباء",
      privacy: "سياسة الخصوصية",
      contact: "اتصل بنا"
    },
    metaDescriptions: {
      home: "موقع ليرتنا لمتابعة أسعار الصرف في سوريا لحظة بلحظة. حوّل العملة السورية من الجديدة إلى القديمة، احسب الباقي، واعرف قيمة فاتورة الكهرباء. دليلك المالي المجاني.",
      converter: "أداة تحويل العملات الدقيقة بين الليرة السورية القديمة والجديدة. حول المبالغ المالية بسهولة وسرعة واعرف قيمتها المحدثة.",
      calculator: "حاسبة الباقي والفئات النقدية في سوريا. أداة ذكية لحساب الباقي المستحق بدقة وتحديد الفئات النقدية اللازمة.",
      electricity: "احسب فاتورة الكهرباء في سوريا بسهولة. أداة دقيقة لمختلف أنواع الاشتراكات المنزلية والتجارية حسب التعرفة الرسمية.",
      privacy: "اطلع على سياسة الخصوصية لموقع ليرتنا. نحن نلتزم بحماية بيانات المستخدمين وخصوصيتهم الكاملة.",
      contact: "تواصل مع فريق عمل موقع ليرتنا. يسعدنا استقبال استفساراتكم ومقترحاتكم لتحسين خدماتنا.",
    },
    faq: [
        {
            question: "كم سعر الدولار اليوم في سوريا في السوق السوداء؟",
            answer: "موقع ليرتنا يقدم تحديثات لحظية لسعر صرف الدولار مقابل الليرة السورية في السوق الموازية (السوداء) والمصرف المركزي، مع عرض أسعار الشراء والمبيع."
        },
        {
            question: "هل الأسعار المعروضة في موقع ليرتنا دقيقة؟",
            answer: "نعم، نحن نعتمد على مصادر متعددة وموثوقة لتوفير أسعار صرف حية ودقيقة بأقصى قدر ممكن، مع عرض وقت آخر تحديث للبيانات بشفافية."
        },
        {
            question: "كيف يعمل محول العملات بين الليرة القديمة والجديدة؟",
            answer: "محول العملات في ليرتنا يعتمد على نسبة التحويل الرسمية، حيث أن كل 1 ليرة سورية جديدة تساوي 100 ليرة سورية قديمة. الأداة تقوم بالعملية الحسابية بشكل فوري ودقيق."
        },
        {
            question: "ما هو سعر صرف الليرة التركية مقابل الليرة السورية؟",
            answer: "يوفر موقع ليرتنا أسعار صرف محدثة لليرة التركية واليورو مقابل الليرة السورية، مع بيانات من السوق السوداء والبنك المركزي لتكون على اطلاع دائم."
        },
        {
            question: "كيف يمكن حساب فاتورة الكهرباء في سوريا؟",
            answer: "استخدم حاسبة الكهرباء في موقع ليرتنا. أدخل استهلاكك بالكيلو واط ونوع الاشتراك (منزلي، تجاري، الخ) لتحصل على تفاصيل دقيقة للفاتورة حسب الشرائح والتعرفة الرسمية."
        }
    ],
    // SEO How-to for converter
    howToConverter: {
        title: "كيفية استخدام محول العملات",
        description: "خطوات بسيطة لتحويل المبالغ بين الليرة السورية القديمة والجديدة باستخدام أداة ليرتنا.",
        steps: [
            { name: "أدخل المبلغ", text: "أدخل المبلغ الذي تريد تحويله في حقل الإدخال الأول." },
            { name: "اختر العملات", text: "حدد عملة الإدخال والإخراج (من الليرة القديمة إلى الجديدة أو العكس)." },
            { name: "شاهد النتيجة", text: "تظهر النتيجة المحولة تلقائيًا في الحقل السفلي." }
        ]
    },
    electricityCalculator: "حاسبة فاتورة الكهرباء",
    consumption: "الاستهلاك",
    kwh: "كيلو واط ساعي",
    subscriptionType: "نوع الاشتراك",
    billDetails: "تفاصيل الفاتورة",
    tier: "شريحة",
    rate: "تعرفة",
    cost: "التكلفة",
    totalBill: "إجمالي الفاتورة",
    syp: "ل.س",
    printRates: "طباعة الأسعار",
    toggleAnimationOn: "تفعيل الرسوم المتحركة",
    toggleAnimationOff: "إيقاف الرسوم المتحركة",
  },
  en: {
    title: "Liratna",
    subtitle: "Syrian Currency Converter & Live Exchange Rates",
    home: "Home",
    services: "Services",
    converter: "Currency Converter",
    calculator: "Change Calculator",
    newToOld: "New to Old",
    oldToNew: "Old to New",
    amount: "Amount",
    result: "Result",
    newLira: "New Lira",
    oldLira: "Old Lira",
    totalPrice: "Total Price",
    amountPaid: "Amount Paid",
    changeNeeded: "Change Needed",
    denominations: "Denominations",
    calculate: "Calculate",
    reset: "Reset",
    marketRates: "Live Exchange Rates",
    loading: "Loading...",
    notes: "Notes",
    cbs: "Central Bank",
    blackMarket: "Black Market",
    buy: "Buy",
    sell: "Sell",
    lastUpdate: "Last Update",
    from: "From",
    to: "To",
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    contactUs: "Contact Us",
    aboutContent: "Liratna is an independent platform aimed at facilitating financial operations for Syrian citizens by providing accurate conversion tools between old and new currency denominations.",
    privacyTitle: "Privacy Policy",
    privacyContent: [
        "At Liratna, your privacy is our top priority. This policy is designed to help you understand how we handle data.",
        "We do not collect or store any Personally Identifiable Information (PII) from our visitors. All tools on our site, such as the currency converter and change calculator, operate entirely on your device (client-side). This means any numbers you enter never leave your browser and are not sent to our servers.",
        "We use a simple analytics service (Supabase Analytics) to understand how our site is used in general, such as the number of visits and which tools are popular. This data is completely anonymous and not linked to any individual. Its sole purpose is to improve our services.",
        "We do not use cookies to track you online. Your browser's local storage may be used to save your preferences, like your chosen language or theme, to enhance your experience on return visits.",
        "We do not share any data with third parties because we simply do not collect any personal data to share.",
        "This policy may be updated from time to time. We will post any changes on this page."
    ],
    contactTitle: "Contact Us",
    contactContent: [
        "We are always happy to hear from you! Whether you have a question, a suggestion to improve our services, or just want to say hello, we welcome your communication.",
        "The best and fastest way to reach us is through our official social media platforms. Our team is available to answer your inquiries and provide necessary support.",
        "You can find direct links to our Facebook, Telegram, WhatsApp, and Instagram pages on the website's homepage. Click on the appropriate icon to get in touch.",
        "We value your feedback and consider it an essential part of developing the Liratna platform to better meet your needs."
    ],
    downloadApp: "Download The App",
    directDownload: "Direct Download",
    appNote: "A better and faster experience on your mobile phone.",
    rateError: "Could not load live rates. There might be a network issue or a problem with the source server. Please try again later.",
    homeTitle: "Currency and Exchange Rates in Syria Today",
    homeGuideTitle: "Your Comprehensive Guide to the Syrian Lira",
    homeGuidePara1: "Liratna is your premier destination for everything related to the Syrian Lira. We provide you with the latest exchange rates for the Dollar, Euro, Turkish Lira, and other major currencies, with real-time data from the parallel (black) market and the Syrian Central Bank. Our goal is to offer transparency and accuracy to help you make informed financial decisions.",
    homeGuidePara2: "In addition to exchange rates, Liratna offers a suite of free financial tools specifically designed for the needs of Syrian users. Use our <strong>Currency Converter</strong> to easily switch between the old and new Syrian Lira, or try the <strong>Change Calculator</strong> to simplify your daily transactions. You can also use the <strong>Electricity Bill Calculator</strong> to accurately estimate your monthly bill based on your consumption and subscription type.",
    pageTitles: {
      home: "Live Exchange Rates in Syria",
      converter: "Currency Converter",
      calculator: "Change Calculator",
      electricity: "Electricity Calculator",
      privacy: "Privacy Policy",
      contact: "Contact Us"
    },
    metaDescriptions: {
      home: "Liratna: Track live exchange rates in Syria. Convert Syrian currency from new to old, calculate change, and estimate your electricity bill. Your free financial guide.",
      converter: "Accurate currency converter between old and new Syrian Lira. Easily convert financial amounts and know their updated value.",
      calculator: "Change and cash denomination calculator in Syria. A smart tool to accurately calculate due change and determine necessary cash denominations.",
      electricity: "Calculate your electricity bill in Syria easily. An accurate tool for various residential and commercial subscriptions based on official tariffs.",
      privacy: "Read Liratna's privacy policy. We are committed to protecting user data and ensuring complete privacy.",
      contact: "Contact the Liratna team. We welcome your inquiries and suggestions to improve our services.",
    },
    faq: [
        {
            question: "What is the dollar exchange rate in Syria's black market today?",
            answer: "Liratna provides real-time updates for the exchange rate of the US Dollar against the Syrian Lira in both the parallel (black) market and the Central Bank, showing buy and sell prices."
        },
        {
            question: "Are the exchange rates on Liratna accurate?",
            answer: "Yes, we rely on multiple trusted sources to provide the most accurate live exchange rates possible, transparently displaying the last update time for the data."
        },
        {
            question: "How does the currency converter between old and new lira work?",
            answer: "The currency converter on Liratna uses the official conversion rate, where 1 new Syrian Lira equals 100 old Syrian Lira. The tool performs the calculation instantly and accurately."
        },
        {
            question: "What is the exchange rate for the Turkish Lira against the Syrian Lira?",
            answer: "Liratna provides updated exchange rates for the Turkish Lira and Euro against the Syrian Lira, with data from both the black market and the central bank to keep you informed."
        },
        {
            question: "How can I calculate my electricity bill in Syria?",
            answer: "Use the electricity calculator on Liratna. Enter your consumption in kWh and select your subscription type (e.g., household, commercial) to get an accurate bill breakdown based on official tariffs and tiers."
        }
    ],
    howToConverter: {
        title: "How to Use the Currency Converter",
        description: "Simple steps to convert amounts between the old and new Syrian Lira using the Liratna tool.",
        steps: [
            { name: "Enter Amount", text: "Enter the amount you want to convert in the first input field." },
            { name: "Select Currencies", text: "Select the input and output currency (from old to new Lira or vice versa)." },
            { name: "View Result", text: "The converted result appears automatically in the bottom field." }
        ]
    },
    electricityCalculator: "Electricity Bill Calculator",
    consumption: "Consumption",
    kwh: "kWh",
    subscriptionType: "Subscription Type",
    billDetails: "Bill Details",
    tier: "Tier",
    rate: "Rate",
    cost: "Cost",
    totalBill: "Total Bill",
    syp: "SYP",
    printRates: "Print Rates",
    toggleAnimationOn: "Enable Animation",
    toggleAnimationOff: "Disable Animation",
  }
};

export const ELECTRICITY_TARIFFS: ElectricityTariff[] = [
  {
    id: 'household',
    name: { ar: 'منزلي', en: 'Household' },
    type: 'tiered',
    tiers: [
      { limit: 300, price: 600 },
      { limit: null, price: 1400 }, // null limit means "and above"
    ]
  },
  { id: 'commercial', name: { ar: 'تجاري', en: 'Commercial' }, type: 'flat', rate: 1400 },
  { id: 'billboards', name: { ar: 'لوحات إعلان', en: 'Billboards' }, type: 'flat', rate: 1800 },
  { id: 'charity', name: { ar: 'جمعيات خيرية', en: 'Charities' }, type: 'flat', rate: 1400 },
  { id: 'worship', name: { ar: 'دور عبادة', en: 'Places of Worship' }, type: 'flat', rate: 1400 },
  { id: 'tourism', name: { ar: 'سياحي', en: 'Tourism' }, type: 'flat', rate: 1400 },
  { id: 'research', name: { ar: 'بحوث علمية', en: 'Scientific Research' }, type: 'flat', rate: 1400 },
  { id: 'official', name: { ar: 'دوائر رسمية', en: 'Official Depts.' }, type: 'flat', rate: 1400 },
  { id: 'public_lighting', name: { ar: 'إنارة عامة', en: 'Public Lighting' }, type: 'flat', rate: 1400 },
  { id: 'public_hospital', name: { ar: 'مشفى عام', en: 'Public Hospital' }, type: 'flat', rate: 1400 },
  { id: 'industrial', name: { ar: 'صناعي', en: 'Industrial' }, type: 'flat', rate: 1400 },
  { id: 'agricultural', name: { ar: 'زراعي', en: 'Agricultural' }, type: 'flat', rate: 1400 },
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