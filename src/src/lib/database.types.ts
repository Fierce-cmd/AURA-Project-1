export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      food_logs: {
        Row: {
          id: string
          user_id: string
          food_name: string
          calories: number
          protein: number
          carbs: number
          fats: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_name: string
          calories?: number
          protein?: number
          carbs?: number
          fats?: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_name?: string
          calories?: number
          protein?: number
          carbs?: number
          fats?: number
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          logged_at?: string
          created_at?: string
        }
      }
      water_logs: {
        Row: {
          id: string
          user_id: string
          amount_ml: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_ml?: number
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount_ml?: number
          logged_at?: string
          created_at?: string
        }
      }
      health_metrics: {
        Row: {
          id: string
          user_id: string
          heart_rate: number | null
          blood_pressure_systolic: number | null
          blood_pressure_diastolic: number | null
          weight: number | null
          height: number | null
          sleep_hours: number | null
          steps: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          heart_rate?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          weight?: number | null
          height?: number | null
          sleep_hours?: number | null
          steps?: number
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          heart_rate?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          weight?: number | null
          height?: number | null
          sleep_hours?: number | null
          steps?: number
          logged_at?: string
          created_at?: string
        }
      }
      wellness_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          nutrition_score: number
          hydration_score: number
          fitness_score: number
          sleep_score: number
          calculated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score?: number
          nutrition_score?: number
          hydration_score?: number
          fitness_score?: number
          sleep_score?: number
          calculated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          nutrition_score?: number
          hydration_score?: number
          fitness_score?: number
          sleep_score?: number
          calculated_at?: string
          created_at?: string
        }
      }
      daily_goals: {
        Row: {
          id: string
          user_id: string
          calorie_goal: number
          water_goal_ml: number
          steps_goal: number
          sleep_goal_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          calorie_goal?: number
          water_goal_ml?: number
          steps_goal?: number
          sleep_goal_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          calorie_goal?: number
          water_goal_ml?: number
          steps_goal?: number
          sleep_goal_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
