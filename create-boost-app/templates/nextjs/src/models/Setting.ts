import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISocials {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

export interface IAppearanceConfig {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonOutline: string;
  border: string;
  shadow: string;
}

export interface ISettings extends Document {
  storeName: string;
  contactEmail: string;
  storeAddress: string;
  phone?: string;
  whatsapp?: string;
  socials?: ISocials;
  theme: 'light' | 'dark' | 'system';
  font: string;
  logoUrl: string;
  footerBgUrl?: string;
  footerBgMobileUrl?: string;
  disableFooterBg?: boolean;
  footerDescription?: string;
  puzzleImageUrl?: string;
  logoDisplayMode: 'logo-only' | 'logo-and-name' | 'name-only' | 'logo-name-scroll' | 'name-logo-scroll';
  primaryColor: string;
  primaryColorDark: string;
  appearance: {
    light: IAppearanceConfig;
    dark: IAppearanceConfig;
  };
  customThemes?: {
    name: string;
    light: IAppearanceConfig;
    dark: IAppearanceConfig;
  }[];
  activeTheme?: string;
  contactPage?: {
    title: string;
    subtitle: string;
    infoTitle: string;
    infoDesc: string;
    formTitle: string;
    formDesc: string;
  };
  aboutPage?: {
    title: string;
    description: string;
    heroImage: string;
    bannerImage1?: string;
    bannerImage2?: string;
    missionTitle: string;
    missionDescription: string;
    visionTitle: string;
    visionDescription: string;
    brandPhilosophyTitle?: string;
    brandPhilosophyDescription?: string;
    brandPromiseTitle?: string;
    brandPromiseDescription?: string;
    brandEssenceTitle?: string;
    brandEssenceDescription?: string;
    coreValuesTitle?: string;
    value1Title?: string;
    value1Description?: string;
    value2Title?: string;
    value2Description?: string;
    value3Title?: string;
    value3Description?: string;
    value4Title?: string;
    value4Description?: string;
    value5Title?: string;
    value5Description?: string;
  };
  privacyPolicy?: string;
  termsAndConditions?: string;
  refundPolicy?: string;
  shippingPolicy?: string;
  gtmId?: string;
  facebookPixelId?: string;
  landingPageLayout: 'modern' | 'traditional';
  easyecomToken?: {
    token: string;
    generatedAt: string;
    expiresAt: string;
  };
  easyecomApiKey?: string;
  easyecomEmail?: string;
  easyecomPassword?: string;
  easyecomApiUrl?: string;
  easyecomWebhookSecret?: string;
  easyecomLocationKey?: string;
  easyecomTaxRuleName?: string;
  isCodEnabled?: boolean;
  isRazorpayEnabled?: boolean;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  isPhonePeEnabled?: boolean;
  phonepeMerchantId?: string;
  phonepeSaltKey?: string;
  phonepeSaltIndex?: string;
  phonepeSandbox?: boolean;
  isCashfreeEnabled?: boolean;
  cashfreeAppId?: string;
  cashfreeSecretKey?: string;
  cashfreeSandbox?: boolean;
  isPaytmEnabled?: boolean;
  paytmMerchantId?: string;
  paytmMerchantKey?: string;
  paytmSandbox?: boolean;
  isCcavenueEnabled?: boolean;
  ccavenueMerchantId?: string;
  ccavenueAccessCode?: string;
  ccavenueWorkingKey?: string;
  ccavenueSandbox?: boolean;
  invoiceCompanyName?: string;
  invoiceCompanyAddress?: string;
  invoiceShipFromAddress?: string;
  invoiceGstin?: string;
  invoicePan?: string;
  invoiceRegisteredAddress?: string;
  invoiceCin?: string;
  invoiceStateCode?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpSenderEmail?: string;
  smtpSenderName?: string;
  smtpFamily?: number;
  msg91AuthKey?: string;
  msg91SenderId?: string;
  msg91OtpTemplateId?: string;
  msg91PeId?: string;
  msg91Enabled?: boolean;
}

const SocialsSchema: Schema = new Schema({
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
  youtube: { type: String, default: '' },
  linkedin: { type: String, default: '' },
}, { _id: false });

const AppearanceSchema: Schema = new Schema({
  background: { type: String },
  surface: { type: String },
  textPrimary: { type: String },
  textSecondary: { type: String },
  primary: { type: String },
  buttonPrimaryBg: { type: String },
  buttonPrimaryText: { type: String },
  buttonOutline: { type: String },
  border: { type: String },
  shadow: { type: String },
}, { _id: false });

const SettingsSchema: Schema = new Schema({
  storeName: { type: String, default: 'My Store' },
  contactEmail: { type: String, default: 'sales@example.com' },
  storeAddress: { type: String, default: '123 Market St, San Francisco, CA 94103' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  socials: { type: SocialsSchema, default: () => ({}) },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  font: { type: String, default: 'inter' },
  primaryColor: { type: String, default: '#8C0D17' },
  primaryColorDark: { type: String, default: '#D9B46C' },
  appearance: {
    light: { type: AppearanceSchema, default: () => ({}) },
    dark: { type: AppearanceSchema, default: () => ({}) },
  },
  customThemes: {
    type: [Schema.Types.Mixed],
    default: []
  },
  activeTheme: { type: String, default: 'classic' },
  logoUrl: { type: String, default: '' },
  footerBgUrl: { type: String, default: '' },
  footerBgMobileUrl: { type: String, default: '' },
  disableFooterBg: { type: Boolean, default: false },
  footerDescription: { type: String, default: '' },
  puzzleImageUrl: { type: String, default: '' },
  logoDisplayMode: { type: String, enum: ['logo-only', 'logo-and-name', 'name-only', 'logo-name-scroll', 'name-logo-scroll'], default: 'logo-only' },
  contactPage: {
    title: { type: String, default: 'Get in Touch' },
    subtitle: { type: String, default: "Have questions? We'd love to hear from you." },
    infoTitle: { type: String, default: 'Contact Information' },
    infoDesc: { type: String, default: 'Reach out to us directly through any of these channels.' },
    formTitle: { type: String, default: 'Send us a Message' },
    formDesc: { type: String, default: "Fill out the form and we'll get back to you as soon as possible." },
  },
  aboutPage: {
    title: { type: String, default: 'About Us' },
    description: { type: String, default: '<p>We are dedicated to bringing you the best products with the best service.</p>' },
    heroImage: { type: String, default: '' },
    bannerImage1: { type: String, default: '' },
    bannerImage2: { type: String, default: '' },
    missionTitle: { type: String, default: 'Our Mission' },
    missionDescription: { type: String, default: '<p>Our mission is to provide a seamless and enjoyable shopping experience for our customers.</p>' },
    visionTitle: { type: String, default: 'Our Vision' },
    visionDescription: { type: String, default: '<p>We envision a world where shopping is not just a transaction, but a delightful discovery.</p>' },
    brandPhilosophyTitle: { type: String, default: 'Brand Philosophy' },
    brandPhilosophyDescription: { type: String, default: '' },
    brandPromiseTitle: { type: String, default: 'Brand Promise' },
    brandPromiseDescription: { type: String, default: '' },
    brandEssenceTitle: { type: String, default: 'Brand Essence' },
    brandEssenceDescription: { type: String, default: '' },
    coreValuesTitle: { type: String, default: 'Core Values' },
    value1Title: { type: String, default: 'Individuality' },
    value1Description: { type: String, default: '' },
    value2Title: { type: String, default: 'Purposeful Design' },
    value2Description: { type: String, default: '' },
    value3Title: { type: String, default: 'Quiet Luxury' },
    value3Description: { type: String, default: '' },
    value4Title: { type: String, default: 'Authenticity' },
    value4Description: { type: String, default: '' },
    value5Title: { type: String, default: 'Belonging' },
    value5Description: { type: String, default: '' },
  },
  privacyPolicy: { type: String, default: 'Privacy Policy content goes here...' },
  termsAndConditions: { type: String, default: 'Terms and Conditions content goes here...' },
  refundPolicy: { type: String, default: 'Refund Policy content goes here...' },
  shippingPolicy: { type: String, default: 'Shipping Policy content goes here...' },
  gtmId: { type: String, default: '' },
  facebookPixelId: { type: String, default: '' },
  landingPageLayout: { type: String, enum: ['modern', 'traditional'], default: 'modern' },
  easyecomToken: { type: Schema.Types.Mixed, default: null },
  easyecomApiKey: { type: String, default: '' },
  easyecomEmail: { type: String, default: '' },
  easyecomPassword: { type: String, default: '' },
  easyecomApiUrl: { type: String, default: 'https://api.easyecom.io' },
  easyecomWebhookSecret: { type: String, default: '' },
  easyecomLocationKey: { type: String, default: '' },
  easyecomTaxRuleName: { type: String, default: '' },
  isCodEnabled: { type: Boolean, default: true },
  isRazorpayEnabled: { type: Boolean, default: true },
  razorpayKeyId: { type: String, default: '' },
  razorpayKeySecret: { type: String, default: '' },
  isPhonePeEnabled: { type: Boolean, default: false },
  phonepeMerchantId: { type: String, default: '' },
  phonepeSaltKey: { type: String, default: '' },
  phonepeSaltIndex: { type: String, default: '' },
  phonepeSandbox: { type: Boolean, default: true },
  isCashfreeEnabled: { type: Boolean, default: false },
  cashfreeAppId: { type: String, default: '' },
  cashfreeSecretKey: { type: String, default: '' },
  cashfreeSandbox: { type: Boolean, default: true },
  isPaytmEnabled: { type: Boolean, default: false },
  paytmMerchantId: { type: String, default: '' },
  paytmMerchantKey: { type: String, default: '' },
  paytmSandbox: { type: Boolean, default: true },
  isCcavenueEnabled: { type: Boolean, default: false },
  ccavenueMerchantId: { type: String, default: '' },
  ccavenueAccessCode: { type: String, default: '' },
  ccavenueWorkingKey: { type: String, default: '' },
  ccavenueSandbox: { type: Boolean, default: true },
  invoiceCompanyName: { type: String, default: 'Hass Designs Private Limited' },
  invoiceCompanyAddress: { type: String, default: '10th Floor Tower B, Prestige Shantiniketan Whitefield Road, ITPL Main Road Bengaluru – 560048, Karnataka' },
  invoiceShipFromAddress: { type: String, default: 'Survey No. 53/3, 19th Km, Tumkur Road, Madanayakanahalli, Bengaluru Bengaluru Urban, KARNATAKA, 562162' },
  invoiceGstin: { type: String, default: '29AAGCH0672J1ZC' },
  invoicePan: { type: String, default: 'AAGCH0672J' },
  invoiceRegisteredAddress: { type: String, default: 'NO-4, Bougainvillea 4/F, Kalidas Road, IIRS Campus Gate, Hathi Barkala, Dehradun, Uttarakhand, India, 248001' },
  invoiceCin: { type: String, default: 'U52100UT2021PTC016733' },
  invoiceStateCode: { type: String, default: '29' },
  smtpHost: { type: String, default: '' },
  smtpPort: { type: Number, default: 25 },
  smtpSecure: { type: Boolean, default: false },
  smtpUser: { type: String, default: '' },
  smtpPass: { type: String, default: '' },
  smtpSenderEmail: { type: String, default: '' },
  smtpSenderName: { type: String, default: '' },
  smtpFamily: { type: Number, default: 4 },
  msg91AuthKey: { type: String, default: '' },
  msg91SenderId: { type: String, default: 'CLBHCH' },
  msg91OtpTemplateId: { type: String, default: '' },
  msg91PeId: { type: String, default: '' },
  msg91Enabled: { type: Boolean, default: true },

}, { timestamps: true });

export default models.Setting || model<ISettings>('Setting', SettingsSchema);
