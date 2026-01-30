
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextArea?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, isTextArea, error, ...props }) => {
  const baseClasses = `w-full px-6 py-4 md:px-8 md:py-5 bg-navy-950/40 border-2 rounded-2xl md:rounded-3xl outline-none transition-all text-white placeholder:text-slate-700 font-sans font-black text-sm md:text-base tracking-tight ${
    error 
      ? "border-red-500/50 focus:ring-4 focus:ring-red-500/5" 
      : "border-white/5 focus:border-brand-red focus:bg-navy-950/80 focus:ring-4 focus:ring-brand-red/5 shadow-inner"
  }`;
  
  return (
    <div className="flex flex-col gap-2.5 w-full group animate-in fade-in duration-300">
      <label className="text-[9px] md:text-[10px] font-black text-slate-500 group-focus-within:text-brand-red uppercase tracking-[0.3em] px-2 transition-colors">
        {label}
      </label>
      {isTextArea ? (
        <textarea 
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
          className={`${baseClasses} min-h-[100px] md:min-h-[140px] leading-relaxed resize-none`}
        />
      ) : (
        <input 
          {...props} 
          className={baseClasses}
        />
      )}
      {error && (
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest px-2 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
