import { Activity, Home, Apple, Heart, Droplet } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'food' | 'health' | 'water';
  onNavigate: (view: 'dashboard' | 'food' | 'health' | 'water') => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, icon: Home, label: 'Dashboard' },
    { id: 'food' as const, icon: Apple, label: 'Food Tracking' },
    { id: 'health' as const, icon: Heart, label: 'Health Metrics' },
    { id: 'water' as const, icon: Droplet, label: 'Water Intake' },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-600 to-teal-600 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AURA</h1>
            <p className="text-xs text-white/80">Health Tracker</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20 text-center text-sm text-white/80">
        <p>Your local health companion</p>
        <p className="text-xs mt-1">All data saved locally</p>
      </div>
    </div>
  );
}
