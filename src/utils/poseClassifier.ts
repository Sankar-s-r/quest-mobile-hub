import { PoseLandmarks } from '@/hooks/usePoseDetection';

export interface AsanaPose {
  id: string;
  name: string;
  sanskritName: string;
  keyPoints: number[];
  angleConstraints: AngleConstraint[];
  positionConstraints: PositionConstraint[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AngleConstraint {
  joints: [number, number, number]; // [point1, vertex, point2]
  minAngle: number;
  maxAngle: number;
  importance: number; // 0-1, how critical this constraint is
}

export interface PositionConstraint {
  landmark: number;
  relativeToLandmark: number;
  direction: 'above' | 'below' | 'left' | 'right';
  tolerance: number;
  importance: number;
}

export interface PoseAnalysis {
  pose: AsanaPose;
  accuracy: number;
  feedback: FeedbackItem[];
  overallScore: number;
}

export interface FeedbackItem {
  type: 'angle' | 'position' | 'alignment';
  message: string;
  severity: 'info' | 'warning' | 'error';
  bodyPart: string;
  correction: string;
}

// MediaPipe pose landmark indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32
};

// Sample asanas for classification
export const BASIC_ASANAS: AsanaPose[] = [
  {
    id: 'mountain_pose',
    name: 'Mountain Pose',
    sanskritName: 'Tadasana',
    keyPoints: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
    angleConstraints: [
      {
        joints: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
        minAngle: 160,
        maxAngle: 180,
        importance: 0.8
      }
    ],
    positionConstraints: [
      {
        landmark: POSE_LANDMARKS.LEFT_SHOULDER,
        relativeToLandmark: POSE_LANDMARKS.RIGHT_SHOULDER,
        direction: 'left',
        tolerance: 0.1,
        importance: 0.7
      }
    ],
    difficulty: 'beginner'
  },
  {
    id: 'warrior_i',
    name: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    keyPoints: [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.RIGHT_ANKLE],
    angleConstraints: [
      {
        joints: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
        minAngle: 80,
        maxAngle: 100,
        importance: 0.9
      }
    ],
    positionConstraints: [
      {
        landmark: POSE_LANDMARKS.LEFT_WRIST,
        relativeToLandmark: POSE_LANDMARKS.LEFT_SHOULDER,
        direction: 'above',
        tolerance: 0.2,
        importance: 0.6
      }
    ],
    difficulty: 'intermediate'
  }
];

export class PoseClassifier {
  private asanas: AsanaPose[];

  constructor(asanas: AsanaPose[] = BASIC_ASANAS) {
    this.asanas = asanas;
  }

  classifyPose(landmarks: PoseLandmarks[]): PoseAnalysis | null {
    if (!landmarks || landmarks.length < 33) return null;

    let bestMatch: PoseAnalysis | null = null;
    let highestScore = 0;

    for (const asana of this.asanas) {
      const analysis = this.analyzePose(landmarks, asana);
      if (analysis.overallScore > highestScore) {
        highestScore = analysis.overallScore;
        bestMatch = analysis;
      }
    }

    return bestMatch && bestMatch.overallScore > 0.3 ? bestMatch : null;
  }

  private analyzePose(landmarks: PoseLandmarks[], asana: AsanaPose): PoseAnalysis {
    const feedback: FeedbackItem[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    // Analyze angle constraints
    for (const constraint of asana.angleConstraints) {
      const angle = this.calculateAngle(landmarks, constraint.joints);
      const angleScore = this.evaluateAngle(angle, constraint);
      
      totalScore += angleScore * constraint.importance;
      totalWeight += constraint.importance;

      if (angleScore < 0.7) {
        feedback.push({
          type: 'angle',
          message: `Adjust the angle between your joints`,
          severity: angleScore < 0.4 ? 'error' : 'warning',
          bodyPart: this.getBodyPartName(constraint.joints[1]),
          correction: this.getAngleCorrection(angle, constraint)
        });
      }
    }

    // Analyze position constraints
    for (const constraint of asana.positionConstraints) {
      const positionScore = this.evaluatePosition(landmarks, constraint);
      
      totalScore += positionScore * constraint.importance;
      totalWeight += constraint.importance;

      if (positionScore < 0.7) {
        feedback.push({
          type: 'position',
          message: `Adjust your body position`,
          severity: positionScore < 0.4 ? 'error' : 'warning',
          bodyPart: this.getBodyPartName(constraint.landmark),
          correction: this.getPositionCorrection(constraint)
        });
      }
    }

    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
      pose: asana,
      accuracy: overallScore,
      feedback,
      overallScore
    };
  }

  private calculateAngle(landmarks: PoseLandmarks[], joints: [number, number, number]): number {
    const [a, b, c] = joints;
    const pointA = landmarks[a];
    const pointB = landmarks[b];
    const pointC = landmarks[c];

    if (!pointA || !pointB || !pointC) return 0;

    const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - 
                   Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    
    let angle = Math.abs(radians * (180 / Math.PI));
    if (angle > 180) angle = 360 - angle;
    
    return angle;
  }

  private evaluateAngle(angle: number, constraint: AngleConstraint): number {
    if (angle >= constraint.minAngle && angle <= constraint.maxAngle) {
      return 1.0;
    }
    
    const distance = Math.min(
      Math.abs(angle - constraint.minAngle),
      Math.abs(angle - constraint.maxAngle)
    );
    
    return Math.max(0, 1 - (distance / 45)); // Tolerance of 45 degrees
  }

  private evaluatePosition(landmarks: PoseLandmarks[], constraint: PositionConstraint): number {
    const landmark = landmarks[constraint.landmark];
    const reference = landmarks[constraint.relativeToLandmark];

    if (!landmark || !reference) return 0;

    let isCorrect = false;
    const diff = {
      x: landmark.x - reference.x,
      y: landmark.y - reference.y
    };

    switch (constraint.direction) {
      case 'above':
        isCorrect = diff.y < -constraint.tolerance;
        break;
      case 'below':
        isCorrect = diff.y > constraint.tolerance;
        break;
      case 'left':
        isCorrect = diff.x < -constraint.tolerance;
        break;
      case 'right':
        isCorrect = diff.x > constraint.tolerance;
        break;
    }

    return isCorrect ? 1.0 : 0.3;
  }

  private getBodyPartName(landmarkIndex: number): string {
    const bodyParts: { [key: number]: string } = {
      [POSE_LANDMARKS.LEFT_SHOULDER]: 'Left Shoulder',
      [POSE_LANDMARKS.RIGHT_SHOULDER]: 'Right Shoulder',
      [POSE_LANDMARKS.LEFT_ELBOW]: 'Left Elbow',
      [POSE_LANDMARKS.RIGHT_ELBOW]: 'Right Elbow',
      [POSE_LANDMARKS.LEFT_WRIST]: 'Left Wrist',
      [POSE_LANDMARKS.RIGHT_WRIST]: 'Right Wrist',
      [POSE_LANDMARKS.LEFT_HIP]: 'Left Hip',
      [POSE_LANDMARKS.RIGHT_HIP]: 'Right Hip',
      [POSE_LANDMARKS.LEFT_KNEE]: 'Left Knee',
      [POSE_LANDMARKS.RIGHT_KNEE]: 'Right Knee',
      [POSE_LANDMARKS.LEFT_ANKLE]: 'Left Ankle',
      [POSE_LANDMARKS.RIGHT_ANKLE]: 'Right Ankle'
    };
    
    return bodyParts[landmarkIndex] || 'Body Part';
  }

  private getAngleCorrection(currentAngle: number, constraint: AngleConstraint): string {
    const midTarget = (constraint.minAngle + constraint.maxAngle) / 2;
    
    if (currentAngle < constraint.minAngle) {
      return `Increase the angle (currently ${Math.round(currentAngle)}°, target: ${Math.round(midTarget)}°)`;
    } else {
      return `Decrease the angle (currently ${Math.round(currentAngle)}°, target: ${Math.round(midTarget)}°)`;
    }
  }

  private getPositionCorrection(constraint: PositionConstraint): string {
    const oppositeDirection = {
      'above': 'lower',
      'below': 'raise',
      'left': 'move right',
      'right': 'move left'
    };
    
    return `Please ${oppositeDirection[constraint.direction]} your ${this.getBodyPartName(constraint.landmark).toLowerCase()}`;
  }
}