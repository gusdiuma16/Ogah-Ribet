import { Talent, UMKMProduct, FinancialRecord, ProgramProgress, VisionStat } from './types';

// ==========================================
// CONFIGURATION (Replace with your actual keys)
// ==========================================
// NOTE: For write operations (upload/append), you need an OAuth Access Token.
// In a production app, this should be handled by a backend server.
export const GOOGLE_SHEETS_API_KEY = "YOUR_GOOGLE_SHEETS_API_KEY"; // For Read Only (Public Sheets)
export const GOOGLE_ACCESS_TOKEN = "YOUR_OAUTH_ACCESS_TOKEN"; // For Write (Drive Upload & Sheet Append)
export const SPREADSHEET_ID = "1HWri-0h1nfSJmiNgCyXm3jSS3J_cmtzXVKc4yM_Gxbc"; 
export const DRIVE_FOLDER_ID = "1EMhyGm3eC2QSrvz0jB3Y4IT_ajB7lQap"; // Folder must be shared as "Anyone with link can view"

export const HERO_TITLE = "Jati Cempaka Future Hub";
export const HERO_SUBTITLE = "Platform kolaborasi digital Gen-Z & Millennial untuk membangun ekosistem kreatif yang transparan dan visioner.";

// Mock Data (Used as fallback if API fails)
export const MOCK_STATS: VisionStat[] = [
  { label: "Active Members", value: "142", trend: "+12%" },
  { label: "UMKM Partner", value: "28", trend: "+5%" },
  { label: "Total Projects", value: "15" },
];

export const MOCK_TALENTS: Talent[] = [
  {
    id: '1',
    name: 'Rian Adhitya',
    role: 'Fullstack Developer',
    skills: ['React', 'Node.js', 'GCP'],
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    availableForHire: true
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Maze', 'Prototyping'],
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    availableForHire: true
  },
  {
    id: '3',
    name: 'Dimas Pratama',
    role: 'Videographer',
    skills: ['Premiere', 'After Effects', 'Drone'],
    avatarUrl: 'https://picsum.photos/100/100?random=3',
    availableForHire: false
  }
];

export const MOCK_UMKM: UMKMProduct[] = [
  {
    id: '1',
    name: 'Kopi Jati Signature',
    owner: 'Kedai Kopi 99',
    price: 18000,
    imageUrl: 'https://picsum.photos/300/300?random=10',
    category: 'F&B'
  },
  {
    id: '2',
    name: 'Custom Tote Bag',
    owner: 'Crafty Jati',
    price: 45000,
    imageUrl: 'https://picsum.photos/300/300?random=11',
    category: 'Merchandise'
  },
  {
    id: '3',
    name: 'Sambal Roa Juara',
    owner: 'Dapur Bu Tini',
    price: 35000,
    imageUrl: 'https://picsum.photos/300/300?random=12',
    category: 'F&B'
  },
  {
    id: '4',
    name: 'Kaos Karang Taruna',
    owner: 'Jati Merch',
    price: 85000,
    imageUrl: 'https://picsum.photos/300/300?random=13',
    category: 'Fashion'
  }
];

export const MOCK_FINANCIALS: FinancialRecord[] = [
  { month: 'Jan', income: 2500000, expense: 1200000 },
  { month: 'Feb', income: 3200000, expense: 2100000 },
  { month: 'Mar', income: 4100000, expense: 1800000 },
  { month: 'Apr', income: 3800000, expense: 2900000 },
  { month: 'May', income: 5500000, expense: 2000000 },
];

export const MOCK_PROGRAMS: ProgramProgress[] = [
  { id: '1', name: 'Digital Workshop Series', progress: 75, status: 'In Progress' },
  { id: '2', name: 'Jati Cempaka Festival', progress: 30, status: 'Planning' },
  { id: '3', name: 'Bank Sampah Digital', progress: 100, status: 'Completed' },
];