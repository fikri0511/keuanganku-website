import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddWalletDialog } from '@/components/settings/AddWalletDialog';
import { AddCategoryDialog } from '@/components/settings/AddCategoryDialog';
import { ResetDataDialog } from '@/components/settings/ResetDataDialog';
import { Plus, Wallet2, Tag, Trash2 } from 'lucide-react';

export const SettingsScreen = () => {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  return (
    <div className="pb-20 pt-6 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-warmGray mt-1">Kelola dompet, kategori, dan data</p>
      </div>

      <div className="space-y-6">
        {/* Wallet Management */}
        <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center">
                <Wallet2 className="w-5 h-5 text-teal" />
              </div>
              <h2 className="text-lg font-bold">Dompet</h2>
            </div>
            <p className="text-sm text-warmGray">
              Tambahkan dan kelola dompet Anda
            </p>
          </div>
          <div className="p-6">
            <Button
              onClick={() => setIsWalletDialogOpen(true)}
              variant="outline"
              className="w-full h-12 border-2 border-dashed border-teal/30 hover:border-teal hover:bg-teal/5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Dompet Baru
            </Button>
          </div>
        </div>

        {/* Category Management */}
        <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center">
                <Tag className="w-5 h-5 text-teal" />
              </div>
              <h2 className="text-lg font-bold">Kategori</h2>
            </div>
            <p className="text-sm text-warmGray">
              Tambahkan kategori kustom untuk transaksi
            </p>
          </div>
          <div className="p-6">
            <Button
              onClick={() => setIsCategoryDialogOpen(true)}
              variant="outline"
              className="w-full h-12 border-2 border-dashed border-teal/30 hover:border-teal hover:bg-teal/5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Kategori Baru
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-coral/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-coral" />
              </div>
              <h2 className="text-lg font-bold">Data</h2>
            </div>
            <p className="text-sm text-warmGray">
              Reset semua data ke pengaturan awal
            </p>
          </div>
          <div className="p-6">
            <Button
              onClick={() => setIsResetDialogOpen(true)}
              variant="outline"
              className="w-full h-12 border-2 border-coral/30 text-coral hover:border-coral hover:bg-coral/5"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Reset Semua Data
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <p className="text-sm text-warmGray">KeuanganKu v1.0</p>
          <p className="text-xs text-warmGray/70 mt-1">
            Personal Finance Tracker
          </p>
        </div>
      </div>

      <AddWalletDialog
        open={isWalletDialogOpen}
        onOpenChange={setIsWalletDialogOpen}
      />
      <AddCategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      />
      <ResetDataDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
      />
    </div>
  );
};
