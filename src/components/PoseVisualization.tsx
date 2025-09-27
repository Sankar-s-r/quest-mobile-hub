import React, { useRef, useEffect } from 'react';
import { PoseLandmarks } from '@/hooks/usePoseDetection';
import { POSE_LANDMARKS } from '@/utils/poseClassifier';

interface PoseVisualizationProps {
  videoElement: HTMLVideoElement | null;
  landmarks: PoseLandmarks[] | null;
  width: number;
  height: number;
  showSkeleton?: boolean;
  showLandmarks?: boolean;
  confidenceThreshold?: number;
}

export function PoseVisualization({
  videoElement,
  landmarks,
  width,
  height,
  showSkeleton = true,
  showLandmarks = true,
  confidenceThreshold = 0.5
}: PoseVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw skeleton connections
    if (showSkeleton) {
      drawSkeleton(ctx, landmarks, width, height, confidenceThreshold);
    }

    // Draw landmarks
    if (showLandmarks) {
      drawLandmarks(ctx, landmarks, width, height, confidenceThreshold);
    }
  }, [landmarks, width, height, showSkeleton, showLandmarks, confidenceThreshold]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// Pose connections for skeleton visualization
const POSE_CONNECTIONS = [
  // Face
  [POSE_LANDMARKS.LEFT_EYE, POSE_LANDMARKS.RIGHT_EYE],
  [POSE_LANDMARKS.LEFT_EAR, POSE_LANDMARKS.LEFT_EYE],
  [POSE_LANDMARKS.RIGHT_EAR, POSE_LANDMARKS.RIGHT_EYE],
  
  // Torso
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
  
  // Left arm
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
  [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
  [POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.LEFT_PINKY],
  [POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.LEFT_INDEX],
  [POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.LEFT_THUMB],
  
  // Right arm
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
  [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  [POSE_LANDMARKS.RIGHT_WRIST, POSE_LANDMARKS.RIGHT_PINKY],
  [POSE_LANDMARKS.RIGHT_WRIST, POSE_LANDMARKS.RIGHT_INDEX],
  [POSE_LANDMARKS.RIGHT_WRIST, POSE_LANDMARKS.RIGHT_THUMB],
  
  // Left leg
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
  [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
  [POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.LEFT_HEEL],
  [POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.LEFT_FOOT_INDEX],
  
  // Right leg
  [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
  [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
  [POSE_LANDMARKS.RIGHT_ANKLE, POSE_LANDMARKS.RIGHT_HEEL],
  [POSE_LANDMARKS.RIGHT_ANKLE, POSE_LANDMARKS.RIGHT_FOOT_INDEX],
];

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmarks[],
  width: number,
  height: number,
  confidenceThreshold: number
) {
  ctx.strokeStyle = '#00FF88';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  for (const [start, end] of POSE_CONNECTIONS) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    if (!startPoint || !endPoint) continue;
    if (startPoint.visibility < confidenceThreshold || endPoint.visibility < confidenceThreshold) continue;

    ctx.beginPath();
    ctx.moveTo(startPoint.x * width, startPoint.y * height);
    ctx.lineTo(endPoint.x * width, endPoint.y * height);
    ctx.stroke();
  }
}

function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmarks[],
  width: number,
  height: number,
  confidenceThreshold: number
) {
  landmarks.forEach((landmark, index) => {
    if (!landmark || landmark.visibility < confidenceThreshold) return;

    const x = landmark.x * width;
    const y = landmark.y * height;

    // Different colors for different body parts
    let color = '#FF6B6B';
    if ([POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER, 
         POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP].includes(index)) {
      color = '#4ECDC4'; // Teal for core
    } else if ([POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.RIGHT_WRIST,
                POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.RIGHT_ANKLE].includes(index)) {
      color = '#45B7D1'; // Blue for extremities
    } else if ([POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE,
                POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.RIGHT_ELBOW].includes(index)) {
      color = '#F7DC6F'; // Yellow for joints
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Add a white border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}