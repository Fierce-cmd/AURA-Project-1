/*
  # AURA Health Platform Database Schema

  ## Overview
  This migration creates the complete database structure for AURA (Auto Unified Health & Risk Assistant),
  a digital health companion for tracking wellness metrics.

  ## New Tables

  ### 1. `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `avatar_url` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `food_logs`
  Daily food intake and calorie tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `food_name` (text)
  - `calories` (integer)
  - `protein` (numeric, grams)
  - `carbs` (numeric, grams)
  - `fats` (numeric, grams)
  - `meal_type` (text: breakfast, lunch, dinner, snack)
  - `logged_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 3. `water_logs`
  Daily water consumption tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `amount_ml` (integer, milliliters)
  - `logged_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 4. `health_metrics`
  Comprehensive health tracking (heart rate, blood pressure, weight, etc.)
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `heart_rate` (integer, bpm)
  - `blood_pressure_systolic` (integer, mmHg)
  - `blood_pressure_diastolic` (integer, mmHg)
  - `weight` (numeric, kg)
  - `height` (numeric, cm)
  - `sleep_hours` (numeric)
  - `steps` (integer)
  - `logged_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 5. `wellness_scores`
  AI-calculated overall wellness scores
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `score` (integer, 0-100)
  - `nutrition_score` (integer, 0-100)
  - `hydration_score` (integer, 0-100)
  - `fitness_score` (integer, 0-100)
  - `sleep_score` (integer, 0-100)
  - `calculated_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. `daily_goals`
  User-defined daily health goals
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `calorie_goal` (integer)
  - `water_goal_ml` (integer)
  - `steps_goal` (integer)
  - `sleep_goal_hours` (numeric)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Separate policies for SELECT, INSERT, UPDATE, and DELETE operations
  - All policies require authentication via auth.uid()

  ## Indexes
  - Optimized for common queries by user_id and date ranges
  - Composite indexes on user_id + logged_at/created_at fields
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create food_logs table
CREATE TABLE IF NOT EXISTS food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  food_name text NOT NULL,
  calories integer NOT NULL DEFAULT 0,
  protein numeric(5,2) DEFAULT 0,
  carbs numeric(5,2) DEFAULT 0,
  fats numeric(5,2) DEFAULT 0,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create water_logs table
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml integer NOT NULL DEFAULT 0,
  logged_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  heart_rate integer,
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  weight numeric(5,2),
  height numeric(5,2),
  sleep_hours numeric(4,2),
  steps integer DEFAULT 0,
  logged_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create wellness_scores table
CREATE TABLE IF NOT EXISTS wellness_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  nutrition_score integer DEFAULT 0 CHECK (nutrition_score >= 0 AND nutrition_score <= 100),
  hydration_score integer DEFAULT 0 CHECK (hydration_score >= 0 AND hydration_score <= 100),
  fitness_score integer DEFAULT 0 CHECK (fitness_score >= 0 AND fitness_score <= 100),
  sleep_score integer DEFAULT 0 CHECK (sleep_score >= 0 AND sleep_score <= 100),
  calculated_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create daily_goals table
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  calorie_goal integer DEFAULT 2000,
  water_goal_ml integer DEFAULT 2000,
  steps_goal integer DEFAULT 10000,
  sleep_goal_hours numeric(3,1) DEFAULT 8.0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON health_metrics(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_scores_user_date ON wellness_scores(user_id, calculated_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Food logs policies
CREATE POLICY "Users can view own food logs"
  ON food_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food logs"
  ON food_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs"
  ON food_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own food logs"
  ON food_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Water logs policies
CREATE POLICY "Users can view own water logs"
  ON water_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water logs"
  ON water_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water logs"
  ON water_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own water logs"
  ON water_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Health metrics policies
CREATE POLICY "Users can view own health metrics"
  ON health_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON health_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics"
  ON health_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Wellness scores policies
CREATE POLICY "Users can view own wellness scores"
  ON wellness_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness scores"
  ON wellness_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Daily goals policies
CREATE POLICY "Users can view own daily goals"
  ON daily_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily goals"
  ON daily_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily goals"
  ON daily_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.daily_goals (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for daily_goals updated_at
DROP TRIGGER IF EXISTS update_daily_goals_updated_at ON daily_goals;
CREATE TRIGGER update_daily_goals_updated_at
  BEFORE UPDATE ON daily_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();