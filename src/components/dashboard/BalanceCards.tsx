import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/lib/finance-utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const BalanceCards = () => {
  const { getTotalBalance, getTotalIncome, getTotalExpense } = useFinance();

  const totalBalance = getTotalBalance();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();

  return (
    <div className="space-y-4 px-6 pt-6">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-teal to-teal-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <p className="text-sm text-white/80 mb-2 font-medium">Total Uang</p>
          <h1 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight">
            {formatCurrency(totalBalance)}
          </h1>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
      </motion.div>

      {/* Income/Expense Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="bg-mint/10 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 border border-mint/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-mint/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-mint" />
            </div>
            <p className="text-sm text-warmGray font-medium">Pemasukan</p>
          </div>
          <p className="text-xl font-bold font-mono text-mint">
            {formatCurrency(totalIncome)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="bg-coral/10 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 border border-coral/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-coral/20 rounded-full flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-coral" />
            </div>
            <p className="text-sm text-warmGray font-medium">Pengeluaran</p>
          </div>
          <p className="text-xl font-bold font-mono text-coral">
            {formatCurrency(totalExpense)}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
