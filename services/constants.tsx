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
    aboutContent: "ليرتنا هو منصة خدمية مجانية تم إطلاقها بهدف تبسيط التعاملات المالية اليومية للمواطن السوري. نحن ندرك التحديات المستمرة في فهم أسعار الصرف والتعامل مع الفئات النقدية المختلفة، لذلك نقدم أدوات دقيقة ومحدثة باستمرار، من محول العملات بين القديم والجديد إلى حاسبة الفواتير، مع متابعة لحظية لأسعار الصرف من مصادر متعددة لضمان الشفافية والموثوقية.",
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
    homeGuidePara1: "موقع ليرتنا هو بوابتك الاقتصادية الأولى لمتابعة كل ما يخص الليرة السورية والمشهد المالي في سوريا. في ظل التغيرات المتسارعة، نلتزم بتزويدك بأحدث أسعار صرف الدولار، اليورو، الليرة التركية، والعملات العربية والعالمية الرئيسية. بياناتنا تُحدّث لحظة بلحظة، معتمدة على مصادر متعددة لتغطية كل من السوق الموازية (المعروفة بالسوق السوداء) والمصرف المركزي السوري، مما يضمن لك الحصول على رؤية شاملة ودقيقة. هدفنا هو تمكينك من اتخاذ قرارات مالية مدروسة وثقة، سواء كنت تتابع قيمة مدخراتك، تخطط لعملية تجارية، أو ترسل حوالات مالية.",
    homeGuidePara2: "لا يقتصر دور ليرتنا على عرض أسعار الصرف فحسب، بل نقدم لك حزمة متكاملة من الأدوات الخدمية المجانية التي صُممت لتسهيل حياتك اليومية. استخدم <strong>محول العملات</strong> المتطور للتحويل الفوري والدقيق بين الليرة السورية القديمة والجديدة، وهي أداة لا غنى عنها في المعاملات اليومية. هل تحتاج لمساعد في حساب المبالغ المعقدة؟ <strong>حاسبة الباقي</strong> الذكية تساعدك في تحديد الفئات النقدية المطلوبة وتجنب الأخطاء. كما يمكنك الآن تقدير تكاليف الطاقة مع <strong>حاسبة فاتورة الكهرباء</strong> الجديدة، والتي تمنحك تفصيلاً دقيقاً لفاتورتك بناءً على استهلاكك ونوع اشتراكك وفقاً للتعرفة الرسمية. ليرتنا أكثر من مجرد أرقام، إنه رفيقك المالي اليومي.",
    pageTitles: {
      home: "أسعار الصرف في سوريا اليوم - دولار، يورو، وتركي",
      converter: "محول العملات بين الليرة السورية القديمة والجديدة",
      calculator: "حاسبة الباقي والفئات النقدية لليرة السورية",
      electricity: "حاسبة فاتورة الكهرباء في سوريا بالتعرفة الجديدة",
      privacy: "سياسة الخصوصية وحماية البيانات لموقع ليرتنا",
      contact: "اتصل بنا | تواصل مع فريق عمل موقع ليرتنا"
    },
    metaDescriptions: {
      home: "ليرتنا: دليلك لأسعار الصرف في سوريا. احصل على تحديثات لحظية لسعر الدولار والعملات، واستخدم أدوات تحويل العملة وحساب الفواتير مجاناً.",
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
    howToConverter: {
        title: "كيفية استخدام محول العملات",
        description: "خطوات بسيطة لتحويل المبالغ بين الليرة السورية القديمة والجديدة باستخدام أداة ليرتنا.",
        steps: [
            { name: "أدخل المبلغ", text: "أدخل المبلغ الذي تريد تحويله في حقل الإدخال الأول." },
            { name: "اختر العملات", text: "حدد عملة الإدخال والإخراج (من الليرة القديمة إلى الجديدة أو العكس)." },
            { name: "شاهد النتيجة", text: "تظهر النتيجة المحولة تلقائيًا في الحقل السفلي." }
        ]
    },
    howToCalculator: {
        title: "كيفية استخدام حاسبة الباقي",
        description: "احسب الباقي المستحق بدقة وحدد الفئات النقدية اللازمة لمعاملاتك اليومية.",
        steps: [
            { name: "أدخل السعر الإجمالي", text: "اكتب المبلغ الإجمالي المطلوب دفعه في الحقل المخصص." },
            { name: "حدد المبلغ المدفوع", text: "استخدم الأزرار لإضافة الفئات النقدية التي قمت بدفعها." },
            { name: "احصل على الباقي", text: "يعرض التطبيق تلقائياً المبلغ المتبقي وتفصيلاً للفئات النقدية المقترحة للباقي." }
        ]
    },
    howToElectricity: {
        title: "كيفية استخدام حاسبة فاتورة الكهرباء",
        description: "قدّر قيمة فاتورة الكهرباء الشهرية في سوريا بناءً على استهلاكك ونوع اشتراكك.",
        steps: [
            { name: "اختر نوع الاشتراك", text: "حدد نوع الاشتراك الخاص بك من القائمة (منزلي، تجاري، إلخ)." },
            { name: "أدخل الاستهلاك", text: "اكتب إجمالي استهلاكك بالكيلو واط الساعي (kWh) في الحقل المخصص." },
            { name: "اطلع على تفاصيل الفاتورة", text: "تظهر قيمة الفاتورة الإجمالية مع تفصيل للتكلفة حسب كل شريحة استهلاك." }
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
    aboutContent: "Liratna is a free service platform launched to simplify daily financial transactions for Syrians. We understand the ongoing challenges in understanding exchange rates and dealing with different currency denominations, so we provide accurate and constantly updated tools, from an old-to-new currency converter to a bill calculator, with real-time tracking of exchange rates from multiple sources to ensure transparency and reliability.",
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
    homeGuidePara1: "Liratna is your premier economic gateway for tracking everything related to the Syrian Lira and the financial scene in Syria. Amidst rapid changes, we are committed to providing you with the latest exchange rates for the Dollar, Euro, Turkish Lira, and other major Arab and global currencies. Our data is updated moment by moment, relying on multiple sources to cover both the parallel market (known as the black market) and the Syrian Central Bank, ensuring you get a comprehensive and accurate view. Our goal is to empower you to make informed and confident financial decisions, whether you're tracking the value of your savings, planning a business transaction, or sending money transfers.",
    homeGuidePara2: "Liratna's role is not limited to displaying exchange rates; we offer you an integrated suite of free utility tools designed to simplify your daily life. Use our advanced <strong>Currency Converter</strong> for instant and accurate conversion between the old and new Syrian Lira, an indispensable tool for daily transactions. Need help with complex calculations? Our smart <strong>Change Calculator</strong> helps you determine the required cash denominations and avoid errors. You can also now estimate your energy costs with the new <strong>Electricity Bill Calculator</strong>, which provides a detailed breakdown of your bill based on your consumption and subscription type according to official tariffs. Liratna is more than just numbers; it's your daily financial companion.",
    pageTitles: {
      home: "Exchange Rates in Syria Today - USD, EUR, TRY",
      converter: "Currency Converter for Old and New Syrian Lira",
      calculator: "Change & Denomination Calculator for Syrian Lira",
      electricity: "Syria Electricity Bill Calculator - New Tariffs",
      privacy: "Privacy Policy - Liratna Data Protection",
      contact: "Contact Us | Get in Touch with the Liratna Team"
    },
    metaDescriptions: {
      home: "Liratna: Your guide to exchange rates in Syria. Get real-time updates for the dollar and other currencies, and use our free currency converter and bill calculator tools.",
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
    howToCalculator: {
        title: "How to Use the Change Calculator",
        description: "Accurately calculate the change due and identify the required denominations for your daily transactions.",
        steps: [
            { name: "Enter Total Price", text: "Type the total amount to be paid in the designated field." },
            { name: "Specify Amount Paid", text: "Use the buttons to add the cash denominations you have paid with." },
            { name: "Get the Change", text: "The app automatically displays the remaining amount and a breakdown of suggested denominations for the change." }
        ]
    },
    howToElectricity: {
        title: "How to Use the Electricity Bill Calculator",
        description: "Estimate your monthly electricity bill value in Syria based on your consumption and subscription type.",
        steps: [
            { name: "Select Subscription Type", text: "Choose your subscription type from the list (Household, Commercial, etc.)." },
            { name: "Enter Consumption", text: "Input your total consumption in kilowatt-hours (kWh) in the provided field." },
            { name: "View Bill Details", text: "The total bill value appears with a detailed breakdown of the cost per consumption tier." }
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