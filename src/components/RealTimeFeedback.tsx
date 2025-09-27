import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Target } from 'lucide-react';
import { PoseAnalysis, FeedbackItem } from '@/utils/poseClassifier';

interface RealTimeFeedbackProps {
  analysis: PoseAnalysis | null;
  isDetecting: boolean;
  className?: string;
}

export function RealTimeFeedback({ analysis, isDetecting, className }: RealTimeFeedbackProps) {
  if (!isDetecting) {
    return (
      <Card className={`bg-muted/50 border-dashed ${className}`}>
        <CardContent className="p-4 text-center">
          <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Start pose detection to receive feedback
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className={`bg-muted/50 ${className}`}>
        <CardContent className="p-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Analyzing pose...
          </p>
        </CardContent>
      </Card>
    );
  }

  const { pose, overallScore, feedback } = analysis;
  const scorePercentage = Math.round(overallScore * 100);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Pose Info Card */}
      <Card className="bg-card/95 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{pose.name}</h3>
              <p className="text-sm text-muted-foreground">{pose.sanskritName}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {pose.difficulty}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Accuracy</span>
              <span className={`text-sm font-bold ${getScoreColor(overallScore)}`}>
                {scorePercentage}%
              </span>
            </div>
            <Progress 
              value={scorePercentage} 
              className="h-2"
              style={{
                background: `linear-gradient(to right, ${getProgressColor(overallScore)} 0%, ${getProgressColor(overallScore)} ${scorePercentage}%, rgb(228, 228, 231) ${scorePercentage}%)`
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feedback Cards */}
      {feedback.length > 0 && (
        <div className="space-y-2">
          {feedback.slice(0, 3).map((item, index) => (
            <FeedbackCard key={index} feedback={item} />
          ))}
          {feedback.length > 3 && (
            <Card className="bg-muted/50">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  +{feedback.length - 3} more feedback items
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Success State */}
      {feedback.length === 0 && overallScore > 0.8 && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Excellent form! You're performing the pose correctly.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface FeedbackCardProps {
  feedback: FeedbackItem;
}

function FeedbackCard({ feedback }: FeedbackCardProps) {
  const getIcon = () => {
    switch (feedback.severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (feedback.severity) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <Alert className={`${getBorderColor()} p-3`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {feedback.bodyPart}
            </Badge>
          </div>
          <p className="text-sm font-medium">{feedback.message}</p>
          <p className="text-xs text-muted-foreground">{feedback.correction}</p>
        </div>
      </div>
    </Alert>
  );
}