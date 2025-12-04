import { useEffect, useState } from 'react';
import { Plus, Trash2, Coffee, Sandwich, UtensilsCrossed } from 'lucide-react';
import { storage, type FoodLog } from '../lib/storage';

export function FoodTracking() {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    food_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    meal_type: 'breakfast' as const,
  });

  useEffect(() => {
    loadFoodLogs();
  }, []);

  const loadFoodLogs = () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDate = today.toISOString().split('T')[0];

      const allLogs = storage.getFoodLogs();
      const todayLogs = allLogs.filter(log => log.logged_at.startsWith(todayDate));
      setFoodLogs(todayLogs.reverse());
    } catch (error) {
      console.error('Error loading food logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const now = new Date();
      storage.addFoodLog({
        food_name: formData.food_name,
        calories: parseInt(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fats: parseFloat(formData.fats) || 0,
        meal_type: formData.meal_type,
        logged_at: now.toISOString(),
        created_at: now.toISOString(),
      });

      setFormData({
        food_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        meal_type: 'breakfast',
      });
      setShowAddForm(false);
      loadFoodLogs();
    } catch (error) {
      console.error('Error adding food log:', error);
    }
  };

  const handleDelete = (id: string) => {
    try {
      storage.deleteFoodLog(id);
      loadFoodLogs();
    } catch (error) {
      console.error('Error deleting food log:', error);
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="w-5 h-5" />;
      case 'lunch':
        return <Sandwich className="w-5 h-5" />;
      case 'dinner':
        return <UtensilsCrossed className="w-5 h-5" />;
      default:
        return <Coffee className="w-5 h-5" />;
    }
  };

  const totalCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = foodLogs.reduce((sum, log) => sum + Number(log.protein), 0);
  const totalCarbs = foodLogs.reduce((sum, log) => sum + Number(log.carbs), 0);
  const totalFats = foodLogs.reduce((sum, log) => sum + Number(log.fats), 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Food Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your daily nutrition intake</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Food
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-white/80 text-sm mb-1">Total Calories</p>
          <p className="text-4xl font-bold">{totalCalories}</p>
          <p className="text-white/80 text-sm mt-1">kcal</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-white/80 text-sm mb-1">Protein</p>
          <p className="text-4xl font-bold">{totalProtein.toFixed(1)}</p>
          <p className="text-white/80 text-sm mt-1">grams</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-white/80 text-sm mb-1">Carbs</p>
          <p className="text-4xl font-bold">{totalCarbs.toFixed(1)}</p>
          <p className="text-white/80 text-sm mt-1">grams</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-white/80 text-sm mb-1">Fats</p>
          <p className="text-4xl font-bold">{totalFats.toFixed(1)}</p>
          <p className="text-white/80 text-sm mt-1">grams</p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Food Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                <input
                  type="text"
                  value={formData.food_name}
                  onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                <select
                  value={formData.meal_type}
                  onChange={(e) => setFormData({ ...formData, meal_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fats}
                  onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition"
              >
                Add Food
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Meals</h2>
        <div className="space-y-3">
          {foodLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No food entries for today. Add your first meal!</p>
          ) : (
            foodLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    {getMealIcon(log.meal_type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{log.food_name}</p>
                    <p className="text-sm text-gray-600 capitalize">{log.meal_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{log.calories} kcal</p>
                    <p className="text-xs text-gray-500">
                      P: {log.protein}g • C: {log.carbs}g • F: {log.fats}g
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
