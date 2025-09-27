import { useEffect, useRef, useState, useCallback } from 'react';
import { Pose, POSE_LANDMARKS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export interface PoseLandmarks {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseResults {
  landmarks: PoseLandmarks[];
  worldLandmarks: PoseLandmarks[];
  confidence: number;
}

export interface PoseDetectionConfig {
  modelComplexity: 0 | 1 | 2;
  smoothLandmarks: boolean;
  enableSegmentation: boolean;
  smoothSegmentation: boolean;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

const defaultConfig: PoseDetectionConfig = {
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
};

export function usePoseDetection(videoElement: HTMLVideoElement | null, config: Partial<PoseDetectionConfig> = {}) {
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPose, setCurrentPose] = useState<PoseResults | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const finalConfig = { ...defaultConfig, ...config };

  const onResults = useCallback((results: any) => {
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      const poseData: PoseResults = {
        landmarks: results.poseLandmarks,
        worldLandmarks: results.poseWorldLandmarks || [],
        confidence: calculatePoseConfidence(results.poseLandmarks)
      };
      setCurrentPose(poseData);
    } else {
      setCurrentPose(null);
    }
  }, []);

  const calculatePoseConfidence = (landmarks: PoseLandmarks[]): number => {
    if (!landmarks || landmarks.length === 0) return 0;
    
    const visibleLandmarks = landmarks.filter(landmark => landmark.visibility > 0.5);
    return visibleLandmarks.length / landmarks.length;
  };

  const initializePoseDetection = useCallback(async () => {
    if (!videoElement || isInitialized) return;

    try {
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });

      await pose.setOptions(finalConfig);
      pose.onResults(onResults);

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (isDetecting && pose) {
            await pose.send({ image: videoElement });
          }
        },
        width: 1280,
        height: 720
      });

      poseRef.current = pose;
      cameraRef.current = camera;
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize pose detection:', error);
    }
  }, [videoElement, isInitialized, finalConfig, onResults, isDetecting]);

  const startDetection = useCallback(async () => {
    if (!isInitialized || !cameraRef.current) return;
    
    setIsDetecting(true);
    await cameraRef.current.start();
  }, [isInitialized]);

  const stopDetection = useCallback(async () => {
    setIsDetecting(false);
    if (cameraRef.current) {
      await cameraRef.current.stop();
    }
  }, []);

  const cleanup = useCallback(() => {
    stopDetection();
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
    }
    if (cameraRef.current) {
      cameraRef.current = null;
    }
    setIsInitialized(false);
    setCurrentPose(null);
  }, [stopDetection]);

  useEffect(() => {
    if (videoElement) {
      initializePoseDetection();
    }
    return cleanup;
  }, [videoElement, initializePoseDetection, cleanup]);

  return {
    currentPose,
    isInitialized,
    isDetecting,
    startDetection,
    stopDetection,
    cleanup
  };
}