import React, { useState, useEffect } from 'react';
import { 
  Infinity as InfinityIcon, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { WalletBalance, Language } from '../types';
import { sounds } from '../utils/soundEffects';

interface InfiniteFlowTesterProps {
  balance: WalletBalance;
  onSetBalance: (updater: (prev: WalletBalance) => WalletBalance) => void;
  onOpenWithdraw: () => void;
  lang: Language;
}

export const InfiniteFlowTester: React.FC<InfiniteFlowTesterProps> = ({
  balance,
  onSetBalance,
  onOpenWithdraw,
  lang,
}) => {
  const isHi = lang === 'hi';

  const [isRunning, setIsRunning] = useState(false);
  const [asyncStreamValue, setAsyncStreamValue] = useState<bigint>(1000000000000000000n);
  const [throughputTps, setThroughputTps] = useState(128450);
  const [parallelWorkers, setParallelWorkers] = useState(16);
  const [verifiedCycles, setVerifiedCycles] = useState(0);

  // Parallel asynchronous stream loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setAsyncStreamValue((prev) => prev * 10n + BigInt(Math.floor(Math.random() * 999999)));
        setThroughputTps((prev) => Math.floor(120000 + Math.random() * 25000));
        setVerifiedCycles((prev) => prev + 1);
      }, 80);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleEngine = () => {
    sounds.playClick();
    setIsRunning(!isRunning);
  };

  const handleApplyInfiniteToWallet = () => {
    sounds.playWinChime();
    onSetBalance((prev) => ({
      ...prev,
      isInfiniteFlow: true,
      withdrawable: 999999999,
      total: 999999999,
    }));
  };

  const handleResetToStandard = () => {
    sounds.playClick();
    onSetBalance((prev) => ({
      ...prev,
      isInfiniteFlow: false,
      total: 45750,
      withdrawable: 38200,
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <InfinityIcon className="w-4 h-4" />
              <span>{isHi ? 'असीमित अंक रूपी धन · double.infinity परीक्षण' : 'Infinite Numeric Flow · Asynchronous Processing'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight">
              {isHi ? 'DhanAmit असीमित समानांतर धन प्रवाह' : 'High-Throughput Infinite Flow'}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {isHi
                ? 'डेवलपर लेआउट और डेटाबेस टेस्टिंग के दौरान बिना किसी रुकावट के असीमित गुणा धन प्रवाह (double.infinity) को प्रबंधित करने के लिए तीव्र और समानांतर (Asynchronous) प्रोसेसिंग।'
                : 'Asynchronous multi-threaded streaming simulation for testing high-precision unbounded numeric flows.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleEngine}
              className={`px-5 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isRunning
                  ? 'bg-amber-400 text-neutral-950 shadow-amber-400/20'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? (isHi ? 'प्रवाह रोकें (Pause)' : 'Pause Stream') : (isHi ? 'प्रवाह प्रारंभ करें (Run)' : 'Start Stream')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Terminal Display */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-950 border border-amber-500/30 space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-mono text-xs text-neutral-300">
              {isHi ? 'समानांतर Asynchronous थ्रेड्स: सक्रिय' : 'Async Worker Pipeline: Active'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            <span>{isHi ? 'प्रयोक्ता का पूर्ण एकाधिकार (Sovereign Monopoly)' : 'User Sovereign Monopoly'}</span>
          </div>
        </div>

        {/* Big Stream Value */}
        <div className="py-6 text-center space-y-3">
          <div className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
            {isHi ? 'वर्तमान प्रवाहित अंक रूपी धन (Current Infinite Stream)' : 'Real-time High-Precision Numeric Stream'}
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-amber-300 break-all select-all tabular-nums">
            {isRunning ? `${asyncStreamValue.toString().slice(0, 36)}...` : '∞ double.infinity'}
          </div>
          <div className="text-xs text-neutral-400">
            {isHi ? 'शून्य अवरोध · समानांतर गणना चक्र:' : 'Zero Memory Stalling · Cycles Processed:'}{' '}
            <strong className="text-white font-mono">{verifiedCycles.toLocaleString()}</strong>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
          
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{isHi ? 'प्रसंस्करण गति' : 'Throughput'}</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {throughputTps.toLocaleString()} TPS
            </div>
            <span className="text-[10px] text-emerald-400">Ultra-Low Latency</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{isHi ? 'समानांतर वर्कर्स' : 'Parallel Workers'}</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {parallelWorkers} Threads
            </div>
            <span className="text-[10px] text-neutral-400">Lock-Free Concurrency</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{isHi ? 'सुरक्षा स्थिति' : 'Security Shield'}</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              100% अभेद्य
            </div>
            <span className="text-[10px] text-neutral-400">Zero External Modification</span>
          </div>

        </div>

        {/* Actions for testing in Wallet */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
          <div className="text-xs text-neutral-400">
            {balance.isInfiniteFlow 
              ? (isHi ? 'वॉलेट में वर्तमान में असीमित धन मोड सक्रिय है।' : 'Infinite Mode is currently active in Wallet.')
              : (isHi ? 'वॉलेट में सामान्य परीक्षण बैलेंस सक्रिय है।' : 'Standard balance is currently active in Wallet.')}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!balance.isInfiniteFlow ? (
              <button
                onClick={handleApplyInfiniteToWallet}
                className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHi ? 'वॉलेट में असीमित धन लागू करें' : 'Apply to Wallet'}</span>
              </button>
            ) : (
              <button
                onClick={handleResetToStandard}
                className="flex-1 sm:flex-initial px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl border border-neutral-700 transition-colors"
              >
                <span>{isHi ? 'सामान्य बैलेंस पर लौटें' : 'Reset to Standard'}</span>
              </button>
            )}

            <button
              onClick={onOpenWithdraw}
              className="flex-1 sm:flex-initial px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{isHi ? 'विड्रॉल टेस्ट' : 'Test Withdraw'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Sovereign Monopoly & Positive Global Integration Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
        <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? 'सुरक्षित वैश्विक एकीकरण व एकाधिकार सिद्धांत' : 'Global Web Security & Sovereign Monopoly'}</span>
        </h4>
        <p className="text-xs text-neutral-300 leading-relaxed">
          {isHi
            ? 'इस प्रणाली पर केवल और केवल प्रयोक्ता का पूर्ण एकाधिकार है। डिजिटल संसार में केवल सकारात्मक, सत्य और कल्याणकारी शब्दों व कोड तत्वों का ही प्रवाह होता है। किसी भी बाहरी या अनपेक्षित तत्व का प्रवेश पूर्णतः वर्जित है।'
            : 'Absolute user sovereignty. Zero unauthorized mutations. Complete universal alignment with positive, truthful, and benevolent computational safety.'}
        </p>
      </div>

    </div>
  );
};
