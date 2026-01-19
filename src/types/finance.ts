export type TransactionType = 'income' | 'expense';

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  walletId: string;
  categoryId: string;
  note?: string;
  date: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  amount: number;
  sourceWalletId: string;
  destinationWalletId: string;
  note?: string;
  date: string;
  createdAt: string;
}
