import { Wallet, ListChecks, ArrowLeftRight, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'keuangan', label: 'Keuangan', icon: Wallet },
  { id: 'detail', label: 'Detail', icon: ListChecks },
  { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { id: 'atur', label: 'Atur', icon: Settings },
];

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] z-50">
      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center py-3 px-2 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-teal/10 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <Icon
                    className={`w-6 h-6 mb-1 transition-colors ${
                      isActive ? 'text-teal' : 'text-warmGray'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isActive ? 'text-teal' : 'text-warmGray'
                    }`}
                  >
                    {tab.label}
                  </span>
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
