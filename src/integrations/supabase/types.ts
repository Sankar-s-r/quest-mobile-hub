export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_color: string | null
          category: string | null
          created_at: string | null
          criteria: Json | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          points: number | null
        }
        Insert: {
          badge_color?: string | null
          category?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points?: number | null
        }
        Update: {
          badge_color?: string | null
          category?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      asanas: {
        Row: {
          benefits: string[] | null
          category: Database["public"]["Enums"]["pose_category"]
          contraindications: string[] | null
          created_at: string | null
          cultural_context: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          hold_duration: number | null
          id: string
          image_url: string | null
          instructions: string[] | null
          modifications: string[] | null
          name: string
          sanskrit_name: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          benefits?: string[] | null
          category: Database["public"]["Enums"]["pose_category"]
          contraindications?: string[] | null
          created_at?: string | null
          cultural_context?: string | null
          description?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          hold_duration?: number | null
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          modifications?: string[] | null
          name: string
          sanskrit_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          benefits?: string[] | null
          category?: Database["public"]["Enums"]["pose_category"]
          contraindications?: string[] | null
          created_at?: string | null
          cultural_context?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          hold_duration?: number | null
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          modifications?: string[] | null
          name?: string
          sanskrit_name?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      breathing_exercises: {
        Row: {
          audio_url: string | null
          benefits: string[] | null
          breath_pattern: Json | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          duration: number
          id: string
          instructions: string[] | null
          name: string
          sanskrit_name: string | null
        }
        Insert: {
          audio_url?: string | null
          benefits?: string[] | null
          breath_pattern?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          duration: number
          id?: string
          instructions?: string[] | null
          name: string
          sanskrit_name?: string | null
        }
        Update: {
          audio_url?: string | null
          benefits?: string[] | null
          breath_pattern?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          duration?: number
          id?: string
          instructions?: string[] | null
          name?: string
          sanskrit_name?: string | null
        }
        Relationships: []
      }
      breathing_sessions: {
        Row: {
          completion_rate: number | null
          duration: number
          exercise_id: string
          heart_rate_after: number | null
          heart_rate_before: number | null
          id: string
          practiced_at: string | null
          stress_level_after: number | null
          stress_level_before: number | null
          user_id: string
        }
        Insert: {
          completion_rate?: number | null
          duration: number
          exercise_id: string
          heart_rate_after?: number | null
          heart_rate_before?: number | null
          id?: string
          practiced_at?: string | null
          stress_level_after?: number | null
          stress_level_before?: number | null
          user_id: string
        }
        Update: {
          completion_rate?: number | null
          duration?: number
          exercise_id?: string
          heart_rate_after?: number | null
          heart_rate_before?: number | null
          id?: string
          practiced_at?: string | null
          stress_level_after?: number | null
          stress_level_before?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breathing_sessions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "breathing_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_points: {
        Row: {
          earned_at: string | null
          id: string
          points: number
          reference_id: string | null
          source: string
          user_id: string
        }
        Insert: {
          earned_at?: string | null
          id?: string
          points: number
          reference_id?: string | null
          source: string
          user_id: string
        }
        Update: {
          earned_at?: string | null
          id?: string
          points?: number
          reference_id?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          asana_sequence: string[] | null
          created_at: string | null
          description: string | null
          estimated_duration: number | null
          id: string
          is_active: boolean | null
          name: string
          prerequisites: string[] | null
          skill_level: Database["public"]["Enums"]["skill_level"]
        }
        Insert: {
          asana_sequence?: string[] | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          prerequisites?: string[] | null
          skill_level: Database["public"]["Enums"]["skill_level"]
        }
        Update: {
          asana_sequence?: string[] | null
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          prerequisites?: string[] | null
          skill_level?: Database["public"]["Enums"]["skill_level"]
        }
        Relationships: []
      }
      pose_attempts: {
        Row: {
          accuracy_score: number | null
          asana_id: string
          attempted_at: string | null
          feedback_given: string[] | null
          hold_duration: number | null
          id: string
          improvements_suggested: string[] | null
          session_id: string
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          asana_id: string
          attempted_at?: string | null
          feedback_given?: string[] | null
          hold_duration?: number | null
          id?: string
          improvements_suggested?: string[] | null
          session_id: string
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          asana_id?: string
          attempted_at?: string | null
          feedback_given?: string[] | null
          hold_duration?: number | null
          id?: string
          improvements_suggested?: string[] | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pose_attempts_asana_id_fkey"
            columns: ["asana_id"]
            isOneToOne: false
            referencedRelation: "asanas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pose_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          goals: string[] | null
          id: string
          preferred_practice_duration: number | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          goals?: string[] | null
          id?: string
          preferred_practice_duration?: number | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          goals?: string[] | null
          id?: string
          preferred_practice_duration?: number | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          current_asana_index: number | null
          id: string
          last_accessed: string | null
          learning_path_id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          current_asana_index?: number | null
          id?: string
          last_accessed?: string | null
          learning_path_id: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          current_asana_index?: number | null
          id?: string
          last_accessed?: string | null
          learning_path_id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          accuracy_score: number | null
          calories_burned: number | null
          completed_at: string | null
          created_at: string | null
          duration: number
          id: string
          notes: string | null
          poses_completed: number | null
          session_type: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration: number
          id?: string
          notes?: string | null
          poses_completed?: number | null
          session_type?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration?: number
          id?: string
          notes?: string | null
          poses_completed?: number | null
          session_type?: string | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          current_streak: number | null
          id: string
          last_practice_date: string | null
          longest_streak: number | null
          streak_start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          id?: string
          last_practice_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          id?: string
          last_practice_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      pose_category:
        | "standing"
        | "seated"
        | "balancing"
        | "backbends"
        | "inversions"
        | "twists"
        | "arm_balances"
        | "core"
        | "hip_openers"
        | "restorative"
      skill_level: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      difficulty_level: ["beginner", "intermediate", "advanced"],
      pose_category: [
        "standing",
        "seated",
        "balancing",
        "backbends",
        "inversions",
        "twists",
        "arm_balances",
        "core",
        "hip_openers",
        "restorative",
      ],
      skill_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
