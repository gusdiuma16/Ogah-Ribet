export interface Talent {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatarUrl: string;
  availableForHire: boolean;
}

export interface UMKMProduct {
  id: string;
  name: string;
  owner: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface FinancialRecord {
  month: string;
  income: number;
  expense: number;
}

export interface ProgramProgress {
  id: string;
  name: string;
  progress: number; // 0-100
  status: 'Planning' | 'In Progress' | 'Completed';
}

export interface VisionStat {
  label: string;
  value: string;
  trend?: string;
}