import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency, getIconComponent } from '@/lib/finance-utils';
import { ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 flex items-center gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all group relative"
              >
                <button
                  onClick={() => onSelectWallet?.(wallet.id)}
                  className="flex items-center gap-4 flex-1 min-w-0 text-left"
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
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-warmGray/50 hover:text-warmGray">
                      <MoreHorizontal className="w-4 h-4" />
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
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
