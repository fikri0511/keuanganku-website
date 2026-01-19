import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, getIconComponent } from '@/lib/finance-utils';
import { ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const TransferForm = () => {
  const { wallets, addTransfer } = useFinance();
  const [sourceWalletId, setSourceWalletId] = useState<string>('');
  const [destinationWalletId, setDestinationWalletId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const sourceWallet = wallets.find((w) => w.id === sourceWalletId);
  const destinationWallet = wallets.find((w) => w.id === destinationWalletId);

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }

    if (!sourceWalletId) {
      toast.error('Pilih dompet sumber');
      return;
    }

    if (!destinationWalletId) {
      toast.error('Pilih dompet tujuan');
      return;
    }

    if (sourceWalletId === destinationWalletId) {
      toast.error('Dompet sumber dan tujuan tidak boleh sama');
      return;
    }

    if (sourceWallet && sourceWallet.balance < amountNum) {
      toast.error('Saldo tidak cukup');
      return;
    }

    addTransfer({
      amount: amountNum,
      sourceWalletId,
      destinationWalletId,
      date: date.toISOString(),
    });

    toast.success('Transfer berhasil');

    // Reset form
    setAmount('');
    setSourceWalletId('');
    setDestinationWalletId('');
    setDate(new Date());
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Transfer Antar Dompet</h1>
        <p className="text-warmGray">Pindahkan uang antar dompet Anda</p>
      </div>

      {/* Wallet Selection */}
      <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 space-y-6">
        {/* Source Wallet */}
        <div>
          <label className="block text-sm font-semibold mb-3">Dari Dompet</label>
          <div className="grid grid-cols-3 gap-3">
            {wallets.map((wallet) => {
              const Icon = getIconComponent(wallet.icon);
              const isDisabled = wallet.id === destinationWalletId;
              
              return (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => !isDisabled && setSourceWalletId(wallet.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    sourceWalletId === wallet.id
                      ? 'border-teal bg-teal/10'
                      : isDisabled
                      ? 'border-gray-200 opacity-40 cursor-not-allowed'
                      : 'border-gray-200 hover:border-teal/50'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      sourceWalletId === wallet.id ? 'text-teal' : 'text-warmGray'
                    }`}
                  />
                  <p className="text-xs font-medium truncate">{wallet.name}</p>
                  <p className="text-xs text-warmGray font-mono mt-1">
                    {formatCurrency(wallet.balance).replace('Rp', '').replace(/\s/g, '')}
                  </p>
                </button>
              );
            })}
          </div>
          {sourceWallet && (
            <p className="text-sm text-warmGray mt-3">
              Saldo: <span className="font-mono font-semibold">{formatCurrency(sourceWallet.balance)}</span>
            </p>
          )}
        </div>

        {/* Arrow Indicator */}
        <div className="flex justify-center">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-6 h-6 text-teal" />
          </motion.div>
        </div>

        {/* Destination Wallet */}
        <div>
          <label className="block text-sm font-semibold mb-3">Ke Dompet</label>
          <div className="grid grid-cols-3 gap-3">
            {wallets.map((wallet) => {
              const Icon = getIconComponent(wallet.icon);
              const isDisabled = wallet.id === sourceWalletId;
              
              return (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => !isDisabled && setDestinationWalletId(wallet.id)}
                  disabled={isDisabled}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    destinationWalletId === wallet.id
                      ? 'border-teal bg-teal/10'
                      : isDisabled
                      ? 'border-gray-200 opacity-40 cursor-not-allowed'
                      : 'border-gray-200 hover:border-teal/50'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      destinationWalletId === wallet.id ? 'text-teal' : 'text-warmGray'
                    }`}
                  />
                  <p className="text-xs font-medium truncate">{wallet.name}</p>
                  <p className="text-xs text-warmGray font-mono mt-1">
                    {formatCurrency(wallet.balance).replace('Rp', '').replace(/\s/g, '')}
                  </p>
                </button>
              );
            })}
          </div>
          {destinationWallet && (
            <p className="text-sm text-warmGray mt-3">
              Saldo: <span className="font-mono font-semibold">{formatCurrency(destinationWallet.balance)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        <label className="block text-sm font-semibold mb-3">Jumlah Transfer</label>
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

      {/* Date Picker */}
      <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        <label className="block text-sm font-semibold mb-3">Tanggal</label>
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

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full h-14 text-base font-semibold bg-teal hover:bg-teal-600"
      >
        Transfer Sekarang
      </Button>
    </div>
  );
};
