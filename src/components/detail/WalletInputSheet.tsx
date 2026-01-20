import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getIconComponent } from '@/lib/finance-utils';
import { Wallet } from '@/types/finance';
import { toast } from 'sonner';

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

interface WalletInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Wallet | null;
}

export const WalletInputSheet = ({ open, onOpenChange, initialData }: WalletInputSheetProps) => {
  const { addWallet, editWallet } = useFinance();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Wallet');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSelectedIcon(initialData.icon);
      setBalance(initialData.balance.toString());
    } else {
      // Reset defaults when opening new
      if (open) {
        setName('');
        setSelectedIcon('Wallet');
        setBalance('');
      }
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Masukkan nama dompet');
      return;
    }

    const balanceNum = parseFloat(balance) || 0;

    try {
      if (initialData) {
        await editWallet(initialData.id, {
          name: name.trim(),
          icon: selectedIcon,
          balance: balanceNum,
        });
        toast.success('Dompet berhasil diperbarui');
      } else {
        await addWallet({
          name: name.trim(),
          icon: selectedIcon,
          balance: balanceNum,
        });
        toast.success('Dompet berhasil ditambahkan');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(initialData ? 'Gagal memperbarui dompet' : 'Gagal menambahkan dompet');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            {initialData ? 'Edit Dompet' : 'Dompet Baru'}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-24 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Dompet</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bank Mandiri"
              className="h-12"
            />
          </div>

          {/* Balance Input */}
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

          {/* Icon Selection */}
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

          {/* Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-cream border-t border-gray-200 rounded-t-3xl">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-teal hover:bg-teal-600 text-white font-semibold"
            >
              {initialData ? 'Simpan Perubahan' : 'Tambah Dompet'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
