import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Sparkles,
  Heart,
  Loader2
} from 'lucide-react';
import { WalletBalance, SavedUpiAccount, FamilyBeneficiary, Language, Transaction } from '../types';
import { sounds } from '../utils/soundEffects';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: WalletBalance;
  savedUpiList: SavedUpiAccount[];
  familyBeneficiaries: FamilyBeneficiary[];
  onWithdrawSuccess: (amount: number, upiId: string, method: 'OTP' | 'PIN', beneficiary?: string, relation?: string) => Transaction;
  lang: Language;
}

type Step = 'AMOUNT_AND_UPI' | 'VERIFICATION' | 'PROCESSING' | 'SUCCESS';

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  balance,
  savedUpiList,
  familyBeneficiaries,
  onWithdrawSuccess,
  lang,
}) => {
  const isHi = lang === 'hi';

  const [step, setStep] = useState<Step>('AMOUNT_AND_UPI');
  const [amount, setAmount] = useState<string>('1000');
  const [selectedUpi, setSelectedUpi] = useState<string>('');
  const [customUpi, setCustomUpi] = useState<string>('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<FamilyBeneficiary | null>(null);

  // Verification mode: OTP vs PIN
  const [verifyMode, setVerifyMode] = useState<'OTP' | 'PIN'>('OTP');
  const [otpCode, setOtpCode] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [otpSentNotice, setOtpSentNotice] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);

  // Result transaction
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<boolean>(false);

  // Initialize with first saved UPI
  useEffect(() => {
    if (savedUpiList.length > 0 && !selectedUpi && !customUpi) {
      setSelectedUpi(savedUpiList[0].upiId);
    }
  }, [savedUpiList, selectedUpi, customUpi]);

  // Resend OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'VERIFICATION' && verifyMode === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, verifyMode, resendTimer]);

  if (!isOpen) return null;

  const quickAmounts = [500, 1000, 2000, 5000, 10000];
  const maxAvailable = balance.isInfiniteFlow ? 999999999 : balance.withdrawable;
  const numAmount = parseFloat(amount) || 0;

  const getEffectiveUpi = () => {
    if (selectedBeneficiary) return selectedBeneficiary.upiId;
    if (customUpi.trim()) return customUpi.trim();
    return selectedUpi;
  };

  const handleProceedToVerify = () => {
    setErrorMsg('');
    sounds.playClick();

    if (numAmount < 100) {
      setErrorMsg(isHi ? 'न्यूनतम विड्रॉल राशि ₹100 है।' : 'Minimum withdrawal amount is ₹100.');
      return;
    }

    if (!balance.isInfiniteFlow && numAmount > balance.withdrawable) {
      setErrorMsg(
        isHi 
          ? `विड्रॉएबल बैलेंस (₹${balance.withdrawable.toLocaleString('hi-IN')}) से अधिक राशि नहीं निकाल सकते।`
          : `Amount exceeds withdrawable balance (₹${balance.withdrawable.toLocaleString('en-IN')}).`
      );
      return;
    }

    const targetUpi = getEffectiveUpi();
    if (!targetUpi || !targetUpi.includes('@') || targetUpi.endsWith('@')) {
      setErrorMsg(isHi ? 'कृपया एक वैध UPI ID दर्ज करें (उदा. user@okaxis)।' : 'Please provide a valid UPI ID (e.g. user@okaxis).');
      return;
    }

    setOtpCode('');
    setPinCode('');
    setOtpSentNotice(true);
    setResendTimer(30);
    setStep('VERIFICATION');
  };

  const handleVerifyAndWithdraw = () => {
    setErrorMsg('');
    sounds.playClick();

    if (verifyMode === 'OTP') {
      if (otpCode.length !== 6) {
        setErrorMsg(isHi ? 'कृपया 6 अंकों का OTP दर्ज करें।' : 'Please enter 6-digit OTP.');
        return;
      }
    } else {
      if (pinCode.length !== 4) {
        setErrorMsg(isHi ? 'कृपया 4 अंकों का सुरक्षा पिन दर्ज करें।' : 'Please enter 4-digit security PIN.');
        return;
      }
    }

    // Move to processing
    setStep('PROCESSING');

    // Simulate safe asynchronous processing
    setTimeout(() => {
      const upiToUse = getEffectiveUpi();
      const txn = onWithdrawSuccess(
        numAmount,
        upiToUse,
        verifyMode,
        selectedBeneficiary?.name,
        selectedBeneficiary?.relation
      );
      setCompletedTxn(txn);
      sounds.playSecurityVerified();
      sounds.playWinChime();
      setStep('SUCCESS');
    }, 1400);
  };

  const handleFillTestOtp = () => {
    sounds.playClick();
    setOtpCode('786999');
  };

  const handleFillTestPin = () => {
    sounds.playClick();
    setPinCode('8888');
  };

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleReset = () => {
    setStep('AMOUNT_AND_UPI');
    setCompletedTxn(null);
    setOtpCode('');
    setPinCode('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-display">
                {isHi ? 'सुरक्षित धन विड्रॉल' : 'Secure Dhan Withdrawal'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isHi ? '256-बिट बैंक-स्तरीय प्रमाणीकरण' : '256-Bit Bank-Grade Verification'}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* STEP 1: Amount and UPI selection */}
          {step === 'AMOUNT_AND_UPI' && (
            <div className="space-y-5">
              
              {/* Withdrawable Balance Indicator */}
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-400">
                    {isHi ? 'निकासी योग्य बैलेंस (विनिंग्स)' : 'Withdrawable Balance (Winnings)'}
                  </div>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums">
                    {balance.isInfiniteFlow ? '∞ असीमित (Infinite)' : `₹${balance.withdrawable.toLocaleString('hi-IN')}`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-500 block">
                    {isHi ? 'न्यूनतम निकासी' : 'Min Withdrawal'}
                  </span>
                  <span className="text-xs font-semibold text-neutral-300">₹100</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {isHi ? 'निकासी राशि दर्ज करें (₹)' : 'Enter Withdrawal Amount (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-amber-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full pl-9 pr-24 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 tabular-nums"
                  />
                  <button
                    onClick={() => setAmount(String(maxAvailable))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-md transition-colors"
                  >
                    {isHi ? 'अधिकतम' : 'Max'}
                  </button>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setAmount(String(q));
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                        amount === String(q)
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      ₹{q.toLocaleString('hi-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID Selection & Custom Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-300">
                    {isHi ? 'प्राप्तकर्ता UPI ID (अपनी मर्जी से चुनें या डालें)' : 'Recipient UPI ID (Choose or Enter Custom)'}
                  </label>
                  {selectedBeneficiary && (
                    <span className="text-[11px] text-amber-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-amber-400" />
                      {selectedBeneficiary.relation}
                    </span>
                  )}
                </div>

                {/* Custom UPI Input field */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedBeneficiary ? selectedBeneficiary.upiId : customUpi}
                      onChange={(e) => {
                        setSelectedBeneficiary(null);
                        setSelectedUpi('');
                        setCustomUpi(e.target.value);
                      }}
                      placeholder="e.g. yourname@okhdfcbank या 9876543210@paytm"
                      className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder:text-neutral-600"
                    />
                    {selectedBeneficiary && (
                      <button
                        onClick={() => setSelectedBeneficiary(null)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 bg-neutral-800 rounded"
                      >
                        {isHi ? 'बदलें' : 'Change'}
                      </button>
                    )}
                  </div>

                  {/* Suggestion handles */}
                  {!selectedBeneficiary && (
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px] text-neutral-400">
                      <span className="shrink-0 text-neutral-500">{isHi ? 'त्वरित हैंडल:' : 'Handles:'}</span>
                      {['@okaxis', '@okhdfcbank', '@oksbi', '@paytm', '@ybl', '@upi'].map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            const current = customUpi.includes('@') ? customUpi.split('@')[0] : (customUpi || 'user');
                            setCustomUpi(`${current}${handle}`);
                          }}
                          className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded text-neutral-300 font-mono shrink-0 transition-colors"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Pick: Saved Account or Family Member */}
                  <div className="pt-1">
                    <div className="text-[11px] text-neutral-400 mb-1.5 flex items-center justify-between">
                      <span>{isHi ? 'सुरक्षित सहेजे गए UPI खाते:' : 'Saved Verified Accounts:'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {savedUpiList.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setSelectedBeneficiary(null);
                            setCustomUpi(acc.upiId);
                            setSelectedUpi(acc.upiId);
                          }}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                            getEffectiveUpi() === acc.upiId && !selectedBeneficiary
                              ? 'bg-amber-500/10 border-amber-500/50 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <div className="font-semibold truncate">{acc.accountHolder}</div>
                          <div className="text-[11px] text-neutral-400 font-mono truncate">{acc.upiId}</div>
                        </button>
                      ))}

                      {familyBeneficiaries.slice(0, 4).map((fam) => (
                        <button
                          key={fam.id}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setSelectedBeneficiary(fam);
                            setCustomUpi(fam.upiId);
                          }}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                            selectedBeneficiary?.id === fam.id
                              ? 'bg-amber-500/10 border-amber-500/50 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <div className="font-semibold flex items-center justify-between">
                            <span className="truncate">{fam.name}</span>
                            <span className="text-[10px] text-amber-400 shrink-0 font-normal">({fam.relation})</span>
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono truncate">{fam.upiId}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleProceedToVerify}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>{isHi ? 'सत्यापन के लिए आगे बढ़ें' : 'Proceed to Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Security Verification (OTP or PIN) */}
          {step === 'VERIFICATION' && (
            <div className="space-y-5">
              
              {/* Summary Pill */}
              <div className="p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400">
                    {isHi ? 'निकासी राशि' : 'Withdrawal Amount'}
                  </div>
                  <div className="text-lg font-bold text-white tabular-nums">
                    ₹{numAmount.toLocaleString('hi-IN')}
                  </div>
                </div>
                <div className="text-right max-w-[200px]">
                  <div className="text-[11px] text-neutral-400">
                    {isHi ? 'गंतव्य UPI' : 'Target UPI'}
                  </div>
                  <div className="text-xs font-mono font-medium text-amber-300 truncate">
                    {getEffectiveUpi()}
                  </div>
                </div>
              </div>

              {/* Choose Verification Method Tabs */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  {isHi ? 'सुरक्षा सत्यापन विधि चुनें:' : 'Select Verification Mode:'}
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setVerifyMode('OTP');
                      setErrorMsg('');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      verifyMode === 'OTP'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isHi ? 'OTP सत्यापन' : 'OTP Verification'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setVerifyMode('PIN');
                      setErrorMsg('');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      verifyMode === 'PIN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isHi ? 'सुरक्षा पिन (PIN)' : 'Dhan Security PIN'}</span>
                  </button>
                </div>
              </div>

              {/* OTP MODE */}
              {verifyMode === 'OTP' && (
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span>
                        {isHi 
                          ? 'OTP आपके पंजीकृत मोबाइल पर भेजा गया है'
                          : 'OTP sent to registered mobile'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillTestOtp}
                      className="px-2 py-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors"
                      title="Auto-fill test OTP (786999)"
                    >
                      {isHi ? 'ऑटो-भरें: 786999' : 'Fill Test: 786999'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      {isHi ? '6 अंकों का वन-टाइम पासवर्ड (OTP) डालें:' : 'Enter 6-Digit OTP:'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-amber-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      {resendTimer > 0 
                        ? (isHi ? `पुनः भेजें (${resendTimer}s)` : `Resend in (${resendTimer}s)`)
                        : (
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setResendTimer(30);
                            }}
                            className="text-amber-400 hover:underline"
                          >
                            {isHi ? 'OTP पुनः भेजें' : 'Resend OTP'}
                          </button>
                        )}
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {isHi ? 'पूर्णतया सुरक्षित' : 'End-to-End Secure'}
                    </span>
                  </div>
                </div>
              )}

              {/* PIN MODE */}
              {verifyMode === 'PIN' && (
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
                    <span>{isHi ? 'डिफ़ॉल्ट सुरक्षा पिन:' : 'Default Security PIN:'} <strong className="text-amber-400 font-mono">8888</strong></span>
                    <button
                      type="button"
                      onClick={handleFillTestPin}
                      className="px-2 py-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors"
                    >
                      {isHi ? 'पिन भरें (8888)' : 'Fill PIN (8888)'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      {isHi ? '4 अंकों का धन सुरक्षा पिन डालें:' : 'Enter 4-Digit Security PIN:'}
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •"
                      className="w-full text-center tracking-[0.6em] text-2xl font-bold py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-amber-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setStep('AMOUNT_AND_UPI');
                  }}
                  className="w-1/3 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  {isHi ? 'वापस' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyAndWithdraw}
                  className="w-2/3 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isHi ? 'सत्यापित कर पैसे निकालें' : 'Verify & Withdraw'}</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Asynchronous Safe Processing */}
          {step === 'PROCESSING' && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping"></div>
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">
                  {isHi ? 'सुरक्षित विड्रॉल प्रक्रिया जारी है...' : 'Processing Secure Withdrawal...'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  {isHi 
                    ? 'एनपीसीआई व यूपीआई नेटवर्क से सुरक्षित संरेखण किया जा रहा है।' 
                    : 'Validating cryptographic handshake with UPI payment network.'}
                </p>
              </div>
              <div className="inline-block px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-full text-[11px] text-amber-400 font-mono">
                {isHi ? 'अति-तीव्र समानांतर प्रक्रमण...' : 'High-speed asynchronous routing...'}
              </div>
            </div>
          )}

          {/* STEP 4: Success Receipt */}
          {step === 'SUCCESS' && completedTxn && (
            <div className="space-y-4">
              
              <div className="text-center py-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-white font-display">
                  {isHi ? 'विड्रॉल सफलतापूर्वक संपन्न हुआ!' : 'Withdrawal Successful!'}
                </h4>
                <p className="text-xs text-emerald-400 font-medium">
                  {isHi ? 'राशि सीधे आपके बैंक खाते में अंतरित कर दी गई है।' : 'Amount successfully credited to your bank account.'}
                </p>
              </div>

              {/* Auspicious Receipt Card */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800/80">
                  <span className="text-xs text-neutral-400">{isHi ? 'अंतरित राशि' : 'Amount Transferred'}</span>
                  <span className="text-xl font-black text-amber-300 tabular-nums">
                    ₹{completedTxn.amount.toLocaleString('hi-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-neutral-500 block">{isHi ? 'प्राप्तकर्ता UPI' : 'Recipient UPI'}</span>
                    <span className="font-mono text-neutral-200 truncate block">{completedTxn.upiId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block">{isHi ? 'समय' : 'Timestamp'}</span>
                    <span className="text-neutral-300">{completedTxn.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block">{isHi ? 'सत्यापन विधि' : 'Verification'}</span>
                    <span className="text-emerald-400 font-semibold">{completedTxn.verificationMethod} Verified</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 block">{isHi ? 'स्थिति' : 'Status'}</span>
                    <span className="text-emerald-400 font-semibold">{isHi ? 'सफल (Confirmed)' : 'Success'}</span>
                  </div>
                </div>

                {/* UTR Reference with copy button */}
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">UPI UTR / Ref ID</span>
                    <span className="font-mono text-amber-400 font-semibold">{completedTxn.utr}</span>
                  </div>
                  <button
                    onClick={() => handleCopyUtr(completedTxn.utr)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-neutral-300 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedUtr ? (isHi ? 'कॉपी हो गया' : 'Copied!') : (isHi ? 'कॉपी करें' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* Family Blessing Note if applicable */}
              {completedTxn.beneficiaryName && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isHi 
                      ? `${completedTxn.beneficiaryName} (${completedTxn.relationTag}) के पावन खाते में पूर्ण सम्मान व सुरक्षा के साथ अंतरित।`
                      : `Transferred with honor and sacred safety to ${completedTxn.beneficiaryName} (${completedTxn.relationTag}).`}
                  </span>
                </div>
              )}

              {/* Done Button */}
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                {isHi ? 'संपन्न (Close)' : 'Done'}
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
