import { Eye, Globe, Shield, User } from 'lucide-react';

export type UserDashboardTab = 'profile' | 'security' | 'privacy' | 'integrations';

interface UserDashboardTabsNavProps {
  activeTab: UserDashboardTab;
  onTabChange: (tab: UserDashboardTab) => void;
}

const tabs: Array<{ id: UserDashboardTab; label: string; icon: typeof User }> = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'privacy', label: 'Privacidad', icon: Eye },
  { id: 'integrations', label: 'Integraciones', icon: Globe },
];

export function UserDashboardTabsNav({ activeTab, onTabChange }: UserDashboardTabsNavProps) {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-2 lg:mb-8 lg:backdrop-blur-lg">
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
              activeTab === id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
