import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en' | 'ar';
export type Currency = 'FCFA' | 'EUR' | 'USD' | 'DZD' | 'TND';
export type ThemeMode = 'dark' | 'light';

// Conversion rates relative to 1 FCFA
const EXCHANGE_RATES: Record<Currency, { rate: number; symbol: string; position: 'before' | 'after' }> = {
  FCFA: { rate: 1, symbol: 'FCFA', position: 'after' },
  EUR: { rate: 1 / 655.957, symbol: '€', position: 'after' },
  USD: { rate: 1 / 600, symbol: '$', position: 'before' },
  DZD: { rate: 145 / 655.957, symbol: 'DZD', position: 'after' },
  TND: { rate: 3.35 / 655.957, symbol: 'TND', position: 'after' },
};

// Comprehensive dictionary of translations
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    venue: 'Hôtel Novotel Dakar, Sénégal',
    dates: '27 & 28 Novembre 2026',
    hours: '08h30 - 18h30 GMT',
    infoline: '+221 76 420 52 16',
    selectLanguage: 'Langue',
    selectCurrency: 'Devise',
    waChannel: 'Chaîne WhatsApp Dakar 2026',
    themeDark: 'Mode Sombre 🌙',
    themeLight: 'Mode Doux ☀️',

    navHome: 'Accueil',
    navPricing: 'Offres & Stands',
    navMatchmaking: 'Matchmaking B2B',
    navJobs: 'Recrutement RH',
    navHosted: 'Hosted Buyers VIP',
    navFaq: 'FAQ & Infos Pratiques',
    navMeetings: 'Mes RDV',
    navDayPass: 'Badge & Jour J',
    navAdmin: 'Organisateur',
    navLogin: 'Connexion',
    navRegister: 'Inscription',
    navPass: 'Badge QR',
    navProfile: 'Profil',

    heroBadgeVenue: '📍 27 & 28 Novembre 2026 · Hôtel Novotel Dakar, Sénégal',
    heroBadgeType: '🏆 Salon B2B Professionnel HORECA',
    heroTitle: 'HORECA Africa Business Week 2026',
    heroSubtitle: 'Le rendez-vous B2B des décideurs HORECA en Afrique. Exposez au cœur de l\'hospitalité et développez votre business sur les marchés africains.',
    btnExplorerMatchmaking: 'Explorer le Matchmaking B2B',
    btnJobDating: 'Job Dating & Recrutement RH',
    btnTarifs: 'Tarifs & Formules d\'Exposition',
    btnSimulateur: 'Calculateur de Budget Exposant',
    btnHostedBuyers: 'Programme Hosted Buyers VIP',

    statMeetings: 'Rendez-vous B2B pré-planifiés',
    statDecideurs: 'Décideurs Qualifiés',
    statExposants: 'Exposants & Marques',
    statDiplomes: 'Jeunes Diplômés Talentueux',
    statHosted: 'Hosted Buyers VIP',
    statSpeakers: 'Speakers & Intervenants',

    pillarsTitle: 'Les 3 Piliers du Salon HORECA Africa',
    pillar1Title: '1. Hôtellerie & Hébergement',
    pillar1Desc: 'Fournisseurs d\'équipements hôteliers, linge de maison, aménagement d\'intérieur, solutions de gestion PMS/ERP, sécurité et services aux hébergements.',
    pillar2Title: '2. Restauration & Gastronomie',
    pillar2Desc: 'Matériel de cuisine professionnelle, agroalimentaire, boissons, café, solutions CHR, emballages écologiques et arts de la table.',
    pillar3Title: '3. Recrutement RH & Tourisme',
    pillar3Desc: 'Job Dating spécialisé, instituts de formation HORECA, agences de voyage, promotion touristique et accompagnement des talents.',

    pricingTitle: 'Formules d\'Exposition & Passes 2026',
    pricingSubtitle: 'Réservez votre stand d\'exposition au cœur de l\'Hôtel Novotel Dakar pour présenter vos produits et signer des contrats avec des acheteurs qualifiés.',
    standDecouverte: 'Stand Découverte 6m²',
    standBusiness: 'Stand Business 9m²',
    standPremium: 'Stand Premium 12m²',
    standPrestige: 'Stand Prestige 18m²',
    passPro: 'Pass Visiteur Pro',
    passMatchmaker: 'Pass Business Matchmaker',
    passJob: 'Pass Job Dating RH',
    btnWave: 'Payer via Wave',
    btnRegisterFree: 'Inscription Gratuite (Déposer CV)',

    hostedTitle: 'Programme Hosted Buyers VIP',
    hostedSubtitle: 'Vous êtes un acheteur majeur du secteur HORECA ? Bénéficiez d\'une prise en charge exclusive pour participer aux rendez-vous B2B 1-to-1 à Dakar.',
    hostedBenefit1Title: '✈️ Vol Aérien Pris en Charge',
    hostedBenefit1Desc: 'Billet d\'avion aller-retour vers Dakar financé par le comité d\'organisation.',
    hostedBenefit2Title: '🏨 Hébergement 5 Étoiles',
    hostedBenefit2Desc: 'Séjour d\'exception pris en charge à l\'Hôtel Novotel Dakar durant tout le salon.',
    hostedBenefit3Title: '🤝 Agenda B2B Sur-Mesure',
    hostedBenefit3Desc: 'Accès exclusif au VIP Lounge et jusqu\'à 15 rendez-vous d\'affaires 1-to-1 ciblés.',
    btnApplyHosted: 'Postuler au Programme Hosted Buyers',

    calcTitle: 'Simulateur de Budget Exposant & Voyage B2B',
    calcSubtitle: 'Calculez en quelques clics le coût global de votre participation à HORECA Africa 2026 à l\'Hôtel Novotel Dakar (Stand, Vol Aérien, Hôtel, Animation et Logistique).',
    calcStep1: '1. Choix du Stand / Pack d\'Accès',
    calcStep2: '2. Personnes sur le Stand',
    calcStep3: '3. Provenance & Vol Aérien',
    calcStep4: '4. Hébergement à Dakar',
    calcAnimTitle: '⚡ Animation Stand & Logistique Particulière',
    calcElectric: 'Raccordement Électrique Puissant (Animation Boisson / Cuisine en live)',
    calcFridge: 'Espace de Stockage Réfrigéré / Frigo',
    calcKakemono: 'Impression Oriflamme / Kakemono sur place à Dakar',
    calcVisa: 'Assistance Formalités Visa (Lettre d\'invitation officielle fournie)',
    calcGrandTotal: 'Budget Global Estimé',
    btnSendWA: 'Envoyer ma Simulation au Comité',
    btnPrintProforma: 'Imprimer / Sauvegarder Proforma',

    footerDesc: 'HORECA Africa Business Week 2026 — Le rendez-vous B2B majeur de l\'Hôtellerie, de la Restauration et du Tourisme en Afrique. Dakar, Sénégal. Organisé par Demba Conciergerie Luxury DMC.',
    footerCopyright: '© 2026 HORECA AFRICA Business Week. Tous droits réservés.',
  },
  en: {
    venue: 'Novotel Hotel Dakar, Senegal',
    dates: 'November 27 & 28, 2026',
    hours: '08:30 AM - 06:30 PM GMT',
    infoline: '+221 77 542 82 35',
    selectLanguage: 'Language',
    selectCurrency: 'Currency',
    waChannel: 'Dakar 2026 WhatsApp Channel',
    themeDark: 'Dark Mode 🌙',
    themeLight: 'Soft Light ☀️',

    navHome: 'Home',
    navPricing: 'Offers & Stands',
    navMatchmaking: 'B2B Matchmaking',
    navJobs: 'HR Recruitment',
    navHosted: 'VIP Hosted Buyers',
    navMeetings: 'My Appointments',
    navDayPass: 'Badge & D-Day',
    navAdmin: 'Organizer',
    navLogin: 'Login',
    navRegister: 'Register',
    navPass: 'QR Badge',
    navProfile: 'Profile',

    heroBadgeVenue: '📍 Nov 27 & 28, 2026 · Novotel Hotel Dakar, Senegal',
    heroBadgeType: '🏆 Professional HORECA B2B Trade Show',
    heroTitle: 'HORECA Africa Business Week 2026',
    heroSubtitle: 'The B2B gathering of HORECA decision makers in Africa. Exhibit at the heart of hospitality and grow your business in African markets.',
    btnExplorerMatchmaking: 'Explore B2B Matchmaking',
    btnJobDating: 'Job Dating & HR Recruitment',
    btnTarifs: 'Pricing & Exhibition Booths',
    btnSimulateur: 'Exhibitor Budget Calculator',
    btnHostedBuyers: 'VIP Hosted Buyers Program',

    statDecideurs: 'Decision-Making Professionals',
    statExposants: 'Specialized Exhibitors',
    statDiplomes: 'HORECA Young Graduates',
    statHosted: 'International Hosted Buyers',
    statSpeakers: 'Speakers & Experts',
    statMeetings: 'Scheduled B2B Meetings',

    pillarsTitle: 'The 3 Pillars of HORECA Africa',
    pillar1Title: '1. Hospitality & Accommodation',
    pillar1Desc: 'Hotel equipment suppliers, linens, interior design, PMS/ERP software, security and hotel services.',
    pillar2Title: '2. Catering & Gastronomy',
    pillar2Desc: 'Commercial kitchen equipment, food & beverage, coffee, tableware and eco-packaging.',
    pillar3Title: '3. HR Recruitment & Tourism',
    pillar3Desc: 'Specialized job dating, HORECA training institutes, travel agencies and talent sourcing.',

    pricingTitle: 'Exhibition Packages & Passes 2026',
    pricingSubtitle: 'Book your exhibition booth at the Novotel Dakar Hotel to showcase your products and sign contracts with qualified buyers.',
    standDecouverte: 'Discovery Booth 6m²',
    standBusiness: 'Business Booth 9m²',
    standPremium: 'Premium Booth 12m²',
    standPrestige: 'Prestige Booth 18m²',
    passPro: 'Pro Visitor Pass',
    passMatchmaker: 'Business Matchmaker Pass',
    passJob: 'HR Job Dating Pass',
    btnWave: 'Pay via Wave',
    btnRegisterFree: 'Free Registration (Submit Resume)',

    hostedTitle: 'VIP Hosted Buyers Program',
    hostedSubtitle: 'Are you a major decision maker in the HORECA sector? Benefit from an exclusive hosted package to attend 1-to-1 B2B meetings in Dakar.',
    hostedBenefit1Title: '✈️ Fully Covered Round-Trip Flight',
    hostedBenefit1Desc: 'Round-trip flight to Dakar fully funded by the organizing committee.',
    hostedBenefit2Title: '🏨 5-Star Hotel Stay',
    hostedBenefit2Desc: 'Complimentary stay at the Novotel Dakar Hotel throughout the exhibition.',
    hostedBenefit3Title: '🤝 Tailored B2B Schedule',
    hostedBenefit3Desc: 'Exclusive VIP Lounge access and up to 15 targeted 1-to-1 business meetings.',
    btnApplyHosted: 'Apply for Hosted Buyers Program',

    calcTitle: 'Exhibitor & Travel Budget Simulator',
    calcSubtitle: 'Calculate in a few clicks the global cost of your participation at HORECA Africa 2026 at Novotel Dakar (Stand, Flight, Hotel, On-site Animation and Logistics).',
    calcStep1: '1. Stand / Pass Selection',
    calcStep2: '2. Team Members on Stand',
    calcStep3: '3. Origin & Flight Ticket',
    calcStep4: '4. Accommodation in Dakar',
    calcAnimTitle: '⚡ Stand Animation & Logistics',
    calcElectric: 'High Power Power Supply (Beverage / Live Cooking Animation)',
    calcFridge: 'Refrigerated Storage Space',
    calcKakemono: 'On-site Roll-up Kakemono Printing in Dakar',
    calcVisa: 'Visa Assistance (Official Invitation Letter Provided)',
    calcGrandTotal: 'Estimated Total Budget',
    btnSendWA: 'Send Simulation to Committee',
    btnPrintProforma: 'Print / Save Proforma Invoice',

    footerDesc: 'HORECA Africa Business Week 2026 — The leading B2B trade show for Hospitality, Catering and Tourism in Africa. Dakar, Senegal. Organized by Demba Conciergerie Luxury DMC.',
    footerCopyright: '© 2026 HORECA AFRICA Business Week. All rights reserved.',
  },
  ar: {
    venue: 'فندق نوفوتيل داكار، السنغال',
    dates: '27 و 28 نوفمبر 2026',
    hours: '08:30 صباحاً - 06:30 مساءً بتوقيت غرينتش',
    infoline: '+221 77 542 82 35',
    selectLanguage: 'اللغة',
    selectCurrency: 'العملة',
    waChannel: 'قناة داكار 2026 على واتساب',
    themeDark: 'الوضع الليلي المريح 🌙',
    themeLight: 'الوضع الفاتح ☀️',

    navHome: 'الرئيسية',
    navPricing: 'العروض والأجنحة',
    navMatchmaking: 'لقاءات الأعمال B2B',
    navJobs: 'التوظيف والموارد البشرية',
    navHosted: 'برنامج المشترين VIP',
    navMeetings: 'مواعيدي',
    navDayPass: 'شارة الدخول',
    navAdmin: 'المنظم',
    navLogin: 'تسجيل الدخول',
    navRegister: 'إنشاء حساب',
    navPass: 'رمز QR',
    navProfile: 'الملف الشخصي',

    heroBadgeVenue: '📍 27 و 28 نوفمبر 2026 · فندق نوفوتيل داكار، السنغال',
    heroBadgeType: '🏆 المعرض التجاري المهني لقطاع الضيافة والمطاعم HORECA',
    heroTitle: 'أسبوع أوريكا إفريقيا للأعمال 2026',
    heroSubtitle: 'الملتقى التجاري B2B لصناع القرار في قطاع الفندقة والمطاعم في إفريقيا. اعرض منتجاتك في قلب الضيافة وطور أعمالك في الأسواق الإفريقية.',
    btnExplorerMatchmaking: 'استكشاف لقاءات الأعمال B2B',
    btnJobDating: 'يوم التوظيف والموارد البشرية',
    btnTarifs: 'أسعار باقات العرض والجناح',
    btnSimulateur: 'حاسبة ميزانية العارضين والسفر',
    btnHostedBuyers: 'برنامج المشترين الدوليين VIP',

    statDecideurs: 'مهني وصانع قرار',
    statExposants: 'عارض متخصص',
    statDiplomes: 'خريج جديد في قطاع الفندقة',
    statHosted: 'مشترين دوليين مستضافين VIP',
    statSpeakers: 'متحدث ومحاضر خبير',
    statMeetings: 'اجتماع عمل B2B مؤكد',

    pillarsTitle: 'المحاور الثلاثة الرئيسية لمعرض أوريكا إفريقيا',
    pillar1Title: '1. الفندقة والإقامة',
    pillar1Desc: 'موردو المعدات الفندقية، المفروشات، التصميم الداخلي، وأنظمة إدارة الفنادق PMS/ERP والخدمات.',
    pillar2Title: '2. المطاعم والإطعام',
    pillar2Desc: 'معدات المطابخ الاحترافية، الأغذية والمشروبات، القهوة، وأواني الطاولة والتغليف البيئي.',
    pillar3Title: '3. التوظيف والسياحة',
    pillar3Desc: 'لقاءات توظيف متخصصة، معاهد تدريب فندقية، ووكالات الأسفار والترويج السياحي.',

    pricingTitle: 'باقات العرض والتذاكر لعام 2026',
    pricingSubtitle: 'احجز جناحك في فندق نوفوتيل داكار لعرض منتجاتك وتوقيع العقود مع المشترين المؤهلين.',
    standDecouverte: 'جناح الاستكشاف 6 م²',
    standBusiness: 'جناح الأعمال 9 م²',
    standPremium: 'جناح متميز 12 م²',
    standPrestige: 'جناح فاخر 18 م²',
    passPro: 'تذكرة زائر محترف',
    passMatchmaker: 'تذكرة لقاءات B2B',
    passJob: 'تذكرة التوظيف المجانية',
    btnWave: 'الدفع عبر Wave',
    btnRegisterFree: 'تسجيل مجاني (إيداع السيرة الذاتية)',

    hostedTitle: 'برنامج المشترين المستضافين VIP Hosted Buyers',
    hostedSubtitle: 'هل أنت صانع قرار رئيسي في قطاع الفندقة والمطاعم؟ استفد من تغطية شاملة لتكاليف مشاركتك وحضور لقاءات B2B المباشرة.',
    hostedBenefit1Title: '✈️ تذكرة طيران ذهاب وإياد مجانية',
    hostedBenefit1Desc: 'تذكرة الطيران إلى داكار ممولة بالكامل من طرف اللجنة المنظمة.',
    hostedBenefit2Title: '🏨 إقامة فاخرة 5 نجوم',
    hostedBenefit2Desc: 'إقامة مجانية كاملة في فندق نوفوتيل داكار طيلة فترة المعرض.',
    hostedBenefit3Title: '🤝 جدول مواعيد B2B مخصص',
    hostedBenefit3Desc: 'دخول حصري لقاعة VIP وإمكانية عقد حتى 15 اجتماع عمل مباشر 1-to-1.',
    btnApplyHosted: 'التقديم لبرنامج المشترين المستضافين',

    calcTitle: 'حاسبة التكلفة والميزانية للعارضين والرحلة',
    calcSubtitle: 'احسب في بضع انقر التكلفة الإجمالية لمشاركتك في المعرض (الجناح، الطيران، الفندق، والخدمات اللوجستية).',
    calcStep1: '1. اختيار الجناح / الباقة',
    calcStep2: '2. عدد العارضين في الجناح',
    calcStep3: '3. بلد المغادرة وحجز الطيران',
    calcStep4: '4. الإقامة في داكار',
    calcAnimTitle: '⚡ التجهيزات والأنشطة في الجناح',
    calcElectric: 'توصيل كهربائي عالي القدرة (لتحضير المشروبات أو الطهي المباشر)',
    calcFridge: 'مساحة تخزين مبردة / ثلاجة',
    calcKakemono: 'طباعة اللافتات (Roll-up) في داكار',
    calcVisa: 'المساعدة في إجراءات التأشيرة (دعوة رسمية مؤكدة)',
    calcGrandTotal: 'إجمالي الميزانية التقديرية',
    btnSendWA: 'إرسال التقدير للجنة عبر واتساب',
    btnPrintProforma: 'طباعة وحفظ الفاتورة التقديرية',

    footerDesc: 'أسبوع أوريكا إفريقيا للأعمال 2026 — المعرض التجاري الرائد للفندقة والإطعام والسياحة في إفريقيا. داكار، السنغال. تنظيم Demba Conciergerie Luxury DMC.',
    footerCopyright: '© 2026 HORECA AFRICA Business Week. جميع الحقوق محفوظة.',
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  formatPrice: (amountInFCFA: number) => string;
  convertFromFCFA: (amountInFCFA: number) => { amount: number; symbol: string; currency: Currency };
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('horeca_lang') as Language) || 'fr';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('horeca_currency') as Currency) || 'FCFA';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('horeca_theme') as ThemeMode) || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('horeca_lang', lang);
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('horeca_currency', curr);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('horeca_theme', mode);
  };

  const toggleTheme = () => {
    const nextMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextMode);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.fr[key] || key;
  };

  const convertFromFCFA = (amountInFCFA: number) => {
    const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES.FCFA;
    const converted = Math.round(amountInFCFA * config.rate);
    return {
      amount: converted,
      symbol: config.symbol,
      currency
    };
  };

  const formatPrice = (amountInFCFA: number): string => {
    if (amountInFCFA === 0) return 'GRATUIT';
    const { amount, symbol } = convertFromFCFA(amountInFCFA);
    const config = EXCHANGE_RATES[currency];
    const formattedNum = amount.toLocaleString();

    if (config.position === 'before') {
      return `${symbol} ${formattedNum}`;
    } else {
      return `${formattedNum} ${symbol}`;
    }
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        theme,
        setTheme,
        toggleTheme,
        t,
        formatPrice,
        convertFromFCFA
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
