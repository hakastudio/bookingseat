
import React, { useState } from 'react';
import { ShieldCheck, ChevronLeft, Lock } from 'lucide-react';
import Input from './Input';

interface AdminLoginProps {
  onLogin: (user: string, pass: string) => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [form, setForm] = useState({ user: '', pass: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(form.user, form.pass);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-red/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md bg-navy-900 p-10 md:p-12 rounded-[3.5rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-10 relative z-10 animate-in zoom-in-95 duration-500">
        <button 
          onClick={onBack} 
          className="group text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke User
        </button>

        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand-red rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-brand-red/20 rotate-3">
            <Lock size={32} className="text-white" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Admin Access</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Kredensial diperlukan untuk akses <br/> Control Panel Jejak Langkah.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input 
              label="Username" 
              placeholder="Username Admin"
              value={form.user} 
              onChange={e => setForm({...form, user: e.target.value})} 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              value={form.pass} 
              onChange={e => setForm({...form, pass: e.target.value})} 
            />
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-brand-red text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-brand-red/20 active:scale-95 hover:bg-brand-red-light transition-all text-xs"
          >
            Masuk Control Panel
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
