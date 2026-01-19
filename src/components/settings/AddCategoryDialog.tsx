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
import { TransactionType } from '@/types/finance';
import { toast } from 'sonner';

const categoryIcons = [
  'Briefcase',
  'Laptop',
  'TrendingUp',
  'Gift',
  'UtensilsCrossed',
  'Car',
  'ShoppingCart',
  'FileText',
  'Film',
  'Heart',
  'Home',
  'Zap',
  'Coffee',
  'ShoppingBag',
];

const categoryColors = [
  { name: 'Mint', value: '#51CF66' },
  { name: 'Coral', value: '#FF6B6B' },
  { name: 'Blue', value: '#339AF0' },
  { name: 'Purple', value: '#845EF7' },
  { name: 'Yellow', value: '#FAB005' },
  { name: 'Orange', value: '#FF922B' },
];

export const AddCategoryDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { addCategory } = useFinance();
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [selectedIcon, setSelectedIcon] = useState('UtensilsCrossed');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Masukkan nama kategori');
      return;
    }

    addCategory({
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      type,
    });

    toast.success('Kategori berhasil ditambahkan');
    setName('');
    setSelectedIcon('UtensilsCrossed');
    setSelectedColor('#FF6B6B');
    setType('expense');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tambah Kategori</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Kategori</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Transportasi"
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tipe</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className={`h-12 ${
                  type === 'income' ? 'bg-mint hover:bg-mint/90' : ''
                }`}
                onClick={() => setType('income')}
              >
                Pemasukan
              </Button>
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className={`h-12 ${
                  type === 'expense' ? 'bg-coral hover:bg-coral/90' : ''
                }`}
                onClick={() => setType('expense')}
              >
                Pengeluaran
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Pilih Ikon</label>
            <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto">
              {categoryIcons.map((iconName) => {
                const Icon = getIconComponent(iconName);
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedIcon === iconName
                        ? 'border-teal bg-teal/10'
                        : 'border-gray-200 hover:border-teal/50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mx-auto ${
                        selectedIcon === iconName ? 'text-teal' : 'text-warmGray'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Pilih Warna</label>
            <div className="grid grid-cols-6 gap-3">
              {categoryColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-charcoal scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
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
            Tambah Kategori
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
