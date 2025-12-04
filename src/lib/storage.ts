const STORAGE_KEYS = {
  FOOD_LOGS: 'aura_food_logs',
  WATER_LOGS: 'aura_water_logs',
  HEALTH_METRICS: 'aura_health_metrics',
  DAILY_GOALS: 'aura_daily_goals',
  WELLNESS_SCORES: 'aura_wellness_scores',
};

export interface FoodLog {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logged_at: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export interface HealthMetric {
  id: string;
  heart_rate: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  weight: number | null;
  height: number | null;
  sleep_hours: number | null;
  steps: number;
  logged_at: string;
  created_at: string;
}

export interface DailyGoals {
  id: string;
  calorie_goal: number;
  water_goal_ml: number;
  steps_goal: number;
  sleep_goal_hours: number;
}

export interface WellnessScore {
  id: string;
  score: number;
  nutrition_score: number;
  hydration_score: number;
  fitness_score: number;
  sleep_score: number;
  calculated_at: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const getTodayDateString = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
};

export const storage = {
  // Food Logs
  getFoodLogs: (): FoodLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addFoodLog: (log: Omit<FoodLog, 'id'>) => {
    const logs = storage.getFoodLogs();
    const newLog: FoodLog = {
      ...log,
      id: generateId(),
    };
    logs.push(newLog);
    localStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(logs));
    return newLog;
  },

  deleteFoodLog: (id: string) => {
    const logs = storage.getFoodLogs();
    const filtered = logs.filter(log => log.id !== id);
    localStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(filtered));
  },

  // Water Logs
  getWaterLogs: (): WaterLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATER_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addWaterLog: (log: Omit<WaterLog, 'id'>) => {
    const logs = storage.getWaterLogs();
    const newLog: WaterLog = {
      ...log,
      id: generateId(),
    };
    logs.push(newLog);
    localStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(logs));
    return newLog;
  },

  deleteWaterLog: (id: string) => {
    const logs = storage.getWaterLogs();
    const filtered = logs.filter(log => log.id !== id);
    localStorage.setItem(STORAGE_KEYS.WATER_LOGS, JSON.stringify(filtered));
  },

  // Health Metrics
  getHealthMetrics: (): HealthMetric[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HEALTH_METRICS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHealthMetric: (metric: Omit<HealthMetric, 'id'>) => {
    const metrics = storage.getHealthMetrics();
    const newMetric: HealthMetric = {
      ...metric,
      id: generateId(),
    };
    metrics.push(newMetric);
    localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(metrics));
    return newMetric;
  },

  deleteHealthMetric: (id: string) => {
    const metrics = storage.getHealthMetrics();
    const filtered = metrics.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(filtered));
  },

  // Daily Goals
  getDailyGoals: (): DailyGoals => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_GOALS);
      return data ? JSON.parse(data) : {
        id: generateId(),
        calorie_goal: 2000,
        water_goal_ml: 2000,
        steps_goal: 10000,
        sleep_goal_hours: 8,
      };
    } catch {
      return {
        id: generateId(),
        calorie_goal: 2000,
        water_goal_ml: 2000,
        steps_goal: 10000,
        sleep_goal_hours: 8,
      };
    }
  },

  setDailyGoals: (goals: DailyGoals) => {
    localStorage.setItem(STORAGE_KEYS.DAILY_GOALS, JSON.stringify(goals));
  },

  // Wellness Scores
  getWellnessScores: (): WellnessScore[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WELLNESS_SCORES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addWellnessScore: (score: Omit<WellnessScore, 'id'>) => {
    const scores = storage.getWellnessScores();
    const newScore: WellnessScore = {
      ...score,
      id: generateId(),
    };
    scores.push(newScore);
    localStorage.setItem(STORAGE_KEYS.WELLNESS_SCORES, JSON.stringify(scores));
    return newScore;
  },

  calculateWellnessScore: (todayCalories: number, calorieGoal: number, todayWater: number, waterGoal: number, todaySteps: number, stepsGoal: number, sleepHours: number, sleepGoal: number): number => {
    const nutritionScore = Math.min(Math.round((todayCalories / calorieGoal) * 100), 100);
    const hydrationScore = Math.min(Math.round((todayWater / waterGoal) * 100), 100);
    const fitnessScore = Math.min(Math.round((todaySteps / stepsGoal) * 100), 100);
    const sleepScore = Math.min(Math.round((sleepHours / sleepGoal) * 100), 100);

    const overallScore = Math.round((nutritionScore + hydrationScore + fitnessScore + sleepScore) / 4);
    return overallScore;
  },
};
