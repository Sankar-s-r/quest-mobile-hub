import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Flower, Play, Users, Trophy } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Flower className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AsanoGa</h1>
            <p className="text-muted-foreground text-sm">
              AI-powered yoga practice with real-time pose detection and personalized guidance
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Real-time Pose Detection</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Gamified Learning</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-secondary/60 rounded-lg flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-secondary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Community Challenges</p>
          </div>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Begin Your Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">Continue as Guest</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Transform your yoga practice with AI-guided precision
        </p>
      </div>
    </div>
  );
}