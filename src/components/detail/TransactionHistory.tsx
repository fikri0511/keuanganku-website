import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency, formatDateFull, getIconComponent } from '@/lib/finance-utils';
import { motion } from 'framer-motion';
import { groupBy } from 'lodash-es';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/finance';
import { toast } from 'sonner';

interface TransactionHistoryProps {
  walletId?: string;
  onEdit?: (transaction: Transaction) => void;
}

export const TransactionHistory = ({ walletId, onEdit }: TransactionHistoryProps) => {
  const { transactions, categories, wallets, deleteTransaction } = useFinance();

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await deleteTransaction(id);
        toast.success('Transaksi berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus transaksi');
      }
    }
  };

  const filteredTransactions = walletId
    ? transactions.filter((t) => t.walletId === walletId)
    : transactions;

  if (filteredTransactions.length === 0) {
    return (
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold mb-4">Riwayat Transaksi</h2>
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 text-center">
          <p className="text-warmGray">Belum ada transaksi</p>
        </div>
      </div>
    );
  }

  // Group transactions by date
  const groupedByDate = groupBy(filteredTransactions, (t) => {
    const date = new Date(t.date);
    return date.toISOString().split('T')[0];
  });

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="px-6 py-6">
      <h2 className="text-xl font-bold mb-4">Riwayat Transaksi</h2>
      
      <div className="space-y-6">
        {sortedDates.map((date, dateIndex) => {
          const dateTransactions = groupedByDate[date];
          
          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: dateIndex * 0.05 }}
            >
              {/* Date Header */}
              <div className="sticky top-0 bg-cream py-2 z-10">
                <p className="text-sm font-semibold text-warmGray">
                  {formatDateFull(date)}
                </p>
              </div>

              {/* Transactions */}
              <div className="space-y-2 mt-2">
                {dateTransactions.map((transaction, index) => {
                  const category = categories.find((c) => c.id === transaction.categoryId);
                  const wallet = wallets.find((w) => w.id === transaction.walletId);
                  const Icon = getIconComponent(category?.icon || 'CircleDot');

                  return (
                    <div
                      key={transaction.id}
                      className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 flex items-center gap-4"
                    >
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'income'
                            ? 'bg-mint/20'
                            : 'bg-coral/20'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            transaction.type === 'income' ? 'text-mint' : 'text-coral'
                          }`}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal truncate">
                          {category?.name || 'Unknown'}
                        </p>
                        {!walletId && (
                          <p className="text-sm text-warmGray truncate">
                            {wallet?.name || 'Unknown'}
                          </p>
                        )}
                        {transaction.note && (
                          <p className="text-xs text-warmGray/70 mt-1 truncate">
                            {transaction.note}
                          </p>
                        )}
                      </div>

                      {/* Amount & Actions */}
                      <div className="text-right flex items-center gap-2">
                        <p
                          className={`text-lg font-bold font-mono ${
                            transaction.type === 'income' ? 'text-mint' : 'text-coral'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount).replace('Rp', '')}
                        </p>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-warmGray/50 hover:text-warmGray">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTimeout(() => onEdit?.(transaction), 100)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(transaction.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
