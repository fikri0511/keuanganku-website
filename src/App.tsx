import { useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { DetailScreen } from '@/screens/DetailScreen';
import { TransferScreen } from '@/screens/TransferScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { ReportsScreen } from '@/screens/ReportsScreen';
import { AuthScreen } from '@/components/AuthScreen';
import { Toaster } from '@/components/ui/sonner';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Wallet, ArrowRightLeft, Settings, Home, BarChart3 } from 'lucide-react';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-warmCream">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <AuthScreen />
        <Toaster />
      </>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'detail':
        return <DetailScreen />;
      case 'transfer':
        return <TransferScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-warmCream text-charcoal font-sans">
        <main className="max-w-md mx-auto min-h-screen bg-warmCream relative shadow-2xl overflow-hidden">
          {renderScreen()}
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-warmGray/20 px-6 py-3 pb-6 flex justify-between items-center z-50">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-teal' : 'text-warmGray'}`}
            >
              <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-teal/20' : ''}`} />
              <span className="text-[10px] font-medium">Keuangan</span>
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'reports' ? 'text-teal' : 'text-warmGray'}`}
            >
              <BarChart3 className={`w-6 h-6 ${activeTab === 'reports' ? 'fill-teal/20' : ''}`} />
              <span className="text-[10px] font-medium">Laporan</span>
            </button>
            <button 
              onClick={() => setActiveTab('detail')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'detail' ? 'text-teal' : 'text-warmGray'}`}
            >
              <Wallet className={`w-6 h-6 ${activeTab === 'detail' ? 'fill-teal/20' : ''}`} />
              <span className="text-[10px] font-medium">Detail</span>
            </button>
            <button 
              onClick={() => setActiveTab('transfer')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'transfer' ? 'text-teal' : 'text-warmGray'}`}
            >
              <ArrowRightLeft className={`w-6 h-6 ${activeTab === 'transfer' ? 'fill-teal/20' : ''}`} />
              <span className="text-[10px] font-medium">Transfer</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-teal' : 'text-warmGray'}`}
            >
              <Settings className={`w-6 h-6 ${activeTab === 'settings' ? 'fill-teal/20' : ''}`} />
              <span className="text-[10px] font-medium">Atur</span>
            </button>
          </div>
        </main>
        <Toaster />
      </div>
    </FinanceProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
