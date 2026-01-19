import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { DetailScreen } from '@/screens/DetailScreen';
import { TransferScreen } from '@/screens/TransferScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

function Home() {
  const [activeTab, setActiveTab] = useState('keuangan');

  const renderScreen = () => {
    switch (activeTab) {
      case 'keuangan':
        return <DashboardScreen />;
      case 'detail':
        return <DetailScreen />;
      case 'transfer':
        return <TransferScreen />;
      case 'atur':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-cream bg-grain">
      <div className="max-w-lg mx-auto min-h-screen bg-cream relative">
        {renderScreen()}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default Home;
