import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Check, 
  Copy, 
  Search, 
  Filter, 
  Sparkles, 
  Lock, 
  Smartphone, 
  KeyRound, 
  Heart, 
  Infinity as InfinityIcon,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Clock
} from 'lucide-react';
import { WalletBalance, SavedUpiAccount, Transaction, FamilyBeneficiary, Language } from '../types';
import { sounds } from '../utils/soundEffects';

interface WalletScreenProps {
  balance: WalletBalance;
  savedUpiList: SavedUpiAccount[];
  transactions: Transaction[];
  familyBeneficiaries: FamilyBeneficiary[];
  onOpenWithdraw: () => void;
  onOpenDeposit: () => void;
  onAddUpi: (upiId: string, bankName: string) => void;
  onToggleInfiniteFlow: () => void;
  lang: Language;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  balance,
  savedUpiList,
  transactions,
  familyBeneficiaries,
  onOpenWithdraw,
  onOpenDeposit,
  onAddUpi,
  onToggleInfiniteFlow,
  lang,
}) => {
  const isHi = lang === 'hi';

  // Custom UPI input state
  const [newUpi, setNewUpi] = useState('');
  const [upiError, setUpiError] = useState('');
  const [upiSuccess, setUpiSuccess] = useState('');

  // Transaction filter & search
  const [txnFilter, setTxnFilter] = useState<'ALL' | 'WITHDRAWAL' | 'DEPOSIT' | 'GAME_WIN' | 'BONUS'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Format currency
  const formatAmount = (num: number) => {
    if (balance.isInfiniteFlow) {
      return '∞ असीमित';
    }
    return new Intl.NumberFormat(isHi ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleSaveCustomUpi = (e: React.FormEvent) => {
    e.preventDefault();
    setUpiError('');
    setUpiSuccess('');
    sounds.playClick();

    const clean = newUpi.trim();
    if (!clean || !clean.includes('@') || clean.endsWith('@') || clean.startsWith('@')) {
      setUpiError(isHi ? 'कृपया एक मान्य UPI ID दर्ज करें (उदा. username@bank)' : 'Please enter a valid UPI ID (e.g. username@bank)');
      return;
    }

    // Auto-detect bank from handle
    let bankName = 'UPI Direct';
    if (clean.includes('okaxis')) bankName = 'Axis Bank UPI';
    else if (clean.includes('okhdfc')) bankName = 'HDFC Bank UPI';
    else if (clean.includes('oksbi')) bankName = 'SBI UPI';
    else if (clean.includes('paytm')) bankName = 'Paytm Payments Bank';
    else if (clean.includes('icici')) bankName = 'ICICI Bank UPI';
    else if (clean.includes('ybl')) bankName = 'Yes Bank / PhonePe';

    onAddUpi(clean, bankName);
    setNewUpi('');
    setUpiSuccess(isHi ? `UPI ID ${clean} सफलतापूर्वक सुरक्षित रूप से जोड़ दी गई है!` : `UPI ID ${clean} safely added!`);
    setTimeout(() => setUpiSuccess(''), 3500);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = txnFilter === 'ALL' || t.type === txnFilter;
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.upiId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner & Security Assurance */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'प्रमाणित सुरक्षित वॉलेट एवं अभेद्य निकासी' : 'Certified Secure Wallet & Zero-Latency Withdrawal'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight">
              {isHi ? 'DhanAmit सुरक्षित धन वॉलेट' : 'DhanAmit Secure Wealth Wallet'}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {isHi
                ? 'अपनी मर्जी से किसी भी बैंक का UPI ID जोड़ें, वास्तविक समय में बैलेंस जांचें और 6-अंकों के OTP या 4-अंकों के धन सुरक्षा पिन के साथ 100% सुरक्षित रूप से पैसे निकालें।'
                : 'Add any custom UPI ID of your choice, monitor your real-time balance, and withdraw safely using 6-digit OTP or 4-digit Security PIN.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenWithdraw}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>{isHi ? 'पैसे निकालें (Withdraw)' : 'Withdraw Cash'}</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-neutral-700 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              <span>{isHi ? 'पैसे जोड़ें' : 'Add Cash'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Balance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Balance */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>{isHi ? 'कुल वॉलेट बैलेंस' : 'Total Wallet Balance'}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            {formatAmount(balance.total)}
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>{isHi ? 'अक्षय निधि' : 'Active Balance'}</span>
            <span className="text-emerald-400 font-semibold">{isHi ? 'सक्रिय' : 'Active'}</span>
          </div>
        </div>

        {/* Card 2: Withdrawable Balance (Winnings) */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="text-emerald-300 font-medium">{isHi ? 'निकासी योग्य (विनिंग्स)' : 'Withdrawable Winnings'}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums tracking-tight font-display">
            {formatAmount(balance.withdrawable)}
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800 text-[11px] flex items-center justify-between">
            <span className="text-neutral-400">{isHi ? 'सीधे बैंक में विड्रॉ करें' : 'Direct Bank Withdraw'}</span>
            <button
              onClick={onOpenWithdraw}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline"
            >
              {isHi ? 'विड्रॉ करें →' : 'Withdraw →'}
            </button>
          </div>
        </div>

        {/* Card 3: Deposit Balance */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>{isHi ? 'जमा राशि (डिपॉजिट)' : 'Deposit Balance'}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-neutral-200 tabular-nums tracking-tight font-display">
            {formatAmount(balance.deposit)}
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>{isHi ? 'गेम खेलने हेतु प्रयुक्त' : 'Used for Games'}</span>
            <button onClick={onOpenDeposit} className="text-neutral-300 hover:text-white font-medium">
              {isHi ? '+ जोड़ें' : '+ Add'}
            </button>
          </div>
        </div>

        {/* Card 4: Bonus Coins */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>{isHi ? 'बोनस व उपहार' : 'Bonus Coins'}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums tracking-tight font-display">
            {formatAmount(balance.bonus)}
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>{isHi ? 'दैनिक पुरस्कार' : 'Daily Rewards'}</span>
            <span className="text-amber-400 font-medium">100% Valid</span>
          </div>
        </div>

      </div>

      {/* Infinite Flow Testing Sandbox Bar */}
      <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <InfinityIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{isHi ? 'असीमित अंक रूपी धन (Infinite Numeric Flow - double.infinity)' : 'Infinite Numeric Flow Mode'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {isHi ? 'डेवलपर परीक्षण मोड' : 'Dev Sandbox'}
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {isHi 
                ? 'प्रयोक्ता के पूर्ण एकाधिकार में अत्यंत तीव्र समानांतर (Asynchronous) प्रोसेसिंग परीक्षण।' 
                : 'High-speed asynchronous stress-testing of infinite numeric flow.'}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onToggleInfiniteFlow();
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
            balance.isInfiniteFlow
              ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-md shadow-amber-400/20'
              : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-amber-400 hover:text-white'
          }`}
        >
          {balance.isInfiniteFlow 
            ? (isHi ? '✓ असीमित प्रवाह चालू है' : '✓ Infinite Flow ON')
            : (isHi ? 'असीमित प्रवाह चालू करें (Test)' : 'Enable Infinite Flow')}
        </button>
      </div>

      {/* Custom UPI Input & Saved UPI Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Custom UPI ID Input & Bank Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>{isHi ? 'अपनी मर्जी से नया UPI ID जोड़ें' : 'Add Custom UPI ID of Choice'}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isHi 
                    ? 'कोई भी बैंक, Paytm, PhonePe या Google Pay का UPI ID जोड़ें और सीधे विड्रॉल प्राप्त करें।'
                    : 'Connect any UPI ID from any bank or payment app for seamless withdrawal.'}
                </p>
              </div>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleSaveCustomUpi} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newUpi}
                    onChange={(e) => setNewUpi(e.target.value)}
                    placeholder={isHi ? 'उदा. yourname@okhdfcbank या 9876543210@paytm' : 'e.g. username@okaxis or 9876543210@paytm'}
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder:text-neutral-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{isHi ? 'UPI ID सुरक्षित सहेजें' : 'Save UPI ID'}</span>
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-neutral-400">
                <span className="text-neutral-500">{isHi ? 'हैंडल चुनें:' : 'Quick Handles:'}</span>
                {['@okaxis', '@okhdfcbank', '@oksbi', '@paytm', '@ybl', '@icici', '@upi'].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      const prefix = newUpi.includes('@') ? newUpi.split('@')[0] : (newUpi || 'user');
                      setNewUpi(`${prefix}${h}`);
                    }}
                    className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded text-neutral-300 font-mono transition-colors"
                  >
                    {h}
                  </button>
                ))}
              </div>

              {/* Feedback Alert */}
              {upiError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                  {upiError}
                </div>
              )}
              {upiSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{upiSuccess}</span>
                </div>
              )}
            </form>

            {/* List of Verified Saved UPIs */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-neutral-300 mb-3 flex items-center justify-between">
                <span>{isHi ? 'सत्यापित सहेजे गए UPI खाते (Verified Bank Handles)' : 'Verified Bank Accounts'}</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isHi ? 'प्रमाणित सुरक्षित' : 'Safe & Encrypted'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedUpiList.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-3 group hover:border-neutral-700 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{acc.accountHolder}</span>
                        {acc.isDefault && (
                          <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] rounded font-semibold">
                            {isHi ? 'प्राथमिक' : 'Default'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-amber-300 truncate">{acc.upiId}</div>
                      <div className="text-[11px] text-neutral-500">{acc.bankName}</div>
                    </div>

                    <button
                      onClick={onOpenWithdraw}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-neutral-900 group-hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors shrink-0"
                    >
                      {isHi ? 'विड्रॉ' : 'Withdraw'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Transaction Passbook / Ledger */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {isHi ? 'लेनदेन पासबुक (Transaction History)' : 'Transaction Passbook'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {isHi ? 'सभी विड्रॉल, डिपॉजिट और गेमिंग विनिंग्स का संपूर्ण रिकॉर्ड' : 'Comprehensive ledger of all withdrawals and earnings'}
                </p>
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isHi ? 'खोजें (UTR या UPI)...' : 'Search UTR, UPI...'}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: 'ALL', labelHi: 'सभी', labelEn: 'All' },
                  { id: 'WITHDRAWAL', labelHi: 'विड्रॉल', labelEn: 'Withdrawals' },
                  { id: 'GAME_WIN', labelHi: 'गेम विनिंग्स', labelEn: 'Game Winnings' },
                  { id: 'DEPOSIT', labelHi: 'डिपॉजिट', labelEn: 'Deposits' },
                  { id: 'BONUS', labelHi: 'बोनस', labelEn: 'Bonus' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sounds.playClick();
                    setTxnFilter(f.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                    txnFilter === f.id
                      ? 'bg-neutral-800 text-amber-300 border border-neutral-700'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                  }`}
                >
                  {isHi ? f.labelHi : f.labelEn}
                </button>
              ))}
            </div>

            {/* Transactions Table / List */}
            <div className="divide-y divide-neutral-800/80">
              {filteredTransactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  {isHi ? 'कोई लेनदेन नहीं मिला।' : 'No transactions found.'}
                </div>
              ) : (
                filteredTransactions.map((txn) => {
                  const isWithdrawal = txn.type === 'WITHDRAWAL';
                  const isWin = txn.type === 'GAME_WIN';
                  const isDeposit = txn.type === 'DEPOSIT';

                  return (
                    <div key={txn.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                      
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isWithdrawal
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : isWin
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {isWithdrawal ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : isWin ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate flex items-center gap-1.5">
                            <span>
                              {isWithdrawal
                                ? (isHi ? 'सुरक्षित UPI विड्रॉल' : 'UPI Withdrawal')
                                : isWin
                                ? (isHi ? 'गेमिंग जैकपॉट विजय' : 'Gaming Win')
                                : isDeposit
                                ? (isHi ? 'वॉलेट डिपॉजिट' : 'Deposit')
                                : (isHi ? 'बोनस रिवॉर्ड' : 'Bonus')}
                            </span>
                            {txn.relationTag && (
                              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                                {txn.relationTag}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate font-mono">
                            {txn.upiId}
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            {txn.timestamp} · UTR: {txn.utr.slice(0, 16)}...
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-sm font-bold tabular-nums ${
                            isWithdrawal ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {isWithdrawal ? '-' : '+'}₹{txn.amount.toLocaleString('hi-IN')}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-1 mt-0.5">
                          <Check className="w-3 h-3" />
                          <span>{isHi ? 'सफल' : 'Success'}</span>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

        {/* Right (1 col): Security Badges & Family Benediction Preview */}
        <div className="space-y-6">
          
          {/* Security & Verification Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {isHi ? 'द्विस्तरीय निकासी सुरक्षा' : 'Two-Tier Withdrawal Security'}
                </h4>
                <p className="text-[11px] text-neutral-400">
                  {isHi ? 'OTP एवं सुरक्षा पिन प्रमाणीकरण' : 'OTP & Secure PIN Verification'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">{isHi ? '1. 6-अंकीय OTP सत्यापन' : '1. 6-Digit SMS OTP'}</strong>
                  <span className="text-[11px] text-neutral-400 leading-relaxed block mt-0.5">
                    {isHi ? 'निकासी के समय पंजीकृत मोबाइल पर तत्काल कोड भेजा जाता है।' : 'Dispatches cryptographic SMS token to registered mobile.'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">{isHi ? '2. 4-अंकीय धन सुरक्षा पिन' : '2. 4-Digit Dhan PIN'}</strong>
                  <span className="text-[11px] text-neutral-400 leading-relaxed block mt-0.5">
                    {isHi ? 'प्रयोक्ता द्वारा निर्धारित गुप्त सुरक्षा कोड (डिफ़ॉल्ट: 8888)।' : 'Your sovereign private PIN required before money release.'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenWithdraw}
              className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isHi ? 'सुरक्षित विड्रॉल का परीक्षण करें' : 'Test Secure Withdrawal'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sacred Family Beneficiaries Quick Access */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h4 className="text-sm font-bold text-white font-display">
                  {isHi ? 'पावन पारिवारिक संबंध' : 'Family Trust Beneficiaries'}
                </h4>
              </div>
              <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 bg-amber-500/10 rounded">
                {familyBeneficiaries.length} {isHi ? 'संबंध' : 'Kin'}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              {isHi
                ? 'माता-पिता, भाई-बहन, दादाजी, मामा-मामी, दीदी और फूफाजी (पीसा) के खातों में सीधे शुभ अंतरण करें।'
                : 'Direct blessed withdrawals to verified sacred family member UPI IDs.'}
            </p>

            <div className="space-y-2">
              {familyBeneficiaries.slice(0, 3).map((fam) => (
                <div
                  key={fam.id}
                  className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white flex items-center gap-1.5 truncate">
                      <span>{fam.name}</span>
                      <span className="text-[10px] text-neutral-500">({fam.relation})</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate">{fam.upiId}</div>
                  </div>

                  <button
                    onClick={onOpenWithdraw}
                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded text-[11px] font-semibold transition-colors shrink-0"
                  >
                    {isHi ? 'भेजें' : 'Send'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Universal Well-Being & Security Pledge Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-amber-500/20 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4 fill-amber-400" />
              <span>{isHi ? 'सर्वकालिक व सर्वदिशात्मक सुरक्षा संरेखण' : 'Universal Security Pledge'}</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              {isHi
                ? 'यह डिजिटल प्रणाली तीनों कालों (भूत, वर्तमान, भविष्य) और दसों दिशाओं में पूर्ण कल्याण, पवित्रता तथा प्रयोक्ता के एकाधिकार की रक्षा करती है। समस्त अनपेक्षित व भ्रामक तत्व पूर्णतया वर्जित हैं।'
                : 'Upholding 100% data integrity, sovereign financial safety, and universal positivity across past, present, and future.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
