import { useEffect, useState } from 'react';
import { Plus, Heart, Activity, Scale, Moon, Footprints } from 'lucide-react';
import { storage, type HealthMetric } from '../lib/storage';

export function HealthMetrics() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    weight: '',
    height: '',
    sleep_hours: '',
    steps: '',
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    try {
      const allMetrics = storage.getHealthMetrics();
      setMetrics(allMetrics.reverse().slice(0, 10));
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const now = new Date();
      storage.addHealthMetric({
        heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
        blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : null,
        steps: formData.steps ? parseInt(formData.steps) : 0,
        logged_at: now.toISOString(),
        created_at: now.toISOString(),
      });

      setFormData({
        heart_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        weight: '',
        height: '',
        sleep_hours: '',
        steps: '',
      });
      setShowAddForm(false);
      loadMetrics();
    } catch (error) {
      console.error('Error adding metric:', error);
    }
  };

  const latestMetric = metrics[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600 mt-1">Track your vital health indicators</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Log Metrics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-6 h-6" />
            <p className="text-white/80 text-sm">Heart Rate</p>
          </div>
          <p className="text-4xl font-bold">{latestMetric?.heart_rate || '--'}</p>
          <p className="text-white/80 text-sm mt-1">bpm</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6" />
            <p className="text-white/80 text-sm">Blood Pressure</p>
          </div>
          <p className="text-4xl font-bold">
            {latestMetric?.blood_pressure_systolic && latestMetric?.blood_pressure_diastolic
              ? `${latestMetric.blood_pressure_systolic}/${latestMetric.blood_pressure_diastolic}`
              : '--/--'}
          </p>
          <p className="text-white/80 text-sm mt-1">mmHg</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-6 h-6" />
            <p className="text-white/80 text-sm">Weight</p>
          </div>
          <p className="text-4xl font-bold">{latestMetric?.weight || '--'}</p>
          <p className="text-white/80 text-sm mt-1">kg</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-6 h-6" />
            <p className="text-white/80 text-sm">Sleep</p>
          </div>
          <p className="text-4xl font-bold">{latestMetric?.sleep_hours || '--'}</p>
          <p className="text-white/80 text-sm mt-1">hours</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Footprints className="w-6 h-6" />
            <p className="text-white/80 text-sm">Steps Today</p>
          </div>
          <p className="text-4xl font-bold">{latestMetric?.steps || 0}</p>
          <p className="text-white/80 text-sm mt-1">steps</p>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-green-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6" />
            <p className="text-white/80 text-sm">Height</p>
          </div>
          <p className="text-4xl font-bold">{latestMetric?.height || '--'}</p>
          <p className="text-white/80 text-sm mt-1">cm</p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Log Health Metrics</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={formData.heart_rate}
                  onChange={(e) => setFormData({ ...formData, heart_rate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={formData.blood_pressure_systolic}
                  onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={formData.blood_pressure_diastolic}
                  onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="80"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="70.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="7.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
              <input
                type="number"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                placeholder="8000"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition"
              >
                Save Metrics
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Entries</h2>
        <div className="space-y-3">
          {metrics.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No health metrics recorded yet. Log your first entry!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heart Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sleep</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Steps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metrics.map((metric) => (
                    <tr key={metric.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(metric.logged_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{metric.heart_rate || '--'} bpm</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {metric.blood_pressure_systolic && metric.blood_pressure_diastolic
                          ? `${metric.blood_pressure_systolic}/${metric.blood_pressure_diastolic}`
                          : '--'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{metric.weight || '--'} kg</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{metric.sleep_hours || '--'} h</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{metric.steps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
