import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WalletScreen } from './components/WalletScreen';
import { GamesArena } from './components/GamesArena';
import { FamilyTrustScreen } from './components/FamilyTrustScreen';
import { InfiniteFlowTester } from './components/InfiniteFlowTester';
import { WithdrawModal } from './components/WithdrawModal';
import { DepositModal } from './components/DepositModal';
import { Footer } from './components/Footer';
import { 
  WalletBalance, 
  Transaction, 
  FamilyBeneficiary, 
  SavedUpiAccount, 
  Language 
} from './types';
import { 
  loadStoredBalance, 
  saveStoredBalance, 
  loadStoredTransactions, 
  saveStoredTransactions, 
  loadStoredBeneficiaries, 
  saveStoredBeneficiaries, 
  loadStoredSavedUpi, 
  saveStoredSavedUpi 
} from './utils/storage';
import { sounds } from './utils/soundEffects';

export function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [activeTab, setActiveTab] = useState<'wallet' | 'games' | 'family' | 'infinite-test'>('wallet');
  
  // Stored state
  const [balance, setBalance] = useState<WalletBalance>(loadStoredBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(loadStoredTransactions);
  const [familyBeneficiaries, setFamilyBeneficiaries] = useState<FamilyBeneficiary[]>(loadStoredBeneficiaries);
  const [savedUpiList, setSavedUpiList] = useState<SavedUpiAccount[]>(loadStoredSavedUpi);

  // Modals
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveStoredBalance(balance);
  }, [balance]);

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredBeneficiaries(familyBeneficiaries);
  }, [familyBeneficiaries]);

  useEffect(() => {
    saveStoredSavedUpi(savedUpiList);
  }, [savedUpiList]);

  // Handle successful withdrawal
  const handleWithdrawSuccess = (
    amount: number,
    upiId: string,
    method: 'OTP' | 'PIN',
    beneficiaryName?: string,
    relationTag?: string
  ): Transaction => {
    // Generate UTR and timestamp
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const utrStr = `UTR${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${randomSuffix}`;

    const newTxn: Transaction = {
      id: `TXN-${randomSuffix}`,
      type: 'WITHDRAWAL',
      amount,
      status: 'SUCCESS',
      upiId,
      utr: utrStr,
      timestamp: timestampStr,
      verificationMethod: method,
      beneficiaryName,
      relationTag,
      notes: beneficiaryName ? `${beneficiaryName} (${relationTag}) को सुरक्षित अंतरण` : 'सुरक्षित UPI विड्रॉल',
    };

    // Update balances
    setBalance((prev) => {
      if (prev.isInfiniteFlow) return prev;
      const newWithdrawable = Math.max(0, prev.withdrawable - amount);
      const newTotal = Math.max(0, prev.total - amount);
      return {
        ...prev,
        withdrawable: newWithdrawable,
        total: newTotal,
      };
    });

    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  };

  // Handle deposit
  const handleDepositSuccess = (amount: number, method: string): Transaction => {
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const utrStr = `UTR${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${randomSuffix}`;

    const newTxn: Transaction = {
      id: `TXN-${randomSuffix}`,
      type: 'DEPOSIT',
      amount,
      status: 'SUCCESS',
      upiId: `DhanAmit (${method})`,
      utr: utrStr,
      timestamp: timestampStr,
      notes: 'वॉलेट त्वरित टॉप-अप',
    };

    setBalance((prev) => ({
      ...prev,
      deposit: prev.deposit + amount,
      total: prev.total + amount,
    }));

    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  };

  // Handle Game Win
  const handleGameWin = (gameName: string, betAmount: number, multiplier: number): Transaction => {
    const winAmount = Math.round(betAmount * multiplier);
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const utrStr = `UTR${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${randomSuffix}`;

    const newTxn: Transaction = {
      id: `TXN-${randomSuffix}`,
      type: 'GAME_WIN',
      amount: winAmount,
      status: 'SUCCESS',
      upiId: gameName,
      utr: utrStr,
      timestamp: timestampStr,
      notes: `${gameName} में ${multiplier}x जीत`,
    };

    setBalance((prev) => ({
      ...prev,
      withdrawable: prev.withdrawable + winAmount,
      total: prev.total + winAmount,
    }));

    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  };

  // Add custom UPI
  const handleAddUpi = (upiId: string, bankName: string) => {
    const newAccount: SavedUpiAccount = {
      id: `upi_${Date.now()}`,
      upiId,
      bankName,
      accountHolder: 'Amit (प्राधिकृत प्रयोक्ता)',
      isDefault: savedUpiList.length === 0,
      verifiedAt: new Date().toISOString().split('T')[0],
    };
    setSavedUpiList((prev) => [newAccount, ...prev]);
  };

  // Add family beneficiary
  const handleAddBeneficiary = (beneficiary: Omit<FamilyBeneficiary, 'id' | 'addedAt' | 'isVerified'>) => {
    const newFam: FamilyBeneficiary = {
      ...beneficiary,
      id: `fam_${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
      isVerified: true,
    };
    setFamilyBeneficiaries((prev) => [newFam, ...prev]);
  };

  // Quick withdrawal trigger to family
  const handleInitiateWithdrawalToFamily = (beneficiary: FamilyBeneficiary) => {
    setWithdrawModalOpen(true);
  };

  const handleToggleInfiniteFlow = () => {
    setBalance((prev) => ({
      ...prev,
      isInfiniteFlow: !prev.isInfiniteFlow,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Top Header */}
      <Header
        balance={balance}
        activeTab={activeTab}
        setActiveTab={(t) => {
          sounds.playClick();
          setActiveTab(t);
        }}
        lang={lang}
        setLang={(l) => {
          sounds.playClick();
          setLang(l);
        }}
        onOpenWithdraw={() => {
          sounds.playClick();
          setWithdrawModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {activeTab === 'wallet' && (
          <WalletScreen
            balance={balance}
            savedUpiList={savedUpiList}
            transactions={transactions}
            familyBeneficiaries={familyBeneficiaries}
            onOpenWithdraw={() => {
              sounds.playClick();
              setWithdrawModalOpen(true);
            }}
            onOpenDeposit={() => {
              sounds.playClick();
              setDepositModalOpen(true);
            }}
            onAddUpi={handleAddUpi}
            onToggleInfiniteFlow={handleToggleInfiniteFlow}
            lang={lang}
          />
        )}

        {activeTab === 'games' && (
          <GamesArena
            balance={balance}
            onGameWin={handleGameWin}
            onOpenWithdraw={() => {
              sounds.playClick();
              setWithdrawModalOpen(true);
            }}
            lang={lang}
          />
        )}

        {activeTab === 'family' && (
          <FamilyTrustScreen
            beneficiaries={familyBeneficiaries}
            onAddBeneficiary={handleAddBeneficiary}
            onInitiateWithdrawalToFamily={handleInitiateWithdrawalToFamily}
            lang={lang}
          />
        )}

        {activeTab === 'infinite-test' && (
          <InfiniteFlowTester
            balance={balance}
            onSetBalance={setBalance}
            onOpenWithdraw={() => {
              sounds.playClick();
              setWithdrawModalOpen(true);
            }}
            lang={lang}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectTab={(t) => {
          sounds.playClick();
          setActiveTab(t);
        }}
      />

      {/* Withdraw Modal with OTP & PIN verification modes */}
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        balance={balance}
        savedUpiList={savedUpiList}
        familyBeneficiaries={familyBeneficiaries}
        onWithdrawSuccess={handleWithdrawSuccess}
        lang={lang}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDepositSuccess={handleDepositSuccess}
        lang={lang}
      />

    </div>
  );
}

export default App;
