
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Registration, AdminSettings } from '../types';
import * as XLSX from 'xlsx';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Bell, RefreshCw, Download, Search, X, Edit2, Check, Eye, Mail, Smartphone, Home, Filter, ChevronRight } from 'lucide-react';

interface DashboardProps {
  data: Registration[];
  onUpdateStatus?: (id: number, newStatus: string) => void;
  onUpdateRegistration?: (reg: Registration) => void;
  onSettingsUpdate?: (settings: AdminSettings) => void;
  initialSettings: AdminSettings;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<DashboardProps> = ({ 
  data: localData, 
  onUpdateStatus, 
  onUpdateRegistration,
  onSettingsUpdate, 
  onLogout, 
  initialSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'table' | 'settings'>('overview');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [cloudData, setCloudData] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string>('Not Synced');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Registration | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [notification, setNotification] = useState<{show: boolean, name: string} | null>(null);
  const prevDataLength = useRef<number>(0);

  const fetchFromCloud = useCallback(async (isManual = false) => {
    if (!settings.googleScriptUrl || !settings.spreadsheetId) return;
    if (isManual) setIsLoading(true);
    
    try {
      const response = await fetch(settings.googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'FETCH_ALL',
          spreadsheetId: settings.spreadsheetId
        })
      });
      
      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        if (prevDataLength.current > 0 && result.data.length > prevDataLength.current) {
          setNotification({ show: true, name: result.data[0].fullName });
          setTimeout(() => setNotification(null), 5000);
        }
        setCloudData(result.data);
        prevDataLength.current = result.data.length;
        setLastSync(new Date().toLocaleTimeString('id-ID'));
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      if (isManual) setIsLoading(false);
    }
  }, [settings.googleScriptUrl, settings.spreadsheetId]);

  useEffect(() => {
    fetchFromCloud();
    const interval = setInterval(() => fetchFromCloud(), 30000); 
    return () => clearInterval(interval);
  }, [fetchFromCloud]);

  const displayData = useMemo(() => {
    const combined = [...cloudData];
    localData.forEach(local => {
      if (!combined.find(c => c.id.toString() === local.id.toString())) {
        combined.push(local);
      }
    });
    return combined.sort((a, b) => b.id - a.id);
  }, [cloudData, localData]);

  const filteredData = useMemo(() => {
    return displayData.filter(item => 
      !search || 
      item.fullName.toLowerCase().includes(search.toLowerCase()) || 
      item.whatsapp.includes(search) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.mountain.toLowerCase().includes(search.toLowerCase())
    );
  }, [displayData, search]);

  const stats = useMemo(() => {
    const verified = displayData.filter(r => r.status === 'Terverifikasi').length;
    const pending = displayData.filter(r => r.status === 'Menunggu Verifikasi').length;
    return { total: displayData.length, verified, pending };
  }, [displayData]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    displayData.forEach(reg => {
      counts[reg.mountain] = (counts[reg.mountain] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.replace('Gunung ', ''), count }))
      .sort((a, b) => b.count - a.count);
  }, [displayData]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(displayData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pendaftaran");
    XLSX.writeFile(wb, `Jejak-Langkah-Data-${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handleSaveEdit = async () => {
    if (editForm && onUpdateRegistration) {
      setIsLoading(true);
      await onUpdateRegistration(editForm);
      setEditingId(null);
      setEditForm(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* Real-time Notifications */}
      {notification && (
        <div className="fixed top-24 right-6 z-[100] w-full max-w-xs animate-in slide-in-from-right duration-500 px-4">
          <div className="bg-navy-900/90 backdrop-blur-xl border border-brand-red/50 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shrink-0 shadow-glow-red">
              <Bell className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-brand-red uppercase tracking-widest">New Entry</p>
              <h4 className="text-white font-black truncate text-sm">{notification.name}</h4>
            </div>
            <button onClick={() => setNotification(null)} className="text-white/20 hover:text-white"><X size={18} /></button>
          </div>
        </div>
      )}

      {/* Identity Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[200] bg-navy-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
           <div className="max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white"><X size={32} /></button>
              <img src={previewImage} className="w-full h-auto max-h-[85vh] object-contain rounded-3xl shadow-2xl border border-white/10" alt="Preview" />
           </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
            Control <span className="text-brand-red">Center.</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-brand-red animate-ping' : 'bg-green-500'}`}></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isLoading ? 'SYNCING...' : `LAST SYNC: ${lastSync}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button onClick={exportToExcel} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-navy-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-navy-800 transition-all">
            <Download size={14} /> Export XLS
          </button>
          <button onClick={onLogout} className="flex-1 md:flex-none px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Log Out
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <nav className="flex bg-navy-900/40 p-1.5 rounded-3xl border border-white/5 shadow-inner">
        {['overview', 'table', 'settings'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveSubTab(tab as any)} 
            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeSubTab === tab ? 'bg-brand-red text-white shadow-glow-red' : 'text-slate-500'}`}
          >
            {tab}
            {tab === 'table' && stats.pending > 0 && activeSubTab !== 'table' && (
              <span className="absolute top-2 right-4 w-5 h-5 bg-white text-brand-red rounded-full flex items-center justify-center text-[9px] font-black shadow-xl animate-pulse">
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Database View - Responsive Table/Cards */}
      {activeSubTab === 'table' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-red transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search database..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full pl-16 pr-6 py-5 bg-navy-900/60 border border-white/5 rounded-3xl text-sm font-bold outline-none focus:border-brand-red transition-all shadow-inner" 
              />
            </div>
            <button onClick={() => fetchFromCloud(true)} disabled={isLoading} className="px-8 py-5 bg-white text-navy-950 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Force Sync
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-navy-900/40 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-10 py-6">Participant</th>
                  <th className="px-10 py-6">Expedition</th>
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6 text-right">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map(reg => (
                  <tr key={reg.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <span className="text-sm font-black uppercase text-white block">{reg.fullName}</span>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-1.5"><Mail size={12} /> {reg.email}</span>
                          <span className="flex items-center gap-1.5"><Smartphone size={12} /> {reg.whatsapp}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <span className="text-[11px] font-black text-brand-red uppercase tracking-widest">{reg.mountain}</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{reg.packageCategory} • {reg.tripPackage}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {reg.identityImage ? (
                        <button onClick={() => setPreviewImage(reg.identityImage!)} className="w-14 h-10 rounded-xl overflow-hidden border border-white/10 hover:border-brand-red transition-all shadow-xl group/id">
                          <img src={reg.identityImage} className="w-full h-full object-cover group-hover/id:scale-110 transition-transform" />
                        </button>
                      ) : <span className="text-[9px] font-black text-slate-700 uppercase">NO DATA</span>}
                    </td>
                    <td className="px-10 py-8 text-right">
                       <select 
                        value={reg.status} 
                        onChange={(e) => onUpdateStatus?.(reg.id, e.target.value)} 
                        className={`text-[10px] font-black uppercase px-6 py-3 rounded-2xl outline-none border transition-all cursor-pointer ${
                          reg.status === 'Terverifikasi' 
                            ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                            : 'bg-brand-red/10 border-brand-red/20 text-brand-red'
                        }`}
                      >
                        <option value="Menunggu Verifikasi" className="bg-navy-900">Pending</option>
                        <option value="Terverifikasi" className="bg-navy-900">Verified</option>
                        <option value="Dibatalkan" className="bg-navy-900">Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredData.map(reg => (
              <div key={reg.id} className="bg-navy-900/40 border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-lg font-black uppercase text-white leading-none">{reg.fullName}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{reg.whatsapp}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${reg.status === 'Terverifikasi' ? 'bg-green-500/10 text-green-500' : 'bg-brand-red/10 text-brand-red'}`}>
                    {reg.status === 'Terverifikasi' ? 'VERIFIED' : 'PENDING'}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black text-brand-red uppercase tracking-widest block">DESTINATION</span>
                      <span className="text-xs font-black uppercase text-white">{reg.mountain}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">PACKAGE</span>
                      <span className="text-xs font-bold text-slate-400 uppercase">{reg.tripPackage}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPreviewImage(reg.identityImage || null)} className="flex-1 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                    <Eye size={14} /> View ID
                  </button>
                  <button onClick={() => onUpdateStatus?.(reg.id, reg.status === 'Terverifikasi' ? 'Menunggu Verifikasi' : 'Terverifikasi')} className="flex-1 py-4 bg-brand-red/10 border border-brand-red/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-red">
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Charts */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-navy-900/40 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-3">Total Registered</span>
              <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{stats.total}</span>
            </div>
            <div className="bg-green-500/5 p-10 rounded-[3.5rem] border border-green-500/10 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] block mb-3">Verified Passes</span>
              <span className="text-6xl font-black text-green-500 tabular-nums tracking-tighter">{stats.verified}</span>
            </div>
            <div className="bg-brand-red/5 p-10 rounded-[3.5rem] border border-brand-red/10 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.3em] block mb-3">Queue Count</span>
              <span className="text-6xl font-black text-brand-red tabular-nums tracking-tighter">{stats.pending}</span>
            </div>
          </div>
          
          <div className="bg-navy-900/40 p-8 md:p-12 rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic">Geographic <span className="text-brand-red">Distribution</span></h3>
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase text-slate-500">
                <div className="w-3 h-3 bg-brand-red rounded-full"></div> Hot Destinasi
              </div>
            </div>
            <div className="h-[350px] md:h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', padding: '20px', backgroundColor: '#0f172a', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={40}>
                    {chartData.map((_, i) => <Cell key={i} fill={i === 0 ? "#e11d48" : "#334155"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeSubTab === 'settings' && (
        <section className="bg-navy-900/40 p-8 md:p-14 rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-md space-y-12 animate-in slide-in-from-bottom-2">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
              <div className="space-y-1">
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">Infrastructure</h3>
                <p className="text-slate-500 text-sm font-medium">Configure cloud synchronization parameters.</p>
              </div>
              <button 
                onClick={() => { setSaveStatus('saving'); onSettingsUpdate?.(settings); setTimeout(() => setSaveStatus('saved'), 1000); }} 
                className={`w-full md:w-auto px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-glow-red ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-brand-red'} text-white`}
              >
                {saveStatus === 'saving' ? 'Applying...' : saveStatus === 'saved' ? 'Config Saved' : 'Apply Changes'}
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Spreadsheet Cloud ID</label>
                <input type="text" value={settings.spreadsheetId} onChange={e => setSettings({...settings, spreadsheetId: e.target.value})} className="w-full px-8 py-6 bg-navy-950/60 border border-white/5 rounded-3xl text-sm font-bold outline-none focus:border-brand-red transition-all shadow-inner" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Script API Endpoint</label>
                <input type="text" value={settings.googleScriptUrl} onChange={e => setSettings({...settings, googleScriptUrl: e.target.value})} className="w-full px-8 py-6 bg-navy-950/60 border border-white/5 rounded-3xl text-sm font-bold outline-none focus:border-brand-red transition-all shadow-inner" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Official Admin Email</label>
                <input type="email" value={settings.adminEmail || ''} onChange={e => setSettings({...settings, adminEmail: e.target.value})} className="w-full px-8 py-6 bg-navy-950/60 border border-white/5 rounded-3xl text-sm font-bold outline-none focus:border-brand-red transition-all shadow-inner" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Official WhatsApp Number</label>
                <input type="text" value={settings.adminPhone || ''} onChange={e => setSettings({...settings, adminPhone: e.target.value})} className="w-full px-8 py-6 bg-navy-950/60 border border-white/5 rounded-3xl text-sm font-bold outline-none focus:border-brand-red transition-all shadow-inner" />
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
