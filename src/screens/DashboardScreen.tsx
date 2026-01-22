import { useState } from 'react';
import { BalanceCards } from '@/components/dashboard/BalanceCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { TransactionInputSheet } from '@/components/dashboard/TransactionInputSheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction } from '@/types/finance';

export const DashboardScreen = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };

  return (
    <div className="pb-20">
      <BalanceCards />
      <RecentTransactions onEdit={handleEdit} />

      {/* FAB */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-24 right-6 z-40"
      >
        <Button
          onClick={() => {
            setEditingTransaction(null);
            setIsSheetOpen(true);
          }}
          className="w-14 h-14 rounded-full shadow-lg bg-teal hover:bg-teal-600 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      <TransactionInputSheet 
        open={isSheetOpen} 
        onOpenChange={handleSheetOpenChange}
        initialData={editingTransaction}
      />
    </div>
  );
};
