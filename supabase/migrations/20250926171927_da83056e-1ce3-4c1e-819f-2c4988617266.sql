-- AsanoGa Database Schema Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.skill_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.pose_category AS ENUM ('standing', 'seated', 'balancing', 'backbends', 'inversions', 'twists', 'arm_balances', 'core', 'hip_openers', 'restorative');
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- User Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    display_name TEXT,
    skill_level skill_level DEFAULT 'beginner',
    date_of_birth DATE,
    goals TEXT[],
    preferred_practice_duration INTEGER DEFAULT 15, -- in minutes
    reminder_enabled BOOLEAN DEFAULT true,
    reminder_time TIME DEFAULT '08:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Table (security-first approach)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Asanas Library Table
CREATE TABLE public.asanas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sanskrit_name TEXT,
    category pose_category NOT NULL,
    difficulty difficulty_level NOT NULL,
    description TEXT,
    instructions TEXT[],
    benefits TEXT[],
    contraindications TEXT[],
    modifications TEXT[],
    hold_duration INTEGER DEFAULT 30, -- in seconds
    image_url TEXT,
    video_url TEXT,
    cultural_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions Table
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_type TEXT DEFAULT 'practice',
    duration INTEGER NOT NULL, -- in seconds
    poses_completed INTEGER DEFAULT 0,
    accuracy_score DECIMAL(4,2), -- percentage 0-100
    calories_burned INTEGER,
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pose Attempts Table (detailed tracking)
CREATE TABLE public.pose_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.user_sessions(id) ON DELETE CASCADE,
    asana_id UUID NOT NULL REFERENCES public.asanas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    accuracy_score DECIMAL(4,2), -- percentage 0-100
    hold_duration INTEGER, -- actual hold duration in seconds
    feedback_given TEXT[],
    improvements_suggested TEXT[],
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    badge_color TEXT DEFAULT '#E67E22',
    points INTEGER DEFAULT 10,
    category TEXT DEFAULT 'general',
    criteria JSONB, -- flexible criteria storage
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Experience Points Table
CREATE TABLE public.experience_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    points INTEGER NOT NULL,
    source TEXT NOT NULL, -- 'session_complete', 'achievement', 'streak', etc.
    reference_id UUID, -- ID of session, achievement, etc.
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Streaks Table
CREATE TABLE public.user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_practice_date DATE,
    streak_start_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Learning Paths Table
CREATE TABLE public.learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    skill_level skill_level NOT NULL,
    estimated_duration INTEGER, -- in days
    asana_sequence UUID[], -- array of asana IDs
    prerequisites UUID[], -- array of learning path IDs
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    current_asana_index INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, learning_path_id)
);

-- Breathing Exercises Table
CREATE TABLE public.breathing_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sanskrit_name TEXT,
    description TEXT,
    instructions TEXT[],
    duration INTEGER NOT NULL, -- in seconds
    breath_pattern JSONB, -- inhale:hold:exhale ratios
    difficulty difficulty_level DEFAULT 'beginner',
    benefits TEXT[],
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Breathing Sessions Table
CREATE TABLE public.breathing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    exercise_id UUID NOT NULL REFERENCES public.breathing_exercises(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL, -- actual duration in seconds
    completion_rate DECIMAL(4,2), -- percentage completed
    heart_rate_before INTEGER,
    heart_rate_after INTEGER,
    stress_level_before INTEGER, -- 1-10 scale
    stress_level_after INTEGER, -- 1-10 scale
    practiced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pose_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breathing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breathing_sessions ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles (admin only)
CREATE POLICY "Only admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for asanas (public read, admin write)
CREATE POLICY "Everyone can view asanas" ON public.asanas
FOR SELECT USING (true);

CREATE POLICY "Admins can manage asanas" ON public.asanas
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON public.user_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.user_sessions
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for pose attempts
CREATE POLICY "Users can view their own pose attempts" ON public.pose_attempts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pose attempts" ON public.pose_attempts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements (public read, admin write)
CREATE POLICY "Everyone can view achievements" ON public.achievements
FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements" ON public.user_achievements
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for experience points
CREATE POLICY "Users can view their own XP" ON public.experience_points
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn XP" ON public.experience_points
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user streaks
CREATE POLICY "Users can view their own streaks" ON public.user_streaks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON public.user_streaks
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for learning paths (public read, admin write)
CREATE POLICY "Everyone can view learning paths" ON public.learning_paths
FOR SELECT USING (true);

CREATE POLICY "Admins can manage learning paths" ON public.learning_paths
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for breathing exercises (public read, admin write)
CREATE POLICY "Everyone can view breathing exercises" ON public.breathing_exercises
FOR SELECT USING (true);

CREATE POLICY "Admins can manage breathing exercises" ON public.breathing_exercises
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for breathing sessions
CREATE POLICY "Users can view their own breathing sessions" ON public.breathing_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own breathing sessions" ON public.breathing_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add update triggers for tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_asanas_updated_at
  BEFORE UPDATE ON public.asanas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();