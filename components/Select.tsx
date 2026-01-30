
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => {
  const baseClasses = `w-full appearance-none px-8 py-5 border-2 rounded-3xl outline-none transition-all cursor-pointer font-sans font-black text-sm text-white pr-14 ${
    error 
      ? "border-red-500/50 ring-4 ring-red-500/10" 
      : "border-white/5 bg-navy-950/40 focus:border-brand-red/50 focus:bg-navy-950 focus:ring-4 focus:ring-brand-red/5 shadow-inner"
  }`;

  return (
    <div className="flex flex-col gap-3 w-full group">
      <label className="text-[10px] font-black text-slate-500 group-focus-within:text-brand-red uppercase tracking-[0.3em] px-2 transition-colors">
        {label}
      </label>
      <div className="relative">
        <select 
          {...props}
          className={baseClasses}
        >
          <option value="" disabled className="bg-navy-900 text-slate-500">Pilih Destinasi...</option>
          {options.map(opt => (
            <option key={opt} value={opt} className="bg-navy-900 text-white py-4 font-sans font-black">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-focus-within:text-brand-red transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest px-2 mt-1">
          ! {error}
        </span>
      )}
    </div>
  );
};

export default Select;
