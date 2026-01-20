import { useState } from 'react';
import { WalletList } from '@/components/detail/WalletList';
import { TransactionHistory } from '@/components/detail/TransactionHistory';
import { TransactionInputSheet } from '@/components/dashboard/TransactionInputSheet';
import { WalletInputSheet } from '@/components/detail/WalletInputSheet';
import { Transaction, Wallet } from '@/types/finance';

export const DetailScreen = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setTimeout(() => setEditingTransaction(null), 300);
    }
  };

  const handleEditWallet = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setIsWalletSheetOpen(true);
  };

  const handleWalletSheetOpenChange = (open: boolean) => {
    setIsWalletSheetOpen(open);
    if (!open) {
      setTimeout(() => setEditingWallet(null), 300);
    }
  };

  return (
    <div className="pb-20">
      <div className="px-6 pt-6 mb-6">
        <h1 className="text-2xl font-bold">Detail Keuangan</h1>
        <p className="text-warmGray mt-1">Lihat dompet dan riwayat transaksi</p>
      </div>
      
      <WalletList onEdit={handleEditWallet} />
      <TransactionHistory onEdit={handleEdit} />

      <TransactionInputSheet 
        open={isSheetOpen} 
        onOpenChange={handleSheetOpenChange}
        initialData={editingTransaction}
      />

      <WalletInputSheet 
        open={isWalletSheetOpen} 
        onOpenChange={handleWalletSheetOpenChange}
        initialData={editingWallet}
      />
    </div>
  );
};
