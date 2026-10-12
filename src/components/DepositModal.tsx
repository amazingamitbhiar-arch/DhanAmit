import React, { useState } from 'react';
import { X, ArrowDownToLine, CheckCircle2, QrCode, Smartphone, CreditCard, ShieldCheck } from 'lucide-react';
import { Language, Transaction } from '../types';
import { sounds } from '../utils/soundEffects';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number, method: string) => Transaction;
  lang: Language;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess,
  lang,
}) => {
  const isHi = lang === 'hi';
  const [amount, setAmount] = useState<string>('500');
  const [method, setMethod] = useState<'UPI' | 'QR' | 'CARD'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successTxn, setSuccessTxn] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const quickPicks = [200, 500, 1000, 2500, 5000];
  const numAmount = parseFloat(amount) || 0;

  const handleDeposit = () => {
    sounds.playClick();
    if (numAmount < 50) return;

    setIsProcessing(true);
    setTimeout(() => {
      const txn = onDepositSuccess(numAmount, method);
      setSuccessTxn(txn);
      setIsProcessing(false);
      sounds.playWinChime();
    }, 1000);
  };

  const handleClose = () => {
    setSuccessTxn(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-display">
                {isHi ? 'वॉलेट में पैसे जोड़ें' : 'Add Cash to Wallet'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isHi ? 'त्वरित व सुरक्षित जमा' : 'Instant & Secure Deposit'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!successTxn ? (
            <div className="space-y-4">
              
              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {isHi ? 'जमा राशि (₹)' : 'Deposit Amount (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-emerald-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 tabular-nums"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {quickPicks.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setAmount(String(q));
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                        amount === String(q)
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      +₹{q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {isHi ? 'भुगतान विधि चुनें' : 'Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      method === 'UPI'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs font-semibold block">UPI Apps</span>
                    <span className="text-[10px] text-neutral-500">GPay, PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('QR')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      method === 'QR'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs font-semibold block">QR Scanner</span>
                    <span className="text-[10px] text-neutral-500">BHIM / BharatQR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('CARD')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      method === 'CARD'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs font-semibold block">NetBanking</span>
                    <span className="text-[10px] text-neutral-500">All Banks</span>
                  </button>
                </div>
              </div>

              {/* Deposit Action */}
              <button
                onClick={handleDeposit}
                disabled={isProcessing || numAmount < 50}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{isHi ? 'प्रक्रिया चल रही है...' : 'Processing...'}</span>
                ) : (
                  <span>{isHi ? `₹${numAmount.toLocaleString('hi-IN')} सुरक्षित जमा करें` : `Pay ₹${numAmount.toLocaleString('en-IN')}`}</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHi ? '100% सुरक्षित गेटवे · शून्य लेनदेन शुल्क' : '100% Secure · Zero Processing Fee'}</span>
              </div>

            </div>
          ) : (
            /* Success View */
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">
                  {isHi ? 'राशि सफलतापूर्वक जमा हुई!' : 'Deposit Successful!'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  ₹{successTxn.amount.toLocaleString('hi-IN')} {isHi ? 'आपके वॉलेट में जुड़ चुके हैं।' : 'added to your DhanAmit wallet.'}
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-1 text-left">
                <div className="flex justify-between">
                  <span>UTR No:</span>
                  <span className="font-mono text-amber-300 font-semibold">{successTxn.utr}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHi ? 'समय:' : 'Time:'}</span>
                  <span>{successTxn.timestamp}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                {isHi ? 'वॉलेट देखें' : 'View Wallet'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
