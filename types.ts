export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface AdminSettings {
  isMaintenanceMode: boolean;
  startHour: number;
  endHour: number;
  adminPassword: string;
  enabledFeatures: {
    converter: boolean;
    calculator: boolean;
    marketRates: boolean;
    showBloodEffect: boolean;
  };
  bloodEffectText: string;
  socialLinks: {
    whatsapp: { url: string; visible: boolean };
    telegram: { url: string; visible: boolean };
    facebook: { url: string; visible: boolean };
    instagram: { url: string; visible: boolean };
  };
  mobileApp: {
    url: string;
    previewImage: string | null;
    visible: boolean;
  };
  siteLogo: string | null;
}

export interface Translation {
  title: string;
  subtitle: string;
  home: string;
  services: string;
  converter: string;
  calculator: string;
  newToOld: string;
  oldToNew: string;
  amount: string;
  result: string;
  newLira: string;
  oldLira: string;
  totalPrice: string;
  amountPaid: string;
  changeNeeded: string;
  denominations: string;
  calculate: string;
  reset: string;
  marketRates: string;
  loading: string;
  notes: string;
  cbs: string;
  blackMarket: string;
  buy: string;
  sell: string;
  lastUpdate: string;
  from: string;
  to: string;
  aboutUs: string;
  privacyPolicy: string;
  contactUs: string;
  aboutContent: string;
  privacyContent: string;
  contactContent: string;
  downloadApp: string;
  directDownload: string;
  appNote: string;
  rateError: string;
}

export interface ExchangeRate {
  currency: string;
  buy: number;
  sell: number;
  mid: number;
  timestampUtc: string;
}

export interface RatesResponse {
  cbsRates: ExchangeRate[];
  blackMarketRates: ExchangeRate[];
  timestampUtc: string;
  error?: string;
}

export interface Denomination {
  value: number;
  label: string;
}

export const NEW_DENOMINATIONS: Denomination[] = [
  { value: 500, label: '500' },
  { value: 200, label: '200' },
  { value: 100, label: '100' },
  { value: 50, label: '50' },
  { value: 25, label: '25' },
  { value: 10, label: '10' }
];

export const CONVERSION_RATE = 100; // 1 New = 100 Old