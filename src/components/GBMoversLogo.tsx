import React from 'react';

interface LogoProps {
  className?: string;
  isReceipt?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GBMoversLogo: React.FC<LogoProps> = ({
  className = '',
  isReceipt = false,
  size = 'md',
}) => {
  const dimensions = {
    sm: { width: 140, height: 48 },
    md: { width: 190, height: 60 },
    lg: { width: 240, height: 75 },
  }[size];

  if (isReceipt) {
    // Monochromatic pure black & white version optimized for 80mm thermal receipt printing
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <svg
          viewBox="0 0 200 64"
          width={dimensions.width}
          height={dimensions.height}
          className="fill-black stroke-black"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountain Silhouette (Karakoram / GB peaks) */}
          <path
            d="M20 38 L45 16 L65 32 L85 10 L115 36 L135 20 L160 38 L180 38 L180 40 L20 40 Z"
            fill="none"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M85 10 L92 20 L80 24 Z"
            fill="#000"
          />
          <path
            d="M135 20 L140 28 L130 30 Z"
            fill="#000"
          />
          {/* Stylized Modern Coach / Bus */}
          <rect x="52" y="32" width="96" height="18" rx="4" fill="#000" />
          {/* Windows */}
          <rect x="58" y="35" width="14" height="6" rx="1" fill="#fff" />
          <rect x="76" y="35" width="14" height="6" rx="1" fill="#fff" />
          <rect x="94" y="35" width="14" height="6" rx="1" fill="#fff" />
          <rect x="112" y="35" width="14" height="6" rx="1" fill="#fff" />
          <polygon points="130,35 142,35 140,41 130,41" fill="#fff" />
          {/* Wheels */}
          <circle cx="70" cy="50" r="5" fill="#000" stroke="#fff" strokeWidth="2" />
          <circle cx="128" cy="50" r="5" fill="#000" stroke="#fff" strokeWidth="2" />
        </svg>
        <div className="font-receipt font-bold tracking-widest text-lg text-black mt-0.5 uppercase">
          GBMovers
        </div>
        <div className="text-[10px] font-receipt tracking-wider text-black uppercase">
          Gilgit-Baltistan Luxury Express
        </div>
      </div>
    );
  }

  // App UI header full-color luxury branding
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center shadow-md shadow-emerald-950/20 text-white shrink-0">
        <svg
          viewBox="0 0 40 40"
          className="w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountain peaks */}
          <path
            d="M6 24 L14 12 L20 20 L27 8 L34 24 Z"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Bus body */}
          <rect x="8" y="21" width="24" height="12" rx="3" fill="#ffffff" />
          {/* Windows */}
          <rect x="11" y="23" width="4" height="4" rx="0.5" fill="#0f766e" />
          <rect x="17" y="23" width="4" height="4" rx="0.5" fill="#0f766e" />
          <rect x="23" y="23" width="6" height="4" rx="0.5" fill="#0f766e" />
          {/* Wheels */}
          <circle cx="14" cy="33" r="2.5" fill="#0f172a" />
          <circle cx="26" cy="33" r="2.5" fill="#0f172a" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
            GB<span className="text-emerald-600">Movers</span>
          </span>
          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded tracking-wide uppercase">
            Official
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Gilgit · Skardu · Hunza · Islamabad
        </p>
      </div>
    </div>
  );
};
