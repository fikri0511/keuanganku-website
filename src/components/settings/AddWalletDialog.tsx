import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getIconComponent } from '@/lib/finance-utils';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';

const walletIcons = [
  'Wallet',
  'Landmark',
  'Smartphone',
  'CreditCard',
  'Banknote',
  'PiggyBank',
  'Building',
  'DollarSign',
];

export const AddWalletDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { addWallet } = useFinance();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Wallet');
  const [balance, setBalance] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Masukkan nama dompet');
      return;
    }

    const balanceNum = parseFloat(balance) || 0;

    addWallet({
      name: name.trim(),
      icon: selectedIcon,
      balance: balanceNum,
    });

    toast.success('Dompet berhasil ditambahkan');
    setName('');
    setSelectedIcon('Wallet');
    setBalance('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tambah Dompet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Dompet</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bank Mandiri"
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Saldo Awal</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warmGray">
                Rp
              </span>
              <Input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0"
                className="h-12 pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Pilih Ikon</label>
            <div className="grid grid-cols-4 gap-3">
              {walletIcons.map((iconName) => {
                const Icon = getIconComponent(iconName);
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedIcon === iconName
                        ? 'border-teal bg-teal/10'
                        : 'border-gray-200 hover:border-teal/50'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto ${
                        selectedIcon === iconName ? 'text-teal' : 'text-warmGray'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12"
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} className="h-12 bg-teal hover:bg-teal-600">
            Tambah Dompet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
