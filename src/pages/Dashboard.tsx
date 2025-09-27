import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { 
  Flame, 
  Target, 
  Calendar, 
  Trophy, 
  Play, 
  Wind,
  ChevronRight,
  User
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Welcome{user ? `, ${user.email?.split('@')[0]}` : ' to AsanoGa'}
              </h1>
              <p className="text-primary-foreground/80 text-sm">Ready for your practice?</p>
            </div>
          </div>
          {user && (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-primary-foreground hover:bg-primary-foreground/20">
              Sign Out
            </Button>
          )}
        </div>

        {/* Streak Counter */}
        <Card className="bg-primary-foreground/10 border-primary-foreground/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-semibold">7-day streak</p>
                  <p className="text-sm text-primary-foreground/80">Keep it going!</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Today's Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Today's Recommended Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Morning Flow - Beginner</h3>
                  <p className="text-sm text-muted-foreground">15 minutes • Sun Salutations & Gentle Stretches</p>
                </div>
                <Button size="sm" asChild>
                  <Link to="/practice" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start
                  </Link>
                </Button>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground">0/8 poses completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/roadmap")}>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Learning Path</h3>
              <p className="text-xs text-muted-foreground">Continue your journey</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/asanas")}>
            <CardContent className="p-4 text-center">
              <Wind className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Breathing</h3>
              <p className="text-xs text-muted-foreground">Pranayama exercises</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Level 1: Beginner</span>
              <span className="text-sm text-muted-foreground">350/500 XP</span>
            </div>
            <Progress value={70} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>7 sessions this week</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Flame className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Week Warrior</p>
                  <p className="text-xs text-muted-foreground">Complete 7 sessions in a week</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">First Steps</p>
                  <p className="text-xs text-muted-foreground">Complete your first yoga session</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!user && (
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm mb-3">Sign up to save your progress and unlock all features!</p>
              <Button asChild variant="outline">
                <a href="/auth">Create Account</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Navigation />
    </div>
  );
}