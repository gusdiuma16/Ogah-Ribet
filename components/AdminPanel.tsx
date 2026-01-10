import React, { useState } from 'react';
import { Lock, Save, LayoutTemplate, Users, Kanban, CheckCircle, Loader2, UploadCloud, ImageIcon } from 'lucide-react';
import { dataService } from '../services/dataService';

type AdminTab = 'hero' | 'program' | 'talent';

export const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Form States
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '' });
  const [programForm, setProgramForm] = useState({ name: '', progress: 0, status: 'Planning' });
  const [talentForm, setTalentForm] = useState({ name: '', role: '', skills: '', avatarUrl: '', available: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'jatihub2025') {
      setIsAuthenticated(true);
    } else {
      alert('Access Denied');
    }
  };

  const showNotification = (msg: string, type: 'success'|'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    
    try {
      if (activeTab === 'talent') {
        if (selectedFile) setLoadingText('Uploading Image to Drive...');
        else setLoadingText('Syncing Talent Data...');
        
        await dataService.addTalent(talentForm, selectedFile);
        
        // Clear file input after success
        setSelectedFile(null);
        setPreviewUrl(null);
        setTalentForm({ name: '', role: '', skills: '', avatarUrl: '', available: true });

      } else if (activeTab === 'program') {
        setLoadingText('Updating Program List...');
        await dataService.addProgram(programForm);
        setProgramForm({ name: '', progress: 0, status: 'Planning' });

      } else if (activeTab === 'hero') {
        setLoadingText('Updating Hero Content...');
        await dataService.updateHero(heroForm);
      }
      
      showNotification(`${activeTab.toUpperCase()} updated successfully!`, 'success');
      
    } catch (error: any) {
      console.error(error);
      showNotification(`Error: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
      setLoadingText('Processing...');
    }
  };

  // --- Render Helpers ---

  const renderTabButton = (id: AdminTab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 w-full md:w-auto text-left mb-2 md:mb-0
        ${activeTab === id 
          ? 'bg-accent-sky/10 text-accent-sky border border-accent-sky/50 shadow-[0_0_15px_-5px_#38BDF8]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );

  const InputField = ({ label, ...props }: any) => (
    <div className="mb-4">
      <label className="block text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">{label}</label>
      <input 
        className="w-full bg-space-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-sky/50 focus:ring-1 focus:ring-accent-sky/50 transition-all placeholder-gray-600"
        {...props} 
      />
    </div>
  );

  // --- Auth Gate ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-sky to-accent-indigo"></div>
        <div className="w-full max-w-md p-8 bg-space-800/50 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-space-900 to-space-800 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 text-accent-sky" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Restricted Area</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Enter admin credentials to access JatiHub CMS</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-space-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-sky/50 text-center tracking-widest"
              placeholder="••••••••"
            />
            <button type="submit" className="w-full bg-white text-space-900 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg transform active:scale-95">
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <div className="min-h-screen bg-space-900 p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">JatiHub <span className="text-accent-sky">CMS</span></h1>
            <p className="text-gray-400 text-sm mt-1">Content Management System v2.0</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              System Online
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-500 hover:text-white transition-colors">Logout</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            {renderTabButton('hero', 'Hero Section', <LayoutTemplate className="w-5 h-5" />)}
            {renderTabButton('program', 'Program Kerja', <Kanban className="w-5 h-5" />)}
            {renderTabButton('talent', 'Talent Directory', <Users className="w-5 h-5" />)}
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-space-800 to-space-900 border border-white/5">
              <h4 className="text-white font-semibold mb-2 text-sm">Auth Config</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                Ensure <code>GOOGLE_ACCESS_TOKEN</code> is set in <code>constants.ts</code> for Write operations.
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-500"></div>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-3">
            <div className="bg-space-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-sky/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  {activeTab === 'hero' && <><LayoutTemplate className="text-accent-sky" /> Edit Hero Content</>}
                  {activeTab === 'program' && <><Kanban className="text-accent-sky" /> Update Program Status</>}
                  {activeTab === 'talent' && <><Users className="text-accent-sky" /> Add New Talent</>}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="relative z-10 max-w-2xl">
                
                {/* --- HERO FORM --- */}
                {activeTab === 'hero' && (
                  <div className="space-y-6 animate-fade-in">
                    <InputField 
                      label="Main Headline" 
                      placeholder="e.g. Jati Cempaka Future Hub" 
                      value={heroForm.title}
                      onChange={(e: any) => setHeroForm({...heroForm, title: e.target.value})}
                    />
                    <div>
                      <label className="block text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">Sub Headline</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-space-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-sky/50 transition-all placeholder-gray-600 resize-none"
                        placeholder="e.g. Platform kolaborasi digital Gen-Z..."
                        value={heroForm.subtitle}
                        onChange={(e: any) => setHeroForm({...heroForm, subtitle: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {/* --- PROGRAM FORM --- */}
                {activeTab === 'program' && (
                  <div className="space-y-6 animate-fade-in">
                    <InputField 
                      label="Program Name" 
                      placeholder="e.g. Digital Workshop 2025" 
                      value={programForm.name}
                      onChange={(e: any) => setProgramForm({...programForm, name: e.target.value})}
                    />
                    <div>
                      <label className="block text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider flex justify-between">
                        <span>Progress</span>
                        <span className="text-accent-sky">{programForm.progress}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        className="w-full h-2 bg-space-900 rounded-lg appearance-none cursor-pointer accent-accent-sky"
                        value={programForm.progress}
                        onChange={(e: any) => setProgramForm({...programForm, progress: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">Status</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Planning', 'In Progress', 'Completed'].map((status) => (
                          <div 
                            key={status}
                            onClick={() => setProgramForm({...programForm, status})}
                            className={`cursor-pointer text-center py-3 rounded-lg border transition-all text-sm font-medium
                              ${programForm.status === status 
                                ? 'bg-accent-sky/20 border-accent-sky text-white' 
                                : 'bg-space-900/50 border-white/10 text-gray-400 hover:border-white/30'
                              }`}
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TALENT FORM --- */}
                {activeTab === 'talent' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Full Name" 
                        placeholder="e.g. Sarah Putri" 
                        value={talentForm.name}
                        onChange={(e: any) => setTalentForm({...talentForm, name: e.target.value})}
                      />
                      <InputField 
                        label="Role / Title" 
                        placeholder="e.g. Graphic Designer" 
                        value={talentForm.role}
                        onChange={(e: any) => setTalentForm({...talentForm, role: e.target.value})}
                      />
                    </div>
                    <InputField 
                      label="Skills (Comma Separated)" 
                      placeholder="e.g. Photoshop, Illustrator, Figma" 
                      value={talentForm.skills}
                      onChange={(e: any) => setTalentForm({...talentForm, skills: e.target.value})}
                    />
                    
                    {/* IMAGE UPLOAD SECTION */}
                    <div>
                       <label className="block text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">Avatar / Photo</label>
                       
                       <div className="flex gap-4 items-start">
                         {/* File Input */}
                         <div className="flex-1">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-space-900/50 hover:bg-space-900 hover:border-accent-sky/50 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span> to Drive</p>
                                    <p className="text-xs text-gray-500">JPG, PNG (MAX. 2MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                         </div>

                         {/* Preview */}
                         {previewUrl && (
                           <div className="w-32 h-32 rounded-lg border border-white/10 overflow-hidden relative group">
                             <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                             <button 
                               type="button"
                               onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                               className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <div className="w-3 h-3 flex items-center justify-center">x</div>
                             </button>
                           </div>
                         )}
                       </div>
                    </div>

                    <div className="flex items-center gap-3 bg-space-900/50 p-4 rounded-lg border border-white/10">
                      <input 
                        type="checkbox" 
                        id="available"
                        checked={talentForm.available}
                        onChange={(e) => setTalentForm({...talentForm, available: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-600 text-accent-sky focus:ring-accent-sky bg-space-900" 
                      />
                      <label htmlFor="available" className="text-sm text-gray-300 font-medium cursor-pointer">Available for Hire / Projects</label>
                    </div>
                  </div>
                )}

                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                  {notification ? (
                    <div className={`text-sm font-medium flex items-center gap-2 ${notification.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
                      {notification.msg}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">Ready to sync</span>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-accent-sky to-accent-indigo text-space-900 font-bold hover:shadow-[0_0_20px_-5px_#38BDF8] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {loading ? loadingText : 'Save Changes'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};