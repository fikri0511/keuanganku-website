import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export const ResetDataDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { resetAllData } = useFinance();
  const [confirmStep, setConfirmStep] = useState(0);

  const handleConfirm = () => {
    if (confirmStep === 0) {
      setConfirmStep(1);
    } else {
      resetAllData();
      toast.success('Semua data berhasil direset');
      setConfirmStep(0);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setConfirmStep(0);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-coral">
            {confirmStep === 0 ? 'Reset Semua Data?' : 'Konfirmasi Terakhir'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base space-y-2">
            {confirmStep === 0 ? (
              <>
                <p>
                  Tindakan ini akan menghapus <strong>semua transaksi</strong> dan{' '}
                  <strong>semua transfer</strong> yang pernah Anda buat.
                </p>
                <p>Dompet dan kategori akan dikembalikan ke pengaturan default.</p>
                <p className="text-coral font-semibold">
                  ⚠️ Data yang dihapus tidak dapat dikembalikan!
                </p>
              </>
            ) : (
              <>
                <p className="text-coral font-bold text-lg">
                  Apakah Anda benar-benar yakin?
                </p>
                <p>Ini adalah kesempatan terakhir untuk membatalkan.</p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel} className="h-12">
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            className="h-12 bg-coral hover:bg-coral/90 text-white"
          >
            {confirmStep === 0 ? 'Lanjutkan' : 'Ya, Reset Sekarang'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
