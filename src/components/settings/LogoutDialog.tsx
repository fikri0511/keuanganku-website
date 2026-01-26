import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut } from 'lucide-react';

export const LogoutDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <LogOut className="w-6 h-6 text-coral" />
            <AlertDialogTitle className="text-2xl font-bold text-coral">
              Keluar dari Aplikasi?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-2">
            <p>
              Apakah Anda yakin ingin keluar dari aplikasi KeuanganKu?
            </p>
            <p className="text-sm text-warmGray">
              Anda dapat login kembali kapan saja menggunakan email dan password Anda.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel} className="h-12">
            Batal
          </Button>
          <Button
            onClick={handleLogout}
            className="h-12 bg-coral hover:bg-coral/90 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Ya, Keluar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
