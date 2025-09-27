import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Flower, Play, Users, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { InstallPrompt } from "@/components/InstallPrompt";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center relative shadow-lg">
              <Flower className="h-8 w-8 text-primary-foreground" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">AsanoGa</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI-powered yoga practice with real-time pose detection and personalized guidance
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto transition-transform hover:scale-110 shadow-sm">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Real-time Pose Detection</p>
          </div>
          <div className="space-y-2 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto transition-transform hover:scale-110 shadow-sm">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Gamified Learning</p>
          </div>
          <div className="space-y-2 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 bg-secondary/60 rounded-lg flex items-center justify-center mx-auto transition-transform hover:scale-110 shadow-sm">
              <Users className="h-6 w-6 text-secondary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Community Challenges</p>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="animate-slide-up shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-center text-lg">Begin Your Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-md hover:shadow-lg" size="lg">
              <Link to="/auth">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-primary/30 hover:bg-primary/5">
              <Link to="/dashboard">Continue as Guest</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Transform your yoga practice with AI-guided precision
        </p>
      </div>
      
      <InstallPrompt />
    </div>
  );
}