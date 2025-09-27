import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Camera, Square, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { PoseClassifier } from '@/utils/poseClassifier';
import { PoseVisualization } from '@/components/PoseVisualization';
import { RealTimeFeedback } from '@/components/RealTimeFeedback';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

export default function PracticeSession() {
  const { toast } = useToast();
  const { videoRef, permissions, isLoading, requestCameraAccess, stopCamera } = useCamera();
  const { currentPose, isInitialized, isDetecting, startDetection, stopDetection } = usePoseDetection(
    videoRef.current,
    {
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    }
  );

  const [poseClassifier] = useState(() => new PoseClassifier());
  const [analysis, setAnalysis] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const intervalRef = useRef(null);

  // Session timer
  useEffect(() => {
    if (isSessionActive) {
      intervalRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSessionActive]);

  // Analyze poses in real-time
  useEffect(() => {
    if (currentPose && currentPose.landmarks) {
      const poseAnalysis = poseClassifier.classifyPose(currentPose.landmarks);
      setAnalysis(poseAnalysis);
    } else {
      setAnalysis(null);
    }
  }, [currentPose, poseClassifier]);

  const handleStartSession = async () => {
    try {
      if (!permissions.granted) {
        await requestCameraAccess();
        return;
      }

      await startDetection();
      setIsSessionActive(true);
      setCalibrationStep(0);
      
      toast({
        title: "Session Started",
        description: "Position yourself in the camera view and begin your practice",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start practice session",
        variant: "destructive",
      });
    }
  };

  const handleStopSession = async () => {
    await stopDetection();
    setIsSessionActive(false);
    setSessionTime(0);
    
    toast({
      title: "Session Ended",
      description: `Practice completed! Duration: ${Math.floor(sessionTime / 60)}:${(sessionTime % 60).toString().padStart(2, '0')}`,
    });
  };

  const handleCalibration = () => {
    if (calibrationStep < 3) {
      setCalibrationStep(prev => prev + 1);
      
      const steps = [
        "Stand straight with arms at your sides",
        "Raise your arms overhead",
        "Step into your practice space",
        "Calibration complete!"
      ];
      
      toast({
        title: `Calibration Step ${calibrationStep + 1}`,
        description: steps[calibrationStep],
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permissions.granted && !isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                AsanoGa needs camera access to detect your poses and provide real-time feedback.
              </p>
              
              {permissions.denied && (
                <Alert>
                  <AlertDescription>
                    Camera access was denied. Please enable camera permissions in your browser settings and try again.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={requestCameraAccess} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Requesting Access...' : 'Enable Camera'}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Practice Session</h1>
            <p className="text-sm text-muted-foreground">
              Real-time pose detection and feedback
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isSessionActive && (
              <div className="text-right">
                <div className="text-lg font-mono font-bold">{formatTime(sessionTime)}</div>
                <div className="text-xs text-muted-foreground">Session Time</div>
              </div>
            )}
            
            <div className="flex gap-2">
              {!isSessionActive ? (
                <Button onClick={handleStartSession} disabled={isLoading}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Practice
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCalibration}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" onClick={handleStopSession}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden bg-black">
            <CardContent className="p-0 relative">
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Pose Overlay */}
                {currentPose && currentPose.landmarks && (
                  <PoseVisualization
                    videoElement={videoRef.current}
                    landmarks={currentPose.landmarks}
                    width={1280}
                    height={720}
                    showSkeleton={true}
                    showLandmarks={true}
                  />
                )}
                
                {/* Status Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isDetecting ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    {isDetecting ? 'Detecting' : 'Stopped'}
                  </span>
                </div>

                {/* Calibration Overlay */}
                {calibrationStep > 0 && calibrationStep < 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Card className="bg-white/90">
                      <CardContent className="p-6 text-center">
                        <h3 className="font-semibold mb-2">Calibration Step {calibrationStep}</h3>
                        <Progress value={(calibrationStep / 3) * 100} className="mb-4" />
                        <Button onClick={handleCalibration}>
                          {calibrationStep < 3 ? 'Next Step' : 'Complete'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Panel */}
        <div className="lg:col-span-1">
          <RealTimeFeedback 
            analysis={analysis}
            isDetecting={isDetecting}
            className="h-fit"
          />
        </div>
      </div>

      <Navigation />
    </div>
  );
}