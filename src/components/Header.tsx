import React from 'react';
import { ShieldCheck, Wallet, Sparkles, RefreshCw, Globe, Infinity as InfinityIcon } from 'lucide-react';
import { WalletBalance, Language } from '../types';

interface HeaderProps {
  balance: WalletBalance;
  activeTab: 'games' | 'wallet' | 'family' | 'infinite-test';
  setActiveTab: (tab: 'games' | 'wallet' | 'family' | 'infinite-test') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenWithdraw: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenWithdraw,
}) => {
  const isHi = lang === 'hi';

  const formatCurrency = (num: number) => {
    if (balance.isInfiniteFlow) {
      return '∞ असीमित धन';
    }
    return new Intl.NumberFormat(isHi ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('games')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-neutral-950 fill-neutral-950" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-white font-display flex items-center gap-1">
                Dhan<span className="text-amber-400">Amit</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('games')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'games'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-neutral-300 hover:text-white border-transparent'
            }`}
          >
            {isHi ? 'गेमिंग अखाड़ा' : 'Games Arena'}
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'wallet'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-neutral-300 hover:text-white border-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {isHi ? 'सुरक्षित वॉलेट' : 'Secure Wallet'}
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'family'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-neutral-300 hover:text-white border-transparent'
            }`}
          >
            {isHi ? 'पावन पारिवारिक संबंध' : 'Family Trust'}
          </button>

          <button
            onClick={() => setActiveTab('infinite-test')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'infinite-test'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-neutral-300 hover:text-white border-transparent'
            }`}
          >
            <InfinityIcon className="w-4 h-4 text-amber-400" />
            {isHi ? 'असीमित धन प्रवाह' : 'Infinite Flow'}
          </button>
        </nav>

        {/* Zone 3: Wallet Action & Balance */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
            title={isHi ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>{isHi ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Balance Preview & Quick Wallet Trigger */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-amber-500/30 text-xs sm:text-sm transition-all text-left"
          >
            <div className="w-7 h-7 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] text-neutral-400 font-normal">
                {isHi ? 'कुल बैलेंस' : 'Total Balance'}
              </div>
              <div className="font-bold text-amber-300 tabular-nums">
                {formatCurrency(balance.total)}
              </div>
            </div>
          </button>

          {/* Primary Action Button: Withdraw */}
          <button
            onClick={onOpenWithdraw}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/20 transition-all whitespace-nowrap active:scale-95"
          >
            {isHi ? 'पैसे निकालें' : 'Withdraw'}
          </button>
        </div>

      </div>

      {/* Mobile Sub Navigation bar */}
      <div className="flex md:hidden overflow-x-auto py-2 px-4 gap-2 border-t border-neutral-900 bg-neutral-950/95 text-xs">
        <button
          onClick={() => setActiveTab('games')}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'games' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium' : 'text-neutral-400'
          }`}
        >
          {isHi ? 'गेमिंग अखाड़ा' : 'Games'}
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'wallet' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium' : 'text-neutral-400'
          }`}
        >
          {isHi ? 'सुरक्षित वॉलेट' : 'Wallet'}
        </button>
        <button
          onClick={() => setActiveTab('family')}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'family' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium' : 'text-neutral-400'
          }`}
        >
          {isHi ? 'पारिवारिक संबंध' : 'Family'}
        </button>
        <button
          onClick={() => setActiveTab('infinite-test')}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'infinite-test' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium' : 'text-neutral-400'
          }`}
        >
          {isHi ? 'असीमित प्रवाह' : 'Infinite Flow'}
        </button>
      </div>
    </header>
  );
};
