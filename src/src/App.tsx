import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FoodTracking } from './components/FoodTracking';
import { HealthMetrics } from './components/HealthMetrics';
import { WaterTracking } from './components/WaterTracking';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'food' | 'health' | 'water'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="ml-64 p-8">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'food' && <FoodTracking />}
        {activeView === 'health' && <HealthMetrics />}
        {activeView === 'water' && <WaterTracking />}
      </main>
    </div>
  );
}

export default App;
