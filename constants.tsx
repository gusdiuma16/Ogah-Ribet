import { AppData, LayoutConfig } from './types';

export const APP_CONFIG = {
  ADMIN_USERNAME: 'ogahadmin',
  ADMIN_PASSWORD: 'jaticempaka16',
  SECRET_CODE: '911',
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  primaryColor: 'indigo',
  fontFamily: 'Plus Jakarta Sans',
  animationEnabled: true,
  heroImageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
  borderRadius: 'rounded-[3rem]',
  headerStyle: 'gradient',
  themeMode: 'light',
  showDonationSection: true,
  qrisImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
  donationTitle: 'Mari Membantu Sesama',
  donationDescription: 'Uluran tangan Anda meringankan beban mereka yang membutuhkan tanpa proses berbelit.',
  foundationName: 'Ogah Ribet Foundation',
  foundationDescription: 'Bergerak dengan hati, membantu sesama tanpa birokrasi yang rumit.',
  aboutUs: 'Ogah Ribet Foundation adalah wadah kemanusiaan yang fokus pada penyaluran bantuan langsung dan transparan bagi masyarakat Jaticempaka dan sekitarnya.',
  vision: 'Menjadi pusat koordinasi bantuan sosial yang modern dan terpercaya.',
  mission: 'Mempermudah warga untuk saling membantu dengan sistem pelaporan yang terbuka.',
  goals: 'Transparansi 100%, Kecepatan Penyaluran, dan Kemudahan Akses Informasi.',
  instagramUrl: 'https://instagram.com/',
  sheetUrlDonation: 'https://script.google.com/macros/s/AKfycbyKGeykRzOQCVCXJpFBeoUGfqXeS6l7G-skoSj2mMv3HCbwKYHWoBpI_fZEHBQNNvcV/exec',
  sheetUrlGallery: 'https://script.google.com/macros/s/AKfycbyKGeykRzOQCVCXJpFBeoUGfqXeS6l7G-skoSj2mMv3HCbwKYHWoBpI_fZEHBQNNvcV/exec',
  sheetUrlArticles: 'https://script.google.com/macros/s/AKfycbyKGeykRzOQCVCXJpFBeoUGfqXeS6l7G-skoSj2mMv3HCbwKYHWoBpI_fZEHBQNNvcV/exec',
};

export const INITIAL_DATA: AppData = {
  incomes: [],
  pendingIncomes: [],
  expenses: [],
  distributions: [],
  articles: [],
  gallery: [],
  layout: DEFAULT_LAYOUT,
};