import { useEffect, useState } from 'react';
import { Plus, Droplet, Trash2, GlassWater } from 'lucide-react';
import { storage, type WaterLog } from '../lib/storage';

export function WaterTracking() {
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [quickAmount, setQuickAmount] = useState(250);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDate = today.toISOString().split('T')[0];

      const allLogs = storage.getWaterLogs();
      const todayLogs = allLogs.filter(log => log.logged_at.startsWith(todayDate));
      setWaterLogs(todayLogs.reverse());

      const goals = storage.getDailyGoals();
      setWaterGoal(goals.water_goal_ml);
    } catch (error) {
      console.error('Error loading water data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWater = (amount: number) => {
    try {
      const now = new Date();
      storage.addWaterLog({
        amount_ml: amount,
        logged_at: now.toISOString(),
        created_at: now.toISOString(),
      });
      loadWaterData();
    } catch (error) {
      console.error('Error adding water:', error);
    }
  };

  const deleteWaterLog = (id: string) => {
    try {
      storage.deleteWaterLog(id);
      loadWaterData();
    } catch (error) {
      console.error('Error deleting water log:', error);
    }
  };

  const totalWater = waterLogs.reduce((sum, log) => sum + log.amount_ml, 0);
  const percentage = Math.min(Math.round((totalWater / waterGoal) * 100), 100);

  const quickAmounts = [250, 500, 750, 1000];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Water Tracking</h1>
        <p className="text-gray-600 mt-1">Stay hydrated throughout the day</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm mb-1">Today's Water Intake</p>
            <h2 className="text-5xl font-bold">{totalWater}</h2>
            <p className="text-white/80 mt-1">ml / {waterGoal} ml</p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <Droplet className="w-16 h-16" />
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-4 mb-2">
          <div
            className="bg-white h-4 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-white/90 text-sm">{percentage}% of daily goal</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Add</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 transition-all group"
            >
              <GlassWater className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-bold text-blue-600">{amount}</p>
              <p className="text-sm text-gray-600">ml</p>
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <input
            type="number"
            value={quickAmount}
            onChange={(e) => setQuickAmount(Number(e.target.value))}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Custom amount (ml)"
            min="1"
          />
          <button
            onClick={() => addWater(quickAmount)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Log</h2>
        <div className="space-y-3">
          {waterLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No water logged today. Start tracking your hydration!</p>
          ) : (
            waterLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-xl text-white">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{log.amount_ml} ml</p>
                    <p className="text-sm text-gray-600">
                      {new Date(log.logged_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteWaterLog(log.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-blue-100">
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Glasses (250ml)</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{Math.floor(totalWater / 250)}</p>
          <p className="text-xs text-gray-500 mt-1">Approximately</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-cyan-100">
              <GlassWater className="w-5 h-5 text-cyan-600" />
            </div>
            <p className="text-sm text-gray-600">Bottles (500ml)</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{(totalWater / 500).toFixed(1)}</p>
          <p className="text-xs text-gray-500 mt-1">Approximately</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-teal-100">
              <Droplet className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-sm text-gray-600">Remaining</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{Math.max(0, waterGoal - totalWater)}</p>
          <p className="text-xs text-gray-500 mt-1">ml to reach goal</p>
        </div>
      </div>
    </div>
  );
}
