
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Registration, AdminSettings, PersonalData } from './types';
import Input from './components/Input';
import RadioGroup from './components/RadioGroup';
import ConfirmationModal from './components/ConfirmationModal';
import ETicketCard from './components/ETicketCard';
import AdminDashboard from './components/AdminDashboard';
import WelcomeOverlay from './components/WelcomeOverlay';
import AdminLogin from './components/AdminLogin';
import Select from './components/Select';
import { 
  ShieldCheck, ArrowRight, Ticket, CheckCircle2, 
  RefreshCw, Search, Camera, Lock, Edit3, Sun, Menu, X
} from 'lucide-react';

const SETTINGS_KEY = 'jejak_langkah_admin_settings';
const DEFAULT_SETTINGS: AdminSettings = {
  googleScriptUrl: '', 
  spreadsheetId: '',   
  adminPhone: '+62 812-3456-7890',
  adminEmail: 'jejaklangkah.nusantara.id@gmail.com'
};

const MOUNTAINS = [
  "Semeru", "Kerinci", "Merbabu", "Rinjani", 
  "Prau", "Lawu", "Sindoro", "Sumbing", 
  "Dempo", "Gede", "Pangrango", "Ciremai", 
  "Seminung", "Pesagi", "Tanggamus", "Kembang", 
  "Slamet"
];

const LAYANAN_OPTIONS = ["OPEN TRIP", "PRIVATE TRIP", "SHARECOST"];
const PAKET_OPTIONS = ["PAKET A", "PAKET B", "REGULER"];

const BrandLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15L85 85H15L50 15Z" fill="currentColor" />
    <path d="M50 40L68 85H32L50 40Z" fill="black" fillOpacity="0.25" />
    <path d="M42 75L58 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 65L54 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'register' | 'check'>('register');
  const [checkId, setCheckId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState<PersonalData>({
    fullName: '', whatsapp: '', email: '', address: '', mountain: '',
    packageCategory: 'OPEN TRIP', tripPackage: 'REGULER', 
    startDate: new Date().toISOString().split('T')[0], identityImage: ''
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastReg, setLastReg] = useState<Registration | null>(null);

  const formProgress = useMemo(() => {
    const fields = [
      { name: 'Nama', filled: !!formData.fullName },
      { name: 'WhatsApp', filled: !!formData.whatsapp },
      { name: 'Gunung', filled: !!formData.mountain },
      { name: 'Identitas', filled: !!formData.identityImage }
    ];
    const completed = fields.filter(f => f.filled).length;
    return {
      percentage: Math.round((completed / fields.length) * 100),
      isComplete: completed === fields.length,
      nextField: fields.find(f => !f.filled)?.name || ''
    };
  }, [formData]);

  const handleCheckTicket = () => {
    if (!checkId.trim()) return alert("Masukkan ID/WhatsApp Anda");
    setIsSearching(true);
    
    setTimeout(() => {
      const found = registrations.find(reg => 
        reg.id.toString().endsWith(checkId) || 
        reg.id.toString() === checkId || 
        reg.whatsapp.includes(checkId)
      );
      
      if (found) {
        setLastReg(found);
      } else {
        alert("Tiket tidak ditemukan. Silakan periksa kembali data Anda.");
      }
      setIsSearching(false);
    }, 800);
  };

  const handleRegister = async () => {
    setIsSending(true);
    const newReg: Registration = { ...formData, id: Date.now(), status: 'Menunggu Verifikasi', timestamp: new Date().toLocaleString('id-ID') };
    try {
      setRegistrations(prev => [newReg, ...prev]);
      setLastReg(newReg);
      setIsSuccess(true);
      setIsSending(false);
      setFormData({
        fullName: '', whatsapp: '', email: '', address: '', mountain: '',
        packageCategory: 'OPEN TRIP', tripPackage: 'REGULER', 
        startDate: new Date().toISOString().split('T')[0], identityImage: ''
      });
    } catch (err) { 
      alert("Gagal mengirim data pendaftaran."); 
      setIsSending(false); 
    }
  };

  const handleSettingsUpdate = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  if (showWelcome) return <WelcomeOverlay onStart={() => setShowWelcome(false)} />;
  if (isAdminMode && !isAuthenticated) return <AdminLogin onLogin={(u, p) => (u === 'admin' && p === 'admin123' ? setIsAuthenticated(true) : alert("Username atau password salah!"))} onBack={() => setIsAdminMode(false)} />;
  
  if (isAdminMode && isAuthenticated) return (
    <div className="min-h-screen bg-navy-950 px-4 md:px-8 py-8 md:py-16">
      <div className="max-w-7xl mx-auto">
        <AdminDashboard 
          data={registrations} 
          initialSettings={settings} 
          onSettingsUpdate={handleSettingsUpdate}
          onLogout={() => { setIsAuthenticated(false); setIsAdminMode(false); }} 
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-950 text-white selection:bg-brand-red overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8 md:py-6 flex justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between bg-navy-900/60 backdrop-blur-3xl border border-white/5 p-2 md:p-3 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer pl-3 group" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-2xl flex items-center justify-center shadow-glow-red group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
              <BrandLogo className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-none italic group-hover:text-brand-red transition-colors">Jejak Langkah</h2>
              <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1.5 opacity-60">Adventure Expedition</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button 
              onClick={() => setViewMode('register')}
              className={`flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3.5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === 'register' ? 'bg-brand-red text-white shadow-glow-red' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Edit3 size={14} /> <span className="hidden sm:inline">Formulir</span>
            </button>
            <button 
              onClick={() => setViewMode('check')}
              className={`flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3.5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === 'check' ? 'bg-brand-red text-white shadow-glow-red' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Ticket size={14} /> <span className="hidden sm:inline">Tiket Saya</span>
            </button>
            <div className="w-px h-6 bg-white/10 mx-1 md:mx-2" />
            <button 
              onClick={() => setIsAdminMode(true)}
              className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
            >
              <Lock size={14} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-28 md:pt-40 pb-20">
        {!lastReg ? (
          viewMode === 'register' ? (
            <div className="space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="max-w-4xl space-y-4 text-center md:text-left mx-auto md:mx-0">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                  Jelajahi <span className="text-brand-red">Puncak</span> <br className="hidden md:block"/> Tertinggi.
                </h1>
                <p className="text-slate-500 text-sm md:text-xl font-medium tracking-tight max-w-2xl">
                  Sistem reservasi ekspedisi otomatis. Cepat, aman, dan terpercaya untuk petualangan Nusantara.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                <div className="lg:col-span-7 bg-navy-900/40 border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 space-y-10 backdrop-blur-md shadow-glow-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white font-black text-lg shadow-glow-red">1</div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">Informasi Personal</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <Input label="Nama Lengkap" placeholder="Sesuai KTP" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    <Input label="WhatsApp" placeholder="0812..." value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                  </div>
                  
                  <Input label="Email Aktif" type="email" placeholder="nama@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  
                  <Input 
                    label="Alamat Pengiriman Logistik" 
                    isTextArea 
                    placeholder="Masukkan alamat lengkap untuk keperluan logistik..." 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                  />

                  <div className="pt-4 border-t border-white/5">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full py-8 md:py-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden group ${formData.identityImage ? 'border-brand-red/50 bg-brand-red/5' : 'border-white/10 hover:border-brand-red/30 bg-navy-950/30'}`}
                    >
                      {formData.identityImage ? (
                        <>
                          <img src={formData.identityImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Identity" />
                          <CheckCircle2 size={32} className="text-brand-red relative z-10" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red relative z-10">ID Terunggah</span>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Camera size={28} className="text-slate-600 group-hover:text-brand-red transition-colors" />
                          </div>
                          <div className="text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block">Upload KTP / SIM</span>
                            <span className="text-[8px] font-medium text-slate-600 uppercase tracking-widest mt-1">Format: JPG, PNG (Max 5MB)</span>
                          </div>
                        </>
                      )}
                      <input type="file" ref={fileInputRef} onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () => setFormData({...formData, identityImage: r.result as string});
                          r.readAsDataURL(file);
                        }
                      }} className="hidden" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6 md:gap-10">
                  <div className="bg-navy-900/40 border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 space-y-10 backdrop-blur-md shadow-glow-white">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-black text-lg">2</div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">Detail Trip</h3>
                    </div>

                    <Select label="Tujuan Gunung" options={MOUNTAINS} value={formData.mountain} onChange={e => setFormData({...formData, mountain: e.target.value})} />
                    <Input label="Tanggal Mulai Ekspedisi" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                    
                    <div className="space-y-8 pt-4">
                       <RadioGroup label="Kategori Layanan" variant="segment" options={LAYANAN_OPTIONS} value={formData.packageCategory} onChange={v => setFormData({...formData, packageCategory: v})} />
                       <RadioGroup label="Pilihan Paket" variant="segment" options={PAKET_OPTIONS} value={formData.tripPackage} onChange={v => setFormData({...formData, tripPackage: v})} />
                    </div>
                  </div>

                  <div className="px-2 space-y-4">
                    <button 
                      onClick={() => setIsConfirmOpen(true)}
                      disabled={!formProgress.isComplete}
                      className="animate-shimmer w-full py-6 md:py-8 bg-brand-red text-white font-black uppercase tracking-[0.3em] rounded-3xl shadow-glow-red flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all duration-500 disabled:opacity-20 disabled:scale-100 text-xs md:text-sm"
                    >
                      {formProgress.isComplete ? (
                        <>Kirim Pendaftaran <ArrowRight size={20} /></>
                      ) : (
                        <>Lengkapi Data <Lock size={18} className="opacity-50" /></>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-3 text-slate-700">
                       <div className="h-px w-8 bg-white/5" />
                       <span className="text-[9px] font-black uppercase tracking-[0.3em]">Jejak Langkah System v1.5</span>
                       <div className="h-px w-8 bg-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-16 md:py-24 space-y-12">
               <div className="text-center space-y-6">
                 <div className="w-24 h-24 md:w-32 md:h-32 bg-brand-red rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center mx-auto text-white shadow-glow-red rotate-6">
                   <BrandLogo className="w-12 h-12 md:w-16 md:h-16 text-white" />
                 </div>
                 <div className="space-y-2">
                   <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Lacak <span className="text-brand-red">Tiket</span></h2>
                   <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Masukkan ID atau WhatsApp Anda</p>
                 </div>
               </div>
               <div className="bg-navy-900/40 p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] border border-white/5 shadow-2xl space-y-8 backdrop-blur-md">
                  <Input label="Booking ID / WhatsApp" placeholder="Contoh: 08123456789 atau ID Pendaftaran" value={checkId} onChange={e => setCheckId(e.target.value)} />
                  <button onClick={handleCheckTicket} className="w-full py-6 md:py-8 bg-white text-navy-950 font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-brand-red hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 text-xs md:text-sm">
                    {isSearching ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                    Verifikasi Status
                  </button>
               </div>
            </div>
          )
        ) : (
          <div className="animate-in zoom-in-95 duration-700 space-y-12 max-w-4xl mx-auto">
            <ETicketCard registration={lastReg} />
            <button 
              onClick={() => setLastReg(null)} 
              className="w-full py-6 bg-navy-900/40 border border-white/10 rounded-3xl font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:bg-navy-900 transition-all text-[10px]"
            >
              Kembali Ke Menu Utama
            </button>
          </div>
        )}
      </main>

      <ConfirmationModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleRegister} 
        data={formData} 
        isSending={isSending} 
        isSuccess={isSuccess} 
        successId={lastReg?.id} 
        bankInfo={{ bankName: "BANK BCA", accountNumber: "8691 2345 67", accountName: "JEJAK LANGKAH ADVENTURE" }} 
      />
    </div>
  );
};

export default App;
