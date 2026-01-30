
import React from 'react';

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'card' | 'segment';
}

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  className = '', 
  variant = 'card'
}) => {
  const labelId = label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <label id={labelId} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">
        {label}
      </label>
      <div className="flex p-1.5 bg-navy-950/50 backdrop-blur-md border border-white/5 rounded-[2rem] relative shadow-inner overflow-hidden">
        {options.map((option) => {
          const isActive = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex-1 py-4 px-2 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative z-10 ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {option}
              {isActive && (
                <div className="absolute inset-0 bg-brand-red rounded-[1.5rem] -z-10 shadow-glow-red animate-in fade-in zoom-in duration-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroup;
