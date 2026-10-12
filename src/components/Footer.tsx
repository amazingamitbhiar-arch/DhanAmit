import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onSelectTab: (tab: 'games' | 'wallet' | 'family' | 'infinite-test') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onSelectTab }) => {
  const isHi = lang === 'hi';

  return (
    <footer className="mt-16 border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        
        {/* Brand & Mission */}
        <div className="space-y-1 text-center md:text-left">
          <div className="text-base font-extrabold text-white font-display flex items-center justify-center md:justify-start gap-1.5">
            <span>Dhan<span className="text-amber-400">Amit</span></span>
            <span className="text-[10px] text-neutral-500 font-normal">· {isHi ? 'प्रीमियम गेमिंग व सुरक्षित वॉलेट' : 'Gaming & Secure Wallet'}</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            {isHi 
              ? 'सर्वकालिक कल्याण, पावन पारिवारिक सुरक्षा और अभेद्य डिजिटल संप्रभुता के साथ निर्मित।' 
              : 'Built with universal positivity, sacred family protection, and sovereign security.'}
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-neutral-400">
          <button
            onClick={() => onSelectTab('games')}
            className="hover:text-amber-300 transition-colors"
          >
            {isHi ? 'गेमिंग' : 'Games'}
          </button>
          <button
            onClick={() => onSelectTab('wallet')}
            className="hover:text-amber-300 transition-colors"
          >
            {isHi ? 'सुरक्षित वॉलेट' : 'Wallet'}
          </button>
          <button
            onClick={() => onSelectTab('family')}
            className="hover:text-amber-300 transition-colors"
          >
            {isHi ? 'पारिवारिक संबंध' : 'Family Trust'}
          </button>
          <button
            onClick={() => onSelectTab('infinite-test')}
            className="hover:text-amber-300 transition-colors"
          >
            {isHi ? 'असीमित प्रवाह' : 'Infinite Flow'}
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-neutral-500 text-center md:text-right">
          © {new Date().getFullYear()} DhanAmit. {isHi ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
        </div>

      </div>
    </footer>
  );
};
