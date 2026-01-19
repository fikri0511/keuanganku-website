import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency, getIconComponent } from '@/lib/finance-utils';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletListProps {
  onSelectWallet?: (walletId: string) => void;
}

export const WalletList = ({ onSelectWallet }: WalletListProps) => {
  const { wallets } = useFinance();

  return (
    <div className="px-6 py-6 space-y-3">
      <h2 className="text-xl font-bold mb-4">Dompet Saya</h2>
      
      {wallets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 text-center">
          <p className="text-warmGray">Belum ada dompet</p>
          <p className="text-sm text-warmGray/70 mt-2">
            Tambahkan dompet di Pengaturan
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wallets.map((wallet, index) => {
            const Icon = getIconComponent(wallet.icon);
            
            return (
              <motion.button
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => onSelectWallet?.(wallet.id)}
                className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 flex items-center gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all text-left group"
              >
                <div className="w-14 h-14 bg-teal/10 rounded-2xl flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <Icon className="w-7 h-7 text-teal" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-charcoal truncate mb-1">
                    {wallet.name}
                  </p>
                  <p className="text-2xl font-bold font-mono text-teal">
                    {formatCurrency(wallet.balance)}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-warmGray group-hover:text-teal transition-colors" />
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};
