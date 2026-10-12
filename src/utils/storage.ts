import { WalletBalance, Transaction, FamilyBeneficiary, SavedUpiAccount } from '../types';

const STORAGE_KEYS = {
  BALANCE: 'dhanamit_wallet_balance',
  TRANSACTIONS: 'dhanamit_transactions',
  FAMILY_BENEFICIARIES: 'dhanamit_family_beneficiaries',
  SAVED_UPI: 'dhanamit_saved_upi',
  USER_PIN: 'dhanamit_user_pin',
};

export const INITIAL_BALANCE: WalletBalance = {
  total: 45750,
  withdrawable: 38200, // विनिंग्स (Available for withdrawal)
  deposit: 5550,
  bonus: 2000,
  isInfiniteFlow: false,
};

export const INITIAL_BENEFICIARIES: FamilyBeneficiary[] = [
  {
    id: 'fam_1',
    name: 'श्रीमती माताजी',
    relation: 'माताजी',
    relationKey: 'mother',
    upiId: 'mataji.blessings@oksbi',
    isVerified: true,
    blessingTag: 'वात्सल्य व सर्वोच्च आशीर्वाद',
    addedAt: '2026-10-01',
  },
  {
    id: 'fam_2',
    name: 'श्री पिताजी',
    relation: 'पिताजी',
    relationKey: 'father',
    upiId: 'pitaji.samriddhi@okhdfcbank',
    isVerified: true,
    blessingTag: 'संरक्षण व मार्गदर्शन',
    addedAt: '2026-10-01',
  },
  {
    id: 'fam_3',
    name: 'आदरणीय दादाजी',
    relation: 'दादाजी',
    relationKey: 'grandfather',
    upiId: 'dadaji.kripa@okaxis',
    isVerified: true,
    blessingTag: 'वंश मर्यादा व ईश्वरीय कृपा',
    addedAt: '2026-10-02',
  },
  {
    id: 'fam_4',
    name: 'प्रिय दीदी',
    relation: 'दीदी',
    relationKey: 'sister',
    upiId: 'didi.sneha@paytm',
    isVerified: true,
    blessingTag: 'स्नेह व पावन शुभभावना',
    addedAt: '2026-10-03',
  },
  {
    id: 'fam_5',
    name: 'प्रिय अनुज / भाई',
    relation: 'भाई',
    relationKey: 'brother',
    upiId: 'bhai.raksha@ybl',
    isVerified: true,
    blessingTag: 'अटूट संबल व विजय',
    addedAt: '2026-10-05',
  },
  {
    id: 'fam_6',
    name: 'आदरणीय मामाजी',
    relation: 'मामाजी',
    relationKey: 'maternal_uncle',
    upiId: 'mamaji.anugrah@oksbi',
    isVerified: true,
    blessingTag: 'मातृकुल गौरव व मंगल',
    addedAt: '2026-10-06',
  },
  {
    id: 'fam_7',
    name: 'आदरणीया मामीजी',
    relation: 'मामीजी',
    relationKey: 'maternal_aunt',
    upiId: 'mamiji.kalyan@icici',
    isVerified: true,
    blessingTag: 'स्नेहपूर्ण आतिथ्य व सौहार्द',
    addedAt: '2026-10-07',
  },
  {
    id: 'fam_8',
    name: 'आदरणीय फूफाजी (पीसा)',
    relation: 'फूफा (पीसा)',
    relationKey: 'paternal_uncle',
    upiId: 'foofaji.shubh@kotak',
    isVerified: true,
    blessingTag: 'सदाचार व आत्मीय सम्मान',
    addedAt: '2026-10-08',
  },
];

export const INITIAL_SAVED_UPI: SavedUpiAccount[] = [
  {
    id: 'upi_1',
    upiId: 'dhanamit.user@okaxis',
    bankName: 'Axis Bank',
    accountHolder: 'Amit (प्राधिकृत प्रयोक्ता)',
    isDefault: true,
    verifiedAt: '2026-10-10',
  },
  {
    id: 'upi_2',
    upiId: 'amit.dhan@paytm',
    bankName: 'Paytm Payments Bank',
    accountHolder: 'Amit',
    isDefault: false,
    verifiedAt: '2026-10-08',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-984210',
    type: 'WITHDRAWAL',
    amount: 5000,
    status: 'SUCCESS',
    upiId: 'dhanamit.user@okaxis',
    utr: 'UTR2026101198421008',
    timestamp: '11 Oct 2026, 04:30 PM',
    verificationMethod: 'OTP',
    notes: 'त्वरित सुरक्षित विड्रॉल सफल',
  },
  {
    id: 'TXN-874312',
    type: 'GAME_WIN',
    amount: 12500,
    status: 'SUCCESS',
    upiId: 'DhanAmit Game Arena',
    utr: 'UTR2026101087431201',
    timestamp: '10 Oct 2026, 08:15 PM',
    notes: 'धन चक्र (Dhan Chakra) 10x जैकपॉट विजय',
  },
  {
    id: 'TXN-763290',
    type: 'DEPOSIT',
    amount: 2000,
    status: 'SUCCESS',
    upiId: 'dhanamit.user@okaxis',
    utr: 'UTR2026100976329094',
    timestamp: '09 Oct 2026, 11:20 AM',
    notes: 'UPI त्वरित जमा',
  },
  {
    id: 'TXN-652199',
    type: 'WITHDRAWAL',
    amount: 11000,
    status: 'SUCCESS',
    upiId: 'mataji.blessings@oksbi',
    utr: 'UTR2026100765219933',
    timestamp: '07 Oct 2026, 09:05 AM',
    beneficiaryName: 'श्रीमती माताजी',
    relationTag: 'माताजी',
    verificationMethod: 'PIN',
    notes: 'मातृ-कल्याण पावन अंतरण',
  },
  {
    id: 'TXN-541098',
    type: 'BONUS',
    amount: 1000,
    status: 'SUCCESS',
    upiId: 'DhanAmit Welcome',
    utr: 'UTR2026100554109822',
    timestamp: '05 Oct 2026, 10:00 AM',
    notes: 'शुभ स्वागतम् बोनस',
  },
];

export const loadStoredBalance = (): WalletBalance => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return data ? JSON.parse(data) : INITIAL_BALANCE;
  } catch {
    return INITIAL_BALANCE;
  }
};

export const saveStoredBalance = (balance: WalletBalance) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(balance));
  } catch {}
};

export const loadStoredTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
};

export const saveStoredTransactions = (txns: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
  } catch {}
};

export const loadStoredBeneficiaries = (): FamilyBeneficiary[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAMILY_BENEFICIARIES);
    return data ? JSON.parse(data) : INITIAL_BENEFICIARIES;
  } catch {
    return INITIAL_BENEFICIARIES;
  }
};

export const saveStoredBeneficiaries = (list: FamilyBeneficiary[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAMILY_BENEFICIARIES, JSON.stringify(list));
  } catch {}
};

export const loadStoredSavedUpi = (): SavedUpiAccount[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_UPI);
    return data ? JSON.parse(data) : INITIAL_SAVED_UPI;
  } catch {
    return INITIAL_SAVED_UPI;
  }
};

export const saveStoredSavedUpi = (list: SavedUpiAccount[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_UPI, JSON.stringify(list));
  } catch {}
};

export const getUserPin = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_PIN) || '8888';
  } catch {
    return '8888';
  }
};

export const setUserPin = (pin: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PIN, pin);
  } catch {}
};
