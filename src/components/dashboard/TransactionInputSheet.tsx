import { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getIconComponent, formatCurrency } from '@/lib/finance-utils';
import { TransactionType, Transaction } from '@/types/finance';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

interface TransactionInputSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Transaction | null;
}

export const TransactionInputSheet = ({ open, onOpenChange, initialData }: TransactionInputSheetProps) => {
  const { categories, wallets, addTransaction, editTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setSelectedWalletId(initialData.walletId);
      setSelectedCategoryId(initialData.categoryId);
      setNote(initialData.note || '');
      setDate(new Date(initialData.date));
    } else {
      // Reset defaults when opening new
      if (open) {
        setType('expense');
        setAmount('');
        setSelectedWalletId('');
        setSelectedCategoryId('');
        setNote('');
        setDate(new Date());
      }
    }
  }, [initialData, open]);


  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }

    if (!selectedWalletId) {
      toast.error('Pilih dompet');
      return;
    }

    if (!selectedCategoryId) {
      toast.error('Pilih kategori');
      return;
    }

    const wallet = wallets.find((w) => w.id === selectedWalletId);
    if (type === 'expense' && wallet && wallet.balance < amountNum) {
      toast.error('Saldo tidak cukup');
      return;
    }

    if (initialData) {
      editTransaction(initialData.id, {
        type,
        amount: amountNum,
        walletId: selectedWalletId,
        categoryId: selectedCategoryId,
        note: note || undefined,
        date: date.toISOString(),
      });
      toast.success('Transaksi berhasil diperbarui');
    } else {
      addTransaction({
        type,
        amount: amountNum,
        walletId: selectedWalletId,
        categoryId: selectedCategoryId,
        note: note || undefined,
        date: date.toISOString(),
      });
      toast.success(`Transaksi ${type === 'income' ? 'pemasukan' : 'pengeluaran'} berhasil ditambahkan`);
    }

    // Reset form and close
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            {initialData ? 'Edit Transaksi' : 'Transaksi Baru'}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-24 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Transaction Type Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className={`h-14 text-base font-semibold ${
                type === 'income'
                  ? 'bg-mint hover:bg-mint/90 text-white'
                  : 'border-2 hover:bg-mint/10'
              }`}
              onClick={() => {
                setType('income');
                setSelectedCategoryId('');
              }}
            >
              Pemasukan
            </Button>
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className={`h-14 text-base font-semibold ${
                type === 'expense'
                  ? 'bg-coral hover:bg-coral/90 text-white'
                  : 'border-2 hover:bg-coral/10'
              }`}
              onClick={() => {
                setType('expense');
                setSelectedCategoryId('');
              }}
            >
              Pengeluaran
            </Button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">Jumlah</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono font-bold text-warmGray">
                Rp
              </span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="h-16 pl-16 text-2xl font-mono font-bold text-right"
              />
            </div>
            {amount && (
              <p className="text-sm text-warmGray mt-2 text-right">
                {formatCurrency(parseFloat(amount) || 0)}
              </p>
            )}
          </div>

          {/* Wallet Selection */}
          <div>
            <label className="block text-sm font-semibold mb-3">Dompet</label>
            <div className="grid grid-cols-3 gap-3">
              {wallets.map((wallet) => {
                const Icon = getIconComponent(wallet.icon);
                return (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => setSelectedWalletId(wallet.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedWalletId === wallet.id
                        ? 'border-teal bg-teal/10'
                        : 'border-gray-200 hover:border-teal/50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      selectedWalletId === wallet.id ? 'text-teal' : 'text-warmGray'
                    }`} />
                    <p className="text-xs font-medium truncate">{wallet.name}</p>
                    <p className="text-xs text-warmGray font-mono mt-1">
                      {formatCurrency(wallet.balance).replace('Rp', '').replace(/\s/g, '')}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold mb-3">Kategori</label>
            <div className="grid grid-cols-4 gap-3">
              {filteredCategories.map((category) => {
                const Icon = getIconComponent(category.icon);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedCategoryId === category.id
                        ? type === 'income'
                          ? 'border-mint bg-mint/10'
                          : 'border-coral bg-coral/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-1 ${
                        selectedCategoryId === category.id
                          ? type === 'income'
                            ? 'text-mint'
                            : 'text-coral'
                          : 'text-warmGray'
                      }`}
                    />
                    <p className="text-xs font-medium truncate">{category.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold mb-2">Tanggal</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP', { locale: id })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold mb-2">Catatan (Opsional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tambahkan catatan..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
          <Button
            onClick={handleSubmit}
            className={`w-full h-14 text-base font-semibold ${
              type === 'income'
                ? 'bg-mint hover:bg-mint/90'
                : 'bg-coral hover:bg-coral/90'
            }`}
          >
            {initialData ? 'Simpan Perubahan' : 'Simpan Transaksi'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
