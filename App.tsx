import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LucideChevronDown, LucideChevronUp, LucideLock, LucidePlus, LucideTrash2, 
  LucideCheckCircle2, LucideHistory, LucideLogOut, LucidePalette, LucideImage, 
  LucideSettings, LucideSave, LucideQrCode, LucideHeartHandshake, LucideX, 
  LucideUpload, LucideCheck, LucideClock, LucideShieldCheck, LucideXCircle, 
  LucideHome, LucideTarget, LucideInstagram, LucideBookOpen, LucideArrowRight, 
  LucideFileText, LucideMonitor, LucidePlay, LucideDatabase, LucideAlertTriangle, 
  LucideHeart, LucideTable, LucideLoader2, LucideRefreshCw
} from 'lucide-react';
import { Income, Expense, Distribution, AppData, LayoutConfig, AppView, Article, GalleryItem } from './types';
import { APP_CONFIG, INITIAL_DATA, ASSETS } from './constants';

// --- HELPER FUNCTIONS ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const getLocalISODate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard: React.FC<{
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onLogout: () => void;
  formatCurrency: (val: number) => string;
  storageError: boolean;
  sheetUrl: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}> = ({ data, setData, onLogout, formatCurrency, storageError, sheetUrl, onRefresh, isRefreshing }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'expenses' | 'settings'>('overview');

  const approveDonation = (id: string) => {
    const donation = data.pendingIncomes.find(d => d.id === id);
    if (donation) {
      setData(prev => ({
        ...prev,
        pendingIncomes: prev.pendingIncomes.filter(d => d.id !== id),
        incomes: [...prev.incomes, { ...donation }]
      }));
    }
  };

  const rejectDonation = (id: string) => {
    setData(prev => ({
      ...prev,
      pendingIncomes: prev.pendingIncomes.filter(d => d.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
           <div>
             <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Admin Dashboard</h2>
             <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">Ogah Ribetzzz Management</p>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
             <button 
               onClick={onRefresh} 
               disabled={isRefreshing}
               className="flex-1 md:flex-none px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
               <LucideRefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
               {isRefreshing ? 'Syncing...' : 'Sinkronkan'}
             </button>
             <button onClick={onLogout} className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
               <LucideLogOut size={18} /> Logout
             </button>
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="space-y-2 lg:col-span-1">
              {[
                { id: 'overview', label: 'Ringkasan', icon: <LucideHome size={18}/> },
                { id: 'donations', label: 'Donasi & Masuk', icon: <LucideHeartHandshake size={18}/> },
                { id: 'expenses', label: 'Pengeluaran', icon: <LucideTable size={18}/> },
                { id: 'settings', label: 'Pengaturan', icon: <LucideSettings size={18}/> },
              ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                 >
                   {tab.icon}
                   {tab.label}
                 </button>
              ))}
           </div>
           
           <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl min-h-[60vh] border border-slate-100">
              {activeTab === 'overview' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-800">Statistik Yayasan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Masuk</p>
                          <p className="text-2xl font-black text-slate-800 mt-2 break-all">{formatCurrency(data.incomes.reduce((a, b) => a + b.amount, 0))}</p>
                       </div>
                       <div className="p-6 bg-violet-50 rounded-3xl border border-violet-100">
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Total Keluar</p>
                          <p className="text-2xl font-black text-slate-800 mt-2 break-all">{formatCurrency(data.expenses.reduce((a, b) => a + (b.unitPrice * b.qty), 0))}</p>
                       </div>
                       <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Saldo Tersisa</p>
                          <p className="text-2xl font-black text-slate-800 mt-2 break-all">
                             {formatCurrency(data.incomes.reduce((a, b) => a + b.amount, 0) - data.expenses.reduce((a, b) => a + (b.unitPrice * b.qty), 0))}
                          </p>
                       </div>
                    </div>
                 </div>
              )}
              {activeTab === 'donations' && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-800">Verifikasi Masuk</h3>
                    <div className="space-y-4">
                       {data.pendingIncomes.length === 0 ? (
                         <p className="text-slate-300 font-bold text-center py-10 uppercase text-xs">Semua data telah terverifikasi</p>
                       ) : (
                         data.pendingIncomes.map(item => (
                           <div key={item.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden">
                                  {item.proofImage ? <img src={item.proofImage} className="w-full h-full object-cover" /> : <LucideImage className="text-slate-400" />}
                                </div>
                                <div>
                                  <p className="font-black text-slate-800">{item.donorName}</p>
                                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(item.amount)}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => approveDonation(item.id)} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100"><LucideCheck size={18}/></button>
                                <button onClick={() => rejectDonation(item.id)} className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-100"><LucideX size={18}/></button>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                 </div>
              )}
              {activeTab !== 'overview' && activeTab !== 'donations' && (
                 <div className="text-center py-20 text-slate-300 font-bold uppercase text-xs tracking-widest">Fitur Sedang Dalam Pengembangan</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('ogah_foundation_portal_v1');
    if (!saved) return INITIAL_DATA;
    try {
      const parsed = JSON.parse(saved);
      // PENGATURAN MIGRASI: Jika link gambar di storage adalah Google Drive (lama), paksa reset ke ASSETS lokal.
      const mergedLayout = { ...INITIAL_DATA.layout, ...parsed.layout };
      
      if (mergedLayout.logoUrl?.includes('drive.google.com')) {
         mergedLayout.logoUrl = ASSETS.LOGO;
      }
      if (mergedLayout.qrisImageUrl?.includes('drive.google.com')) {
         mergedLayout.qrisImageUrl = ASSETS.QRIS;
      }
      
      return { 
        ...INITIAL_DATA, 
        ...parsed,
        layout: mergedLayout
      };
    } catch {
      return INITIAL_DATA;
    }
  });
  
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [qrisError, setQrisError] = useState(false);
  
  const [confName, setConfName] = useState('');
  const [confAmount, setConfAmount] = useState('');
  const [confImageFile, setConfImageFile] = useState<File | null>(null);
  const [confImagePreview, setConfImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const SHARED_SHEET_URL = "https://script.google.com/macros/s/AKfycbwiOK1cSZRMjZR3oWDz_PWUm530bWPuaN32dOK_9crpmzeyQAolegpOL23r9F8Cgsnl/exec";

  const fetchData = useCallback(async (isManual = false) => {
    if (!SHARED_SHEET_URL) return;
    setIsDataLoading(true);
    if (isManual) setFetchError('');
    
    try {
      const targetUrl = new URL(SHARED_SHEET_URL);
      targetUrl.searchParams.append('t', String(new Date().getTime()));
      
      const response = await fetch(targetUrl.toString());
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const text = await response.text();
      if (text.trim().startsWith('<')) throw new Error('Akses Script Ditolak. Periksa Izin Deployment.');
      
      const cloudData = JSON.parse(text);
      if (cloudData) {
        const cleanedIncomes = (cloudData.incomes || []).map((i: any) => ({ ...i, amount: Number(i.amount) || 0 }));
        const cleanedPending = (cloudData.pendingIncomes || []).map((i: any) => ({ ...i, amount: Number(i.amount) || 0 }));
        const cleanedExpenses = (cloudData.expenses || []).map((e: any) => ({ ...e, unitPrice: Number(e.unitPrice) || 0, qty: Number(e.qty) || 0 }));

        setData(prev => ({
          ...prev,
          incomes: cleanedIncomes,
          pendingIncomes: cleanedPending,
          expenses: cleanedExpenses,
          articles: cloudData.articles || [],
          gallery: cloudData.gallery || [],
        }));
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      setFetchError(error.message);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    try {
      localStorage.setItem('ogah_foundation_portal_v1', JSON.stringify(data));
      setStorageError(false);
    } catch (e) {
      if (e instanceof DOMException) setStorageError(true);
    }
  }, [data]);

  useEffect(() => {
    if (accessCode === APP_CONFIG.SECRET_CODE) {
      setShowLoginModal(true);
      setAccessCode('');
    }
  }, [accessCode]);

  const totalIncome = useMemo(() => data.incomes.reduce((acc, curr) => acc + curr.amount, 0), [data.incomes]);
  const totalExpense = useMemo(() => data.expenses.reduce((acc, curr) => acc + (curr.unitPrice * curr.qty), 0), [data.expenses]);
  const balance = totalIncome - totalExpense;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === APP_CONFIG.ADMIN_USERNAME && password === APP_CONFIG.ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setUsername(''); setPassword('');
      setCurrentView('admin');
    } else {
      setLoginError('Kredensial salah');
    }
  };

  const handleConfirmDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let base64Image = '';
    if (confImageFile) base64Image = await fileToBase64(confImageFile);
    
    const localDate = getLocalISODate();
    const newPending: Income = {
      id: crypto.randomUUID(),
      donorName: confName.trim() || 'Hamba Allah',
      amount: parseInt(confAmount) || 0,
      date: localDate,
      proofImage: base64Image
    };

    if (SHARED_SHEET_URL) {
      try {
        await fetch(SHARED_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'DONASI_PENDING', ...newPending })
        });
      } catch (err) { console.error(err); }
    }
    
    setTimeout(() => {
      setData(prev => ({ ...prev, pendingIncomes: [...prev.pendingIncomes, newPending] }));
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => { 
        setSubmitSuccess(false); 
        setShowQrisModal(false); 
        setConfName(''); 
        setConfAmount(''); 
        setConfImagePreview(null); 
        setConfImageFile(null); 
      }, 2500);
    }, 2000);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const { layout } = data;
  const primaryColorClass = layout.primaryColor || 'indigo';

  if (isAdmin && currentView === 'admin') {
    return (
      <AdminDashboard 
        data={data} 
        setData={setData} 
        onLogout={() => { setIsAdmin(false); setCurrentView('home'); }} 
        formatCurrency={formatCurrency} 
        storageError={storageError}
        sheetUrl={SHARED_SHEET_URL}
        onRefresh={() => fetchData(true)}
        isRefreshing={isDataLoading}
      />
    );
  }

  return (
    <div className={`min-h-screen ${layout.themeMode === 'soft' ? 'bg-slate-100' : 'bg-slate-50'} text-slate-900 transition-all duration-500 pb-12`} style={{ fontFamily: layout.fontFamily }}>
      
      {/* GLOBAL LOADING */}
      {isDataLoading && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center">
          <LucideLoader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="font-black text-slate-400 text-sm uppercase tracking-widest animate-pulse tracking-tighter">Memperbarui Data...</p>
        </div>
      )}

      {/* ERROR ALERT */}
      {fetchError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
           <LucideAlertTriangle className="w-5 h-5" />
           <span className="text-xs font-bold">{fetchError}</span>
           <button onClick={() => setFetchError('')}><LucideX className="w-4 h-4" /></button>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-md border border-slate-50 p-1">
              {!logoError ? (
                <img 
                  src={layout.logoUrl} 
                  alt="Ogah Ribetzzz Logo" 
                  className="w-full h-full object-contain" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs">OR</div>
              )}
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-800">
              Ogah<span className="text-indigo-600">Ribetzzz</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-black uppercase text-[11px] tracking-widest text-slate-400">
            <button onClick={() => setCurrentView('home')} className={`transition-all hover:scale-105 ${currentView === 'home' ? 'text-indigo-600' : 'hover:text-slate-600'}`}>Beranda</button>
            <button onClick={() => setCurrentView('transparency')} className={`transition-all hover:scale-105 ${currentView === 'transparency' ? 'text-indigo-600' : 'hover:text-slate-600'}`}>Transparansi</button>
            <button onClick={() => setCurrentView('gallery')} className={`transition-all hover:scale-105 ${currentView === 'gallery' ? 'text-indigo-600' : 'hover:text-slate-600'}`}>Dokumentasi</button>
            <button onClick={() => setCurrentView('articles')} className={`transition-all hover:scale-105 ${currentView === 'articles' ? 'text-indigo-600' : 'hover:text-slate-600'}`}>Warta</button>
            <button onClick={() => setShowLoginModal(true)} className="p-2.5 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"><LucideLock className="w-4 h-4" /></button>
          </div>
          <button className="md:hidden p-2 text-slate-400" onClick={() => setShowLoginModal(true)}><LucideLock className="w-6 h-6" /></button>
        </div>
      </nav>

      <main className="pt-24 animate-in fade-in duration-700">
        {currentView === 'home' && (
          <div className="space-y-24">
            <section className="px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 py-12 md:py-24">
              <div className="flex-1 space-y-8 text-center md:text-left">
                <div className="inline-flex px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-black text-xs uppercase tracking-widest animate-bounce-subtle">Digital Kreatif & Kemanusiaan</div>
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                  {layout.foundationName}
                </h1>
                <h2 className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                  {layout.foundationDescription}
                </h2>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                  <button onClick={() => setCurrentView('transparency')} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-3 text-lg">
                    Cek Transparansi <LucideArrowRight className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowQrisModal(true)} className="px-10 py-5 bg-white text-slate-800 rounded-2xl font-black shadow-xl hover:bg-slate-50 transition-all border border-slate-100 text-lg">
                    Bantu Sesama
                  </button>
                </div>
              </div>
              <div className="flex-1 relative group">
                <div className="absolute -inset-6 bg-indigo-600/10 rounded-[5rem] blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                <img src={layout.heroImageUrl} className="relative w-full aspect-square md:aspect-[4/5] object-cover rounded-[3.5rem] shadow-2xl border-8 border-white" alt="Impact" />
              </div>
            </section>
          </div>
        )}

        {currentView === 'transparency' && (
          <div className="max-w-6xl mx-auto px-6 space-y-12 pb-24">
             <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight text-slate-800 uppercase">Audit Dana Terbuka</h2>
              <div className="flex flex-col items-center gap-4">
                 <p className="text-slate-500 max-w-lg mx-auto">Sinkronisasi langsung dari pembukuan yayasan digital kreatif kami.</p>
                 <button onClick={() => fetchData(true)} className="flex items-center gap-2 px-6 py-2 bg-white rounded-full text-xs font-black uppercase tracking-widest text-slate-400 border border-slate-100 hover:text-slate-800 transition-all shadow-sm">
                    <LucideRefreshCw size={14} className={isDataLoading ? 'animate-spin' : ''}/> Sync Database
                 </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 border-l-8 border-l-emerald-500 flex flex-col justify-between min-h-[160px]">
                  <div>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2">Total Pemasukan</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-800 tabular-nums tracking-tighter leading-none break-all">{formatCurrency(totalIncome)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                    <LucideArrowRight size={14} className="rotate-45"/> <span>Dana Terkumpul</span>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 border-l-8 border-l-violet-500 flex flex-col justify-between min-h-[160px]">
                  <div>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2">Total Pengeluaran</p>
                    <p className="text-3xl md:text-4xl font-black text-slate-800 tabular-nums tracking-tighter leading-none break-all">{formatCurrency(totalExpense)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-violet-600 font-bold text-xs uppercase tracking-widest">
                    <LucideArrowRight size={14} className="-rotate-45"/> <span>Dana Tersalurkan</span>
                  </div>
                </div>

                <div className={`bg-indigo-900 p-8 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden group min-h-[160px]`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <p className="text-indigo-200 text-[11px] font-black uppercase tracking-widest mb-2">Saldo Tersisa Saat Ini</p>
                    <p className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter leading-none break-all">{formatCurrency(balance)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-indigo-400 font-bold text-xs relative z-10 uppercase tracking-widest">
                    <LucideDatabase size={14}/> <span>Cadangan Tersisa</span>
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 h-fit">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-tight">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm"><LucideArrowRight className="w-5 h-5 rotate-45" /></div>
                      Riwayat Donasi
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
                       {data.incomes.length === 0 ? (
                          <p className="text-slate-300 text-xs font-bold text-center py-10 uppercase tracking-widest">Belum ada data masuk</p>
                       ) : (
                          [...data.incomes].reverse().map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm shadow-sm">
                                      {item.donorName.charAt(0).toUpperCase()}
                                    </div>
                                    <div><p className="font-black text-slate-800 text-base">{item.donorName}</p></div>
                                </div>
                                <div className="text-right"><p className="font-black text-emerald-600 text-base">{formatCurrency(item.amount)}</p></div>
                            </div>
                          ))
                       )}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 h-fit">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-tight">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm"><LucideArrowRight className="w-5 h-5 -rotate-45" /></div>
                      Riwayat Pengeluaran
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
                       {data.expenses.length === 0 ? (
                          <p className="text-slate-300 text-xs font-bold text-center py-10 uppercase tracking-widest">Belum ada data keluar</p>
                       ) : (
                          [...data.expenses].reverse().map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all hover:translate-x-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm">
                                      {item.itemName.charAt(0).toUpperCase()}
                                    </div>
                                    <div><p className="font-black text-slate-800 text-base">{item.itemName}</p></div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-indigo-500 text-base">{formatCurrency(item.unitPrice * item.qty)}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">{item.qty} Unit</p>
                                </div>
                            </div>
                          ))
                       )}
                    </div>
                  </div>
            </div>
          </div>
        )}

        {currentView === 'gallery' && (
           <div className="max-w-6xl mx-auto px-6 pb-24 space-y-12">
             <h2 className="text-center text-4xl font-black tracking-tight text-slate-800 uppercase">Jejak Kebaikan</h2>
             <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                {data.gallery.map((item) => (
                  <div key={item.id} className="break-inside-avoid relative overflow-hidden rounded-[2rem] bg-white shadow-xl group">
                    <img src={item.url} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt={item.caption} />
                  </div>
                ))}
             </div>
           </div>
        )}
      </main>

      {/* QRIS MODAL */}
      {showQrisModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[450px] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[95vh] p-8">
            <button onClick={() => setShowQrisModal(false)} className="self-end p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-all"><LucideX className="w-6 h-6" /></button>
            <div className="overflow-y-auto pr-2 scrollbar-hide flex-grow mt-2 text-center">
              <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 shadow-sm"><LucideQrCode className="w-8 h-8" /></div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">Scan untuk Donasi</h3>
              <div className="bg-white p-2 rounded-3xl border-2 border-slate-50 shadow-inner inline-block mb-6 min-h-[100px] flex items-center justify-center">
                {!qrisError ? (
                  <img 
                    src={layout.qrisImageUrl} 
                    alt="QRIS Flyer" 
                    className="w-full h-auto rounded-xl shadow-lg" 
                    onError={() => setQrisError(true)}
                  />
                ) : (
                  <div className="p-10 text-slate-400 flex flex-col items-center gap-2">
                    <LucideAlertTriangle className="w-10 h-10" />
                    <p className="text-xs font-black uppercase text-center">QRIS tidak tampil?<br/>Cek folder Logo/qris.png</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-slate-100 pt-6 space-y-4 text-left">
                <h4 className="font-black text-lg text-slate-800">Konfirmasi Pembayaran</h4>
                {submitSuccess ? (
                  <div className="bg-emerald-50 text-emerald-700 p-8 rounded-3xl text-center border border-emerald-100 animate-in zoom-in">
                    <LucideCheckCircle2 className="w-10 h-10 mx-auto mb-3" />
                    <h5 className="font-black text-lg">Konfirmasi Berhasil!</h5>
                    <p className="text-xs font-medium mt-1">Terima kasih atas kebaikan Anda.</p>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmDonation} className="space-y-4">
                    <input type="text" placeholder="Nama Anda (Opsional)" value={confName} onChange={(e) => setConfName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 outline-none font-bold bg-slate-50/50" />
                    <input required type="number" placeholder="Nominal Rp" value={confAmount} onChange={(e) => setConfAmount(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 outline-none font-black bg-slate-50/50 text-lg" />
                    <div className="relative p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                       <input required type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setConfImageFile(file); const r = new FileReader(); r.onload = () => setConfImagePreview(r.result as string); r.readAsDataURL(file); } }} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                       <LucideUpload className={`${confImagePreview ? 'text-emerald-500' : 'text-slate-300'} w-8 h-8`} />
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{confImagePreview ? 'Bukti Terpilih' : 'Klik Upload Bukti'}</span>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50">
                      {isSubmitting ? <><LucideLoader2 className="animate-spin w-6 h-6"/> <span>Memproses...</span></> : 'Kirim Konfirmasi'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-sm rounded-3xl shadow-2xl p-10 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-center text-slate-800 tracking-tighter mb-8">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input autoFocus type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-6 py-4 rounded-xl border-2 border-slate-50 focus:border-indigo-600 outline-none font-bold bg-slate-50/50" placeholder="Username" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-xl border-2 border-slate-50 focus:border-indigo-600 outline-none font-bold bg-slate-50/50" placeholder="Password" />
              {loginError && <p className="text-rose-500 text-[10px] text-center font-black uppercase tracking-widest">{loginError}</p>}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 py-4 font-bold text-slate-400 text-sm uppercase">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-lg text-sm uppercase tracking-widest">Masuk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="fixed bottom-4 left-0 w-full flex justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <input type="password" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="..." className="w-12 h-6 text-center bg-transparent border-none text-[8px] text-slate-300 pointer-events-auto outline-none" />
      </footer>
    </div>
  );
};

export default App;