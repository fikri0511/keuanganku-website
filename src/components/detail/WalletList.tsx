import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency, getIconComponent } from '@/lib/finance-utils';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Wallet } from '@/types/finance';
import { toast } from 'sonner';

interface WalletListProps {
  onSelectWallet?: (walletId: string) => void;
  onEdit?: (wallet: Wallet) => void;
}

export const WalletList = ({ onSelectWallet, onEdit }: WalletListProps) => {
  const { wallets, deleteWallet } = useFinance();

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dompet ini?')) {
      try {
        await deleteWallet(id);
        toast.success('Dompet berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus dompet');
      }
    }
  };

  return (
    <div className="px-6 py-4 space-y-2">
      <h2 className="text-lg font-bold mb-3">Dompet Saya</h2>
      
      {wallets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8 text-center">
          <p className="text-warmGray">Belum ada dompet</p>
          <p className="text-sm text-warmGray/70 mt-2">
            Tambahkan dompet di Pengaturan
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {wallets.map((wallet, index) => {
            const Icon = getIconComponent(wallet.icon);
            
            return (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all group relative flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center group-hover:bg-teal/20 transition-colors flex-shrink-0">
                    <Icon className="w-5 h-5 text-teal" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectWallet?.(wallet.id);
                    }}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-xs font-semibold text-charcoal line-clamp-1">
                      {wallet.name}
                    </p>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-warmGray/50 hover:text-warmGray flex-shrink-0 -mr-2">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(wallet)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(wallet.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <button
                  onClick={() => onSelectWallet?.(wallet.id)}
                  className="text-left"
                >
                  <p className="text-sm font-bold font-mono text-teal break-words">
                    {formatCurrency(wallet.balance)}
                  </p>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
