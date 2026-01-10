import { 
  MOCK_FINANCIALS, 
  MOCK_PROGRAMS, 
  MOCK_STATS, 
  MOCK_TALENTS, 
  MOCK_UMKM, 
  GOOGLE_SHEETS_API_KEY, 
  GOOGLE_ACCESS_TOKEN,
  SPREADSHEET_ID,
  DRIVE_FOLDER_ID
} from '../constants';
import { FinancialRecord, ProgramProgress, Talent, UMKMProduct, VisionStat } from '../types';

/**
 * Service to handle data fetching from Google Sheets API v4 and Uploads to Drive API v3.
 */

const BASE_SHEETS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values`;
const UPLOAD_DRIVE_URL = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

// Helper for Read Operations (Public API Key is enough if sheet is public)
const fetchSheet = async (range: string) => {
  if (!GOOGLE_SHEETS_API_KEY || GOOGLE_SHEETS_API_KEY.includes("YOUR_")) {
    throw new Error("API Key not configured");
  }
  
  const url = `${BASE_SHEETS_URL}/${range}?key=${GOOGLE_SHEETS_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Google Sheets API Error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.values || []; 
};

// Helper for Write Operations (Requires OAuth Token)
const checkAuth = () => {
  if (!GOOGLE_ACCESS_TOKEN || GOOGLE_ACCESS_TOKEN.includes("YOUR_")) {
    throw new Error("Missing GOOGLE_ACCESS_TOKEN. Write operations require OAuth.");
  }
};

export const dataService = {
  
  fetchJatiData: async () => {
    try {
      console.log("Fetching JatiData from Google Sheets...");
      const [homeData, eventsData, talentsData] = await Promise.all([
        fetchSheet('Home!A2:C'),    
        fetchSheet('Events!A2:D'),  
        fetchSheet('Talents!A2:F')  
      ]);

      return {
        stats: homeData.map((row: any[]) => ({
          label: row[0],
          value: row[1],
          trend: row[2] || undefined
        })),
        programs: eventsData.map((row: any[]) => ({
          id: row[0],
          name: row[1],
          progress: parseInt(row[2]) || 0,
          status: row[3] as any
        })),
        talents: talentsData.map((row: any[]) => ({
          id: row[0],
          name: row[1],
          role: row[2],
          skills: row[3] ? row[3].split(',').map((s: string) => s.trim()) : [],
          avatarUrl: row[4],
          availableForHire: row[5] === 'TRUE'
        }))
      };
    } catch (error) {
      console.warn("Failed to fetch from Google Sheets (using Mocks):", error);
      return {
        stats: MOCK_STATS,
        programs: MOCK_PROGRAMS,
        talents: MOCK_TALENTS
      };
    }
  },

  getStats: async (): Promise<VisionStat[]> => {
    try {
      const rows = await fetchSheet('Home!A2:C');
      if (rows.length === 0) return MOCK_STATS;
      return rows.map((row: any[]) => ({
        label: row[0],
        value: row[1],
        trend: row[2] || undefined
      }));
    } catch (e) {
      return MOCK_STATS;
    }
  },

  getTalents: async (): Promise<Talent[]> => {
    try {
      const rows = await fetchSheet('Talents!A2:F');
      if (rows.length === 0) return MOCK_TALENTS;
      return rows.map((row: any[]) => ({
        id: row[0],
        name: row[1],
        role: row[2],
        skills: row[3] ? row[3].split(',').map((s: string) => s.trim()) : [],
        avatarUrl: row[4],
        availableForHire: row[5]?.toUpperCase() === 'TRUE'
      }));
    } catch (e) {
      return MOCK_TALENTS;
    }
  },

  getUMKM: async (): Promise<UMKMProduct[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_UMKM), 500);
    });
  },

  getTransparencyData: async (): Promise<{ financial: FinancialRecord[], programs: ProgramProgress[] }> => {
    try {
      const rows = await fetchSheet('Events!A2:D');
      const realPrograms = rows.map((row: any[]) => ({
        id: row[0],
        name: row[1],
        progress: parseInt(row[2]) || 0,
        status: row[3] as any
      }));
      return {
        financial: MOCK_FINANCIALS,
        programs: realPrograms.length > 0 ? realPrograms : MOCK_PROGRAMS
      };
    } catch (e) {
      return {
        financial: MOCK_FINANCIALS,
        programs: MOCK_PROGRAMS
      };
    }
  },

  // ============================================
  // WRITE OPERATIONS (Upload & Append)
  // ============================================

  /**
   * Uploads an image to Google Drive and returns the webViewLink (or download link)
   */
  uploadToDrive: async (file: File): Promise<string> => {
    checkAuth();
    
    const metadata = {
      name: file.name,
      parents: [DRIVE_FOLDER_ID],
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch(UPLOAD_DRIVE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GOOGLE_ACCESS_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Drive Upload Failed: ${err.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const fileId = result.id;

    // Construct a direct thumbnail/view link. 
    // Note: To make this work publicly, the folder on Drive MUST be shared as "Anyone with link".
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  },

  /**
   * Appends a new row to a specific Sheet Range
   */
  appendToSheet: async (range: string, values: any[]) => {
    checkAuth();

    const url = `${BASE_SHEETS_URL}/${range}:append?valueInputOption=USER_ENTERED&key=${GOOGLE_SHEETS_API_KEY}`;
    
    const body = {
      values: [values]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GOOGLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Sheet Append Failed: ${err.error?.message || response.statusText}`);
    }

    return await response.json();
  },

  // High-level Actions

  addTalent: async (data: any, imageFile?: File | null): Promise<boolean> => {
    let avatarUrl = data.avatarUrl;

    if (imageFile) {
      console.log("Uploading image to Drive...");
      avatarUrl = await dataService.uploadToDrive(imageFile);
      console.log("Image uploaded:", avatarUrl);
    }

    const newId = `T-${Date.now()}`;
    const row = [
      newId,
      data.name,
      data.role,
      data.skills,
      avatarUrl,
      data.available ? "TRUE" : "FALSE"
    ];

    console.log("Appending to Sheet...", row);
    await dataService.appendToSheet('Talents!A:F', row);
    return true;
  },

  updateHero: async (data: any): Promise<boolean> => {
    // This overwrites specific cells instead of appending
    // Implementation simplified for demo: Appending to a log or creating a new row
    // Ideally, this should use :update or :batchUpdate endpoint
    const row = ["Hero Update", data.title, data.subtitle, new Date().toISOString()];
    await dataService.appendToSheet('Home!A:D', row); 
    return true;
  },

  addProgram: async (data: any): Promise<boolean> => {
    const newId = `P-${Date.now()}`;
    const row = [
      newId,
      data.name,
      data.progress,
      data.status
    ];
    await dataService.appendToSheet('Events!A:D', row);
    return true;
  }
};