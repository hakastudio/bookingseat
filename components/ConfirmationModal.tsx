
import React, { useState } from 'react';
// Import missing ArrowRight icon from lucide-react
import { ArrowRight } from 'lucide-react';
import { PersonalData } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: PersonalData;
  isSending: boolean;
  isSuccess?: boolean;
  successId?: number | string;
  error?: string | null;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  data, 
  isSending, 
  isSuccess,
  successId,
  error, 
  bankInfo 
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-hidden">
      <div className={`bg-white dark:bg-navy-900 w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-t md:border border-white/5 animate-in slide-in-from-bottom duration-500 rounded-t-[2.5rem] md:rounded-[4rem] flex flex-col max-h-[92vh] overflow-hidden`}>
        
        <div className="md:hidden flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-navy-800 rounded-full"></div>
        </div>

        {isSuccess ? (
          <div className="p-8 md:p-16 text-center space-y-8 animate-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white dark:border-navy-800 mx-auto">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-navy-900 dark:text-white uppercase tracking-tight leading-tight">Pendaftaran<br/>Diterima!</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Booking ID Anda: <span className="text-brand-red">#{successId?.toString().slice(-6)}</span></p>
            </div>
            <button onClick={onClose} className="w-full py-5 bg-brand-red text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all">Tutup & Lihat Tiket</button>
          </div>
        ) : (
          <>
            <div className="px-8 pt-8 md:p-12 md:pb-6 flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase text-navy-900 dark:text-white tracking-tight">Konfirmasi</h3>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 md:p-12 pt-4 space-y-8 overflow-y-auto custom-scrollbar flex-1">
               <div className="bg-slate-50 dark:bg-navy-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-navy-700 space-y-6">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Peserta</span>
                     <p className="text-xl font-black uppercase text-navy-900 dark:text-white truncate">{data.fullName}</p>
                     <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-[10px] font-bold text-slate-400">{data.email}</p>
                        <p className="text-[9px] font-medium text-slate-400 line-clamp-2 italic">{data.address}</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tujuan</span>
                       <p className="text-sm font-black uppercase text-brand-red">{data.mountain}</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</span>
                       <p className="text-sm font-black tabular-nums">{data.startDate}</p>
                    </div>
                  </div>
                  {data.climberCode && (
                    <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-navy-700">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Pendaki (Merbabu)</span>
                       <p className="text-sm font-black uppercase text-brand-red">{data.climberCode}</p>
                    </div>
                  )}
               </div>
               
               <div className="space-y-4">
                 <div className="bg-brand-red/5 p-6 rounded-[2rem] border-2 border-brand-red/10 space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] font-black text-brand-red uppercase tracking-widest">Transfer Pembayaran</span>
                     <span className="text-[10px] font-black uppercase px-3 py-1 bg-white dark:bg-navy-950 rounded-lg">{bankInfo.bankName}</span>
                   </div>
                   <div className="flex items-center justify-between gap-4">
                     <p className="text-2xl font-black tracking-tighter tabular-nums text-navy-950 dark:text-white">{bankInfo.accountNumber}</p>
                     <button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-brand-red text-white shadow-lg shadow-brand-red/20'}`}>
                       {copied ? 'OK' : 'Salin'}
                     </button>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A/N {bankInfo.accountName}</p>
                 </div>
               </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-navy-950 border-t border-slate-100 dark:border-navy-900 pb-12 md:pb-12">
              <button 
                onClick={onConfirm}
                disabled={isSending}
                className="w-full py-6 bg-brand-red text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-brand-red/20 flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-50 group"
              >
                {isSending ? <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : (
                  <>
                    <span>Kirim Pendaftaran</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal;
