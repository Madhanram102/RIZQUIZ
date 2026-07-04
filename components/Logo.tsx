
import React from 'react';
import { Zap } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative mb-2">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        
        <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-4 rounded-2xl shadow-xl shadow-indigo-200 border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="flex items-center justify-center">
            <span className="text-white text-4xl font-black tracking-tighter flex items-center">
              R
              <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300 -mx-1 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
              Z
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tightest">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">RIZ</span>
          <span className="ml-2">QUIZ</span>
        </h1>
        <div className="flex items-center space-x-2 mt-1">
          <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master</span>
          <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
        </div>
        <p className="text-[10px] font-medium text-slate-400 mt-2 tracking-wide italic opacity-80">
          Powered by M.Madhanram
        </p>
      </div>
    </div>
  );
};

export default Logo;
