import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  fullWidth, 
  loading, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "py-4 md:py-5 px-8 font-black uppercase tracking-[0.2em] rounded-2xl md:rounded-[2rem] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Gaya spesifik: Brand red background, teks putih, hover darker red
  const requestedClasses = "bg-brand-red text-white hover:bg-brand-red-dark hover:shadow-lg border border-white/10";

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseClasses} ${requestedClasses} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : children}
    </button>
  );
};

export default Button;