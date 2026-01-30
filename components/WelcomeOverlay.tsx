
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WelcomeOverlayProps {
  onStart: () => void;
}

const BrandLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15L85 85H15L50 15Z" fill="currentColor" />
    <path d="M50 40L68 85H32L50 40Z" fill="black" fillOpacity="0.25" />
    <path d="M42 75L58 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 65L54 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-navy-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_60%)] from-brand-red/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-red/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 md:space-y-20 relative z-10">
        
        <div className="relative inline-block animate-in fade-in zoom-in-95 duration-1000 ease-out">
          <div className="absolute inset-0 bg-brand-red/30 blur-[60px] md:blur-[100px] rounded-full animate-pulse"></div>
          
          <div className="absolute -inset-4 border border-white/5 rounded-[3.5rem] md:rounded-[5rem] animate-spin-slow"></div>
          <div className="absolute -inset-8 border border-white/5 rounded-[4rem] md:rounded-[6rem] opacity-40"></div>

          <div className="relative w-32 h-32 md:w-56 md:h-56 flex items-center justify-center mx-auto bg-navy-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl group transition-transform duration-700 hover:scale-105">
             <BrandLogo className="w-16 h-16 md:w-28 md:h-28 text-white group-hover:rotate-6 transition-transform duration-500" />
             
             <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-brand-red/50"></div>
             <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-brand-red/50"></div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="space-y-3 overflow-hidden">
            <span className="text-[9px] md:text-[11px] font-black text-brand-red uppercase tracking-[0.6em] block animate-in slide-in-from-top-10 duration-1000 delay-200 fill-mode-both italic">
              Authorized Expedition
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] italic animate-in slide-in-from-bottom-20 duration-1000 delay-300 fill-mode-both">
              Jejak <span className="text-brand-red">Langkah.</span>
            </h1>
          </div>
          
          <div className="max-w-xl mx-auto overflow-hidden">
            <p className="text-xs md:text-lg text-slate-400 font-medium leading-relaxed px-4 animate-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
              Persiapkan diri Anda untuk menaklukkan puncak tertinggi Nusantara dengan sistem reservasi profesional kami.
            </p>
          </div>
        </div>

        <div className="pt-4 md:pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 fill-mode-both">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center gap-6 px-10 md:px-16 py-6 md:py-8 bg-brand-red text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] overflow-hidden shadow-[0_20px_50px_rgba(225,29,72,0.3)] hover:shadow-[0_40px_80px_rgba(225,29,72,0.5)] hover:scale-105 active:scale-95 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10 italic">Masuk Portal</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          
          <div className="mt-12 md:mt-16 flex items-center justify-center gap-4 text-white/20">
            <div className="h-px w-6 md:w-10 bg-white/10"></div>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Secure System v1.5.0</p>
            <div className="h-px w-6 md:w-10 bg-white/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
