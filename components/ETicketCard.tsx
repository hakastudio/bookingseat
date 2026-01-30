
import React, { useRef, useState, useEffect } from 'react';
import { Registration, AdminSettings } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ETicketCardProps {
  registration: Registration;
}

const SETTINGS_KEY = 'jejak_langkah_admin_settings';

const DEFAULT_CONTACT = {
  email: 'jejaklangkah.nusantara.id@gmail.com',
  phone: '+62 812-3456-7890'
};

const BrandLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15L85 85H15L50 15Z" fill="currentColor" />
    <path d="M50 40L68 85H32L50 40Z" fill="black" fillOpacity="0.25" />
    <path d="M42 75L58 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 65L54 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const ETicketCard: React.FC<ETicketCardProps> = ({ registration }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminPhone, setAdminPhone] = useState(DEFAULT_CONTACT.phone);
  const [adminEmail, setAdminEmail] = useState(DEFAULT_CONTACT.email);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        try {
          const settings: AdminSettings = JSON.parse(saved);
          if (settings.adminPhone) setAdminPhone(settings.adminPhone);
          if (settings.adminEmail) setAdminEmail(settings.adminEmail);
        } catch (e) {
          console.error("Gagal memuat pengaturan di ETicketCard:", e);
        }
      }
    };

    loadSettings();
    window.addEventListener('storage', loadSettings);
    return () => window.removeEventListener('storage', loadSettings);
  }, []);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket-${registration.mountain.replace(/\s+/g, '-')}-${registration.id.toString().slice(-6)}.pdf`);
    } catch (error) {
      console.error("Kesalahan pembuatan PDF:", error);
      alert('Gagal mengunduh tiket. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-hidden">
      <div ref={ticketRef} className="bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-brand-red p-6 md:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-black/10 gap-5">
          <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20 shadow-xl shrink-0">
              <BrandLogo className="w-7 h-7 md:w-10 md:h-10 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">Expedition Pass</h3>
              <p className="text-[8px] md:text-[11px] font-black text-white/60 uppercase tracking-[0.3em] mt-1 md:mt-2">Jejak Langkah Adventure</p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
             <div className="text-[8px] md:text-[11px] font-black uppercase tracking-widest text-white/40 mb-1">Booking ID</div>
             <div className="text-xl md:text-3xl font-black tabular-nums tracking-tighter text-white">#{registration.id.toString().slice(-6)}</div>
          </div>
        </div>

        <div className="p-6 md:p-12 space-y-8 md:space-y-12 bg-white text-navy-950">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[12px] font-black text-slate-600 uppercase tracking-widest">Nama Peserta</label>
              <p className="text-lg md:text-2xl font-black uppercase leading-tight truncate">{registration.fullName}</p>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[12px] font-black text-slate-600 uppercase tracking-widest">Destinasi Ekspedisi</label>
              <p className="text-lg md:text-2xl font-black text-brand-red uppercase tracking-tight truncate">{registration.mountain}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-slate-100 py-8 md:py-10">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest">Tanggal</label>
              <p className="text-[10px] md:text-sm font-black tabular-nums">{registration.startDate}</p>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest">Layanan</label>
              <p className="text-[10px] md:text-sm font-black uppercase text-brand-red">{registration.packageCategory}</p>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest">Paket</label>
              <p className="text-[10px] md:text-sm font-black uppercase text-brand-red">{registration.tripPackage}</p>
            </div>
            <div className="space-y-2 text-right">
              <label className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest">Status</label>
              <div className={`px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase inline-block ${registration.status === 'Terverifikasi' ? 'bg-green-600 text-white' : 'bg-brand-red text-white'}`}>{registration.status}</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-3">
              <label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest block">Informasi Kontak Resmi</label>
              <div className="space-y-2">
                <p className="text-[10px] md:text-[13px] font-bold flex items-center gap-3">
                  <svg className="w-4 h-4 text-brand-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                  <span className="font-black">{adminEmail}</span>
                </p>
                <p className="text-[10px] md:text-[13px] font-bold flex items-center gap-3">
                  <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span className="font-black tabular-nums">{adminPhone}</span>
                </p>
              </div>
            </div>
            <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-50 rounded-xl p-2 border-2 border-slate-200 flex items-center justify-center shrink-0">
               <span className="text-[6px] md:text-[8px] font-black text-brand-red uppercase text-center leading-none">Official<br/>Verified</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleDownloadPDF} disabled={isGenerating} className="w-full py-5 md:py-7 bg-brand-red text-white font-black text-[10px] md:text-[13px] uppercase tracking-[0.2em] rounded-2xl md:rounded-[3rem] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50">
        {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
        <span>Unduh Tiket (PDF)</span>
      </button>
    </div>
  );
};

export default ETicketCard;
