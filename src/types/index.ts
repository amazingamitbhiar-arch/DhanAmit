export type Language = 'hi' | 'en';

export interface WalletBalance {
  total: number;
  withdrawable: number; // विनिंग्स (Game winnings available for withdraw)
  deposit: number;      // जमा राशि
  bonus: number;        // बोनस राशि
  isInfiniteFlow: boolean; // Developer Infinite numeric flow toggle
}

export type TransactionType = 'WITHDRAWAL' | 'DEPOSIT' | 'GAME_WIN' | 'BONUS' | 'FAMILY_BENEDICTION';
export type TransactionStatus = 'SUCCESS' | 'PROCESSING' | 'FAILED';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  upiId: string;
  utr: string;
  timestamp: string;
  beneficiaryName?: string;
  relationTag?: string;
  verificationMethod?: 'OTP' | 'PIN' | 'BIOMETRIC';
  notes?: string;
}

export interface FamilyBeneficiary {
  id: string;
  name: string;
  relation: string; // माताजी, पिताजी, भाई, दीदी, दादाजी, मामाजी, मामीजी, फूफाजी (पीसा), आदि
  relationKey: 'mother' | 'father' | 'brother' | 'sister' | 'grandfather' | 'maternal_uncle' | 'maternal_aunt' | 'paternal_uncle' | 'relative';
  upiId: string;
  isVerified: boolean;
  blessingTag: string;
  addedAt: string;
}

export interface SavedUpiAccount {
  id: string;
  upiId: string;
  bankName: string;
  accountHolder: string;
  isDefault: boolean;
  verifiedAt: string;
}

export interface MiniGame {
  id: string;
  titleHi: string;
  titleEn: string;
  taglineHi: string;
  taglineEn: string;
  iconImage: string;
  minBet: number;
  maxMultiplier: string;
  activePlayers: number;
  category: 'wheel' | 'rocket' | 'cards';
}
