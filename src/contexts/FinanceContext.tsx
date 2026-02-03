import React, { createContext, useContext, useState, useEffect } from 'react';
import { Wallet, Category, Transaction, Transfer } from '@/types/finance';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

interface FinanceContextType {
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  transfers: Transfer[];
  isLoading: boolean;
  addWallet: (wallet: Omit<Wallet, 'id'>) => Promise<void>;
  editWallet: (id: string, wallet: Omit<Wallet, 'id'>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  addTransfer: (transfer: Omit<Transfer, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch Wallets
      const { data: walletsData, error: walletsError } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at');
      
      if (walletsData) setWallets(walletsData);
      if (walletsError) console.error('Error fetching wallets:', walletsError);

      // Fetch Categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at');
      
      if (categoriesData) {
        // Map DB types to App types if necessary, though they match closely
        setCategories(categoriesData as Category[]);
      }
      if (categoriesError) console.error('Error fetching categories:', categoriesError);

      // Fetch Transactions via Edge Function
      const { data: feedData, error: feedError } = await supabase.functions.invoke('supabase-functions-transaction-feed');

      if (feedData) {
        const txs: Transaction[] = [];
        const trs: Transfer[] = [];

        feedData.forEach((t: any) => {
          if (t.type === 'transfer') {
            trs.push({
              id: t.transaction_id,
              amount: t.amount,
              sourceWalletId: t.wallet?.id,
              destinationWalletId: t.destination_wallet?.id,
              note: t.note || undefined,
              date: t.date,
              createdAt: t.created_at,
            });
          } else {
            txs.push({
              id: t.transaction_id,
              type: t.type as 'income' | 'expense',
              amount: t.amount,
              walletId: t.wallet?.id,
              categoryId: t.category?.id,
              note: t.note || undefined,
              date: t.date,
              createdAt: t.created_at,
            });
          }
        });

        setTransactions(txs);
        setTransfers(trs);
      }
      if (feedError) console.error('Error fetching transactions feed:', feedError);

    } catch (error) {
      console.error('Unexpected error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addWallet = async (wallet: Omit<Wallet, 'id'>) => {
    const { error } = await supabase.from('wallets').insert({
      name: wallet.name,
      icon: wallet.icon,
      balance: wallet.balance,
    });
    if (error) {
      console.error('Error adding wallet:', error);
      throw error;
    }
  };

  const editWallet = async (id: string, wallet: Omit<Wallet, 'id'>) => {
    const { error } = await supabase.from('wallets').update({
      name: wallet.name,
      icon: wallet.icon,
      balance: wallet.balance,
    }).eq('id', id);

    if (error) {
      console.error('Error editing wallet:', error);
      throw error;
    }
  };

  const deleteWallet = async (id: string) => {
    const { error } = await supabase.from('wallets').delete().eq('id', id);
    if (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const { error } = await supabase.from('categories').insert({
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type,
    });
    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('transactions').insert({
      type: transaction.type,
      amount: transaction.amount,
      wallet_id: transaction.walletId,
      category_id: transaction.categoryId,
      note: transaction.note,
      date: transaction.date,
    });
    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const editTransaction = async (id: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('transactions').update({
      type: transaction.type,
      amount: transaction.amount,
      wallet_id: transaction.walletId,
      category_id: transaction.categoryId,
      note: transaction.note,
      date: transaction.date,
    }).eq('id', id);

    if (error) {
      console.error('Error editing transaction:', error);
      throw error;
    }
  };

  const addTransfer = async (transfer: Omit<Transfer, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('transactions').insert({
      type: 'transfer',
      amount: transfer.amount,
      wallet_id: transfer.sourceWalletId,
      destination_wallet_id: transfer.destinationWalletId,
      note: transfer.note,
      date: transfer.date,
    });
    if (error) {
      console.error('Error adding transfer:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const resetAllData = async () => {
    // Dangerous: Deletes everything
    // We should delete transactions first, then wallets/categories if desired?
    // PRD says "Reset Data: Destructive action... accidental data loss".
    // "Clear All Transactions & Data" implies everything.
    // Due to FK constraints, delete transactions first.
    
    try {
      await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('wallets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Note: Triggers might try to update non-existent wallets if we delete transactions but not wallets yet.
      // But delete transactions updates balances.
      // If we delete all transactions, balances should reverse.
      // Then we delete wallets.
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  };

  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  return (
    <FinanceContext.Provider
      value={{
        wallets,
        categories,
        transactions,
        transfers,
        isLoading,
        addWallet,
        editWallet,
        deleteWallet,
        addCategory,
        addTransaction,
        editTransaction,
        addTransfer,
        deleteTransaction,
        resetAllData,
        getTotalBalance,
        getTotalIncome,
        getTotalExpense,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
