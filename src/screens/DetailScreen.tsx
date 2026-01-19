import { WalletList } from '@/components/detail/WalletList';
import { TransactionHistory } from '@/components/detail/TransactionHistory';

export const DetailScreen = () => {
  return (
    <div className="pb-20">
      <div className="px-6 pt-6 mb-6">
        <h1 className="text-2xl font-bold">Detail Keuangan</h1>
        <p className="text-warmGray mt-1">Lihat dompet dan riwayat transaksi</p>
      </div>
      
      <WalletList />
      <TransactionHistory />
    </div>
  );
};
