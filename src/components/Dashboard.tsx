import { useEffect, useState } from 'react';
import { Activity, Apple, Droplet, Heart, TrendingUp, Moon, Footprints } from 'lucide-react';
import { storage } from '../lib/storage';

interface DashboardStats {
  todayCalories: number;
  calorieGoal: number;
  todayWater: number;
  waterGoal: number;
  wellnessScore: number;
  todaySteps: number;
  stepsGoal: number;
  lastHeartRate: number | null;
  lastSleepHours: number | null;
  sleepGoal: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayCalories: 0,
    calorieGoal: 2000,
    todayWater: 0,
    waterGoal: 2000,
    wellnessScore: 0,
    todaySteps: 0,
    stepsGoal: 10000,
    lastHeartRate: null,
    lastSleepHours: null,
    sleepGoal: 8,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const goals = storage.getDailyGoals();
      const foodLogs = storage.getFoodLogs();
      const waterLogs = storage.getWaterLogs();
      const healthMetrics = storage.getHealthMetrics();

      const todayFoodLogs = foodLogs.filter(log => log.logged_at.startsWith(today.toISOString().split('T')[0]));
      const todayWaterLogs = waterLogs.filter(log => log.logged_at.startsWith(today.toISOString().split('T')[0]));

      const totalCalories = todayFoodLogs.reduce((sum, log) => sum + log.calories, 0);
      const totalWater = todayWaterLogs.reduce((sum, log) => sum + log.amount_ml, 0);

      const latestHealthMetric = healthMetrics.length > 0 ? healthMetrics[healthMetrics.length - 1] : null;

      const wellnessScore = storage.calculateWellnessScore(
        totalCalories,
        goals.calorie_goal,
        totalWater,
        goals.water_goal_ml,
        latestHealthMetric?.steps || 0,
        goals.steps_goal,
        latestHealthMetric?.sleep_hours || 0,
        goals.sleep_goal_hours
      );

      setStats({
        todayCalories: totalCalories,
        calorieGoal: goals.calorie_goal,
        todayWater: totalWater,
        waterGoal: goals.water_goal_ml,
        wellnessScore: wellnessScore,
        todaySteps: latestHealthMetric?.steps || 0,
        stepsGoal: goals.steps_goal,
        lastHeartRate: latestHealthMetric?.heart_rate || null,
        lastSleepHours: latestHealthMetric?.sleep_hours || null,
        sleepGoal: goals.sleep_goal_hours,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, goal, unit, color }: any) => {
    const percentage = getPercentage(value, goal);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {value}
              <span className="text-sm text-gray-500">/{goal}{unit}</span>
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color.replace('bg-', 'bg-gradient-to-r from-').replace(/\/\d+/, '-400 to-')}${color.split('-')[1]}-600`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{percentage}% of daily goal</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to AURA</h1>
        <p className="text-gray-600 mt-1">Your unified health dashboard</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Overall Wellness Score</p>
            <h2 className="text-5xl font-bold">{stats.wellnessScore}</h2>
            <p className="text-white/80 mt-2">Keep up the great work!</p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <Activity className="w-16 h-16" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={Apple}
          title="Calories"
          value={stats.todayCalories}
          goal={stats.calorieGoal}
          unit=" kcal"
          color="bg-orange-500"
        />
        <StatCard
          icon={Droplet}
          title="Water Intake"
          value={stats.todayWater}
          goal={stats.waterGoal}
          unit=" ml"
          color="bg-blue-500"
        />
        <StatCard
          icon={Footprints}
          title="Steps"
          value={stats.todaySteps}
          goal={stats.stepsGoal}
          unit=""
          color="bg-green-500"
        />
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-red-500">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Heart Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.lastHeartRate || '--'} <span className="text-sm text-gray-500">bpm</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Last recorded measurement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-indigo-500">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sleep</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.lastSleepHours || '--'}
                <span className="text-sm text-gray-500">/{stats.sleepGoal}h</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Last night's sleep duration</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-teal-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weekly Progress</p>
              <p className="text-2xl font-bold text-gray-900">+5%</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Improvement from last week</p>
        </div>
      </div>
    </div>
  );
}
