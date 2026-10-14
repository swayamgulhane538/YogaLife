/**
 * YogaLife 3D Engine - Animation Data & Clip Generator
 * Keyframe definitions for all 15 yoga poses with realistic biomechanical joint rotations.
 * Bone rotation conventions:
 * - X: Flexion / Extension (forward/backward)
 * - Y: Abduction / Adduction / Rotation (twist)
 * - Z: Lateral flexion / Outward elevation
 */

import * as THREE from 'three';

export interface BonePose {
  bone: string; // bone name matching BONE_NAMES
  rotation: [number, number, number]; // euler angles in radians [x, y, z]
  position?: [number, number, number]; // optional position offset for root/hips [x, y, z]
}

export interface PoseKeyframe {
  time: number; // seconds from start
  bones: BonePose[];
}

export interface PoseAnimation {
  poseId: string;
  keyframes: PoseKeyframe[];
  loop: boolean; // true for dynamic poses like Cat-Cow & Surya Namaskar
  holdTime?: number; // seconds to hold static poses
}

// Base root position for hips in neutral standing pose
const BASE_HIPS_POS: [number, number, number] = [0, 0.94, 0];

export const poseAnimations: Record<string, PoseAnimation> = {
  // 1. Mountain Pose (Tādāsana)
  tadasana: {
    poseId: 'tadasana',
    loop: false,
    holdTime: 30,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'neck', rotation: [0, 0, 0] },
          { bone: 'leftUpperArm', rotation: [0, 0, 0.05] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.05] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0.04, 0, 0] },
          { bone: 'chest', rotation: [0.08, 0, 0] },
          { bone: 'neck', rotation: [-0.02, 0, 0] },
          { bone: 'leftShoulder', rotation: [0, 0, 0.08] },
          { bone: 'rightShoulder', rotation: [0, 0, -0.08] },
          { bone: 'leftUpperArm', rotation: [0, 0.08, 0.12] },
          { bone: 'rightUpperArm', rotation: [0, -0.08, -0.12] },
          { bone: 'leftForearm', rotation: [0, 0.15, 0] },
          { bone: 'rightForearm', rotation: [0, -0.15, 0] },
        ],
      },
      {
        time: 3.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0.02, 0, 0] },
          { bone: 'chest', rotation: [0.06, 0, 0] },
          { bone: 'neck', rotation: [-0.02, 0, 0] },
          { bone: 'leftShoulder', rotation: [0, 0, 0.06] },
          { bone: 'rightShoulder', rotation: [0, 0, -0.06] },
          { bone: 'leftUpperArm', rotation: [0, 0.12, 0.1] },
          { bone: 'rightUpperArm', rotation: [0, -0.12, -0.1] },
          { bone: 'leftForearm', rotation: [0, 0.25, 0] },
          { bone: 'rightForearm', rotation: [0, -0.25, 0] },
        ],
      },
      {
        time: 5.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0.02, 0, 0] },
          { bone: 'chest', rotation: [0.06, 0, 0] },
          { bone: 'neck', rotation: [-0.02, 0, 0] },
          { bone: 'leftShoulder', rotation: [0, 0, 0.06] },
          { bone: 'rightShoulder', rotation: [0, 0, -0.06] },
          { bone: 'leftUpperArm', rotation: [0, 0.12, 0.1] },
          { bone: 'rightUpperArm', rotation: [0, -0.12, -0.1] },
          { bone: 'leftForearm', rotation: [0, 0.25, 0] },
          { bone: 'rightForearm', rotation: [0, -0.25, 0] },
        ],
      },
    ],
  },

  // 2. Tree Pose (Vṛkṣāsana)
  vrikshasana: {
    poseId: 'vrikshasana',
    loop: false,
    holdTime: 45,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0] },
          { bone: 'leftLowerLeg', rotation: [0, 0, 0] },
          { bone: 'leftUpperArm', rotation: [0, 0, 0.05] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.05] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0, 0, -0.04], position: [0, 0.94, 0] },
          { bone: 'leftUpperLeg', rotation: [-0.35, 0.35, 0.45] },
          { bone: 'leftLowerLeg', rotation: [1.1, 0, 0] },
          { bone: 'leftShoulder', rotation: [0, 0, 0.4] },
          { bone: 'rightShoulder', rotation: [0, 0, -0.4] },
          { bone: 'leftUpperArm', rotation: [-0.3, 0, 1.2] },
          { bone: 'rightUpperArm', rotation: [-0.3, 0, -1.2] },
          { bone: 'leftForearm', rotation: [-0.4, 0, 0] },
          { bone: 'rightForearm', rotation: [-0.4, 0, 0] },
        ],
      },
      {
        time: 3.5,
        bones: [
          { bone: 'hips', rotation: [0, 0, -0.03], position: [0, 0.94, 0] },
          { bone: 'spine', rotation: [0, 0, 0.03] },
          { bone: 'chest', rotation: [0.05, 0, 0] },
          // Left leg placed on inner right thigh
          { bone: 'leftUpperLeg', rotation: [-0.1, 0.78, 0.82] },
          { bone: 'leftLowerLeg', rotation: [2.15, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.35, 0, 0.2] },
          { bone: 'rightUpperLeg', rotation: [0, 0, -0.03] },
          // Arms in overhead Anjali Mudra prayer
          { bone: 'leftShoulder', rotation: [0, 0, 0.25] },
          { bone: 'leftUpperArm', rotation: [-0.15, 0, 2.8] },
          { bone: 'leftForearm', rotation: [0, 0, 0.45] },
          { bone: 'leftHand', rotation: [0, 0, 0.15] },
          { bone: 'rightShoulder', rotation: [0, 0, -0.25] },
          { bone: 'rightUpperArm', rotation: [-0.15, 0, -2.8] },
          { bone: 'rightForearm', rotation: [0, 0, -0.45] },
          { bone: 'rightHand', rotation: [0, 0, -0.15] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, -0.03], position: [0, 0.94, 0] },
          { bone: 'spine', rotation: [0, 0, 0.03] },
          { bone: 'chest', rotation: [0.05, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [-0.1, 0.78, 0.82] },
          { bone: 'leftLowerLeg', rotation: [2.15, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.35, 0, 0.2] },
          { bone: 'rightUpperLeg', rotation: [0, 0, -0.03] },
          { bone: 'leftShoulder', rotation: [0, 0, 0.25] },
          { bone: 'leftUpperArm', rotation: [-0.15, 0, 2.8] },
          { bone: 'leftForearm', rotation: [0, 0, 0.45] },
          { bone: 'leftHand', rotation: [0, 0, 0.15] },
          { bone: 'rightShoulder', rotation: [0, 0, -0.25] },
          { bone: 'rightUpperArm', rotation: [-0.15, 0, -2.8] },
          { bone: 'rightForearm', rotation: [0, 0, -0.45] },
          { bone: 'rightHand', rotation: [0, 0, -0.15] },
        ],
      },
    ],
  },

  // 3. Cobra Pose (Bhujaṅgāsana)
  bhujangasana: {
    poseId: 'bhujangasana',
    loop: false,
    holdTime: 30,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [-1.2, 0, 0], position: [0, 0.35, 0] },
          { bone: 'leftUpperLeg', rotation: [0.8, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.8, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.8, 0, 0.3] },
          { bone: 'rightUpperArm', rotation: [-0.8, 0, -0.3] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Prone position on mat
          { bone: 'hips', rotation: [-1.57, 0, 0], position: [0, 0.14, 0] },
          { bone: 'leftUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.4, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.4, 0, 0] },
          // Backbend arch in spine & chest
          { bone: 'spine', rotation: [0.45, 0, 0] },
          { bone: 'chest', rotation: [0.55, 0, 0] },
          { bone: 'neck', rotation: [0.35, 0, 0] },
          // Arms supporting torso, elbows gently bent
          { bone: 'leftUpperArm', rotation: [-0.3, 0, 0.25] },
          { bone: 'leftForearm', rotation: [-0.7, 0, 0] },
          { bone: 'rightUpperArm', rotation: [-0.3, 0, -0.25] },
          { bone: 'rightForearm', rotation: [-0.7, 0, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [-1.57, 0, 0], position: [0, 0.14, 0] },
          { bone: 'leftUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.4, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.4, 0, 0] },
          { bone: 'spine', rotation: [0.45, 0, 0] },
          { bone: 'chest', rotation: [0.55, 0, 0] },
          { bone: 'neck', rotation: [0.35, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.3, 0, 0.25] },
          { bone: 'leftForearm', rotation: [-0.7, 0, 0] },
          { bone: 'rightUpperArm', rotation: [-0.3, 0, -0.25] },
          { bone: 'rightForearm', rotation: [-0.7, 0, 0] },
        ],
      },
    ],
  },

  // 4. Child's Pose (Bālāsana)
  balasana: {
    poseId: 'balasana',
    loop: false,
    holdTime: 60,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0.4, 0, 0], position: [0, 0.5, -0.1] },
          { bone: 'leftUpperLeg', rotation: [1.2, 0, 0.1] },
          { bone: 'rightUpperLeg', rotation: [1.2, 0, -0.1] },
          { bone: 'leftLowerLeg', rotation: [1.4, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.4, 0, 0] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Sitting back on heels
          { bone: 'hips', rotation: [0.85, 0, 0], position: [0, 0.22, -0.25] },
          { bone: 'leftUpperLeg', rotation: [2.15, 0, 0.18] },
          { bone: 'rightUpperLeg', rotation: [2.15, 0, -0.18] },
          { bone: 'leftLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.5, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.5, 0, 0] },
          // Folded torso over thighs
          { bone: 'spine', rotation: [0.55, 0, 0] },
          { bone: 'chest', rotation: [0.45, 0, 0] },
          { bone: 'neck', rotation: [0.35, 0, 0] },
          // Arms extended forward on floor
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 2.8] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -2.8] },
          { bone: 'leftForearm', rotation: [0.2, 0, 0] },
          { bone: 'rightForearm', rotation: [0.2, 0, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0.85, 0, 0], position: [0, 0.22, -0.25] },
          { bone: 'leftUpperLeg', rotation: [2.15, 0, 0.18] },
          { bone: 'rightUpperLeg', rotation: [2.15, 0, -0.18] },
          { bone: 'leftLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.5, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.5, 0, 0] },
          { bone: 'spine', rotation: [0.55, 0, 0] },
          { bone: 'chest', rotation: [0.45, 0, 0] },
          { bone: 'neck', rotation: [0.35, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 2.8] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -2.8] },
          { bone: 'leftForearm', rotation: [0.2, 0, 0] },
          { bone: 'rightForearm', rotation: [0.2, 0, 0] },
        ],
      },
    ],
  },

  // 5. Triangle Pose (Trikoṇāsana)
  trikonasana: {
    poseId: 'trikonasana',
    loop: false,
    holdTime: 45,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0, 0, -0.1], position: BASE_HIPS_POS },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0.35] },
          { bone: 'rightUpperLeg', rotation: [0, 0.3, -0.35] },
          { bone: 'leftUpperArm', rotation: [0, 0, 1.57] },
          { bone: 'rightUpperArm', rotation: [0, 0, -1.57] },
          { bone: 'spine', rotation: [0, 0, -0.2] },
        ],
      },
      {
        time: 3.5,
        bones: [
          { bone: 'hips', rotation: [0, 0, -0.3], position: BASE_HIPS_POS },
          // Wide legs
          { bone: 'leftUpperLeg', rotation: [0, 0, 0.45] },
          { bone: 'rightUpperLeg', rotation: [0, 0.45, -0.45] },
          // Lateral flexion over right leg
          { bone: 'spine', rotation: [0, 0, -0.45] },
          { bone: 'chest', rotation: [0, 0, -0.35] },
          // Right arm reaching down to shin/floor
          { bone: 'rightUpperArm', rotation: [0, 0, -0.3] },
          { bone: 'rightForearm', rotation: [0, 0, 0] },
          // Left arm reaching vertical
          { bone: 'leftUpperArm', rotation: [0, 0, 2.75] },
          { bone: 'leftForearm', rotation: [0, 0, 0] },
          // Gaze up towards left hand
          { bone: 'neck', rotation: [0.3, -1.1, 0] },
          { bone: 'head', rotation: [0.1, -0.2, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, -0.3], position: BASE_HIPS_POS },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0.45] },
          { bone: 'rightUpperLeg', rotation: [0, 0.45, -0.45] },
          { bone: 'spine', rotation: [0, 0, -0.45] },
          { bone: 'chest', rotation: [0, 0, -0.35] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.3] },
          { bone: 'rightForearm', rotation: [0, 0, 0] },
          { bone: 'leftUpperArm', rotation: [0, 0, 2.75] },
          { bone: 'leftForearm', rotation: [0, 0, 0] },
          { bone: 'neck', rotation: [0.3, -1.1, 0] },
          { bone: 'head', rotation: [0.1, -0.2, 0] },
        ],
      },
    ],
  },

  // 6. Thunderbolt Pose (Vajrāsana)
  vajrasana: {
    poseId: 'vajrasana',
    loop: false,
    holdTime: 60,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.5, 0] },
          { bone: 'leftUpperLeg', rotation: [0.8, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.8, 0, 0] },
          { bone: 'leftLowerLeg', rotation: [1.3, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.3, 0, 0] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Sitting upright on heels
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.28, -0.05] },
          { bone: 'leftUpperLeg', rotation: [1.85, 0, 0.04] },
          { bone: 'rightUpperLeg', rotation: [1.85, 0, -0.04] },
          { bone: 'leftLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.6, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.6, 0, 0] },
          // Upright regal spine
          { bone: 'spine', rotation: [0.02, 0, 0] },
          { bone: 'chest', rotation: [0.06, 0, 0] },
          { bone: 'neck', rotation: [-0.02, 0, 0] },
          // Hands resting on thighs
          { bone: 'leftUpperArm', rotation: [-0.05, 0, 0.15] },
          { bone: 'leftForearm', rotation: [-0.35, 0, 0] },
          { bone: 'rightUpperArm', rotation: [-0.05, 0, -0.15] },
          { bone: 'rightForearm', rotation: [-0.35, 0, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.28, -0.05] },
          { bone: 'leftUpperLeg', rotation: [1.85, 0, 0.04] },
          { bone: 'rightUpperLeg', rotation: [1.85, 0, -0.04] },
          { bone: 'leftLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [2.35, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.6, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.6, 0, 0] },
          { bone: 'spine', rotation: [0.02, 0, 0] },
          { bone: 'chest', rotation: [0.06, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.05, 0, 0.15] },
          { bone: 'leftForearm', rotation: [-0.35, 0, 0] },
          { bone: 'rightUpperArm', rotation: [-0.05, 0, -0.15] },
          { bone: 'rightForearm', rotation: [-0.35, 0, 0] },
        ],
      },
    ],
  },

  // 7. Bridge Pose (Setu Bandhāsana)
  'setu-bandhasana': {
    poseId: 'setu-bandhasana',
    loop: false,
    holdTime: 45,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [-1.57, 0, 0], position: [0, 0.16, 0] },
          { bone: 'leftUpperLeg', rotation: [-0.8, 0, 0.1] },
          { bone: 'rightUpperLeg', rotation: [-0.8, 0, -0.1] },
          { bone: 'leftLowerLeg', rotation: [1.5, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.5, 0, 0] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Pelvis lifted high off mat
          { bone: 'hips', rotation: [-1.3, 0, 0], position: [0, 0.38, 0] },
          { bone: 'leftUpperLeg', rotation: [-1.25, 0, 0.08] },
          { bone: 'rightUpperLeg', rotation: [-1.25, 0, -0.08] },
          { bone: 'leftLowerLeg', rotation: [1.7, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.7, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.3, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.3, 0, 0] },
          // Arched spine, chest towards chin
          { bone: 'spine', rotation: [0.35, 0, 0] },
          { bone: 'chest', rotation: [0.35, 0, 0] },
          { bone: 'neck', rotation: [-0.2, 0, 0] },
          // Arms pressing into floor alongside body
          { bone: 'leftUpperArm', rotation: [0.2, 0, 0.15] },
          { bone: 'rightUpperArm', rotation: [0.2, 0, -0.15] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [-1.3, 0, 0], position: [0, 0.38, 0] },
          { bone: 'leftUpperLeg', rotation: [-1.25, 0, 0.08] },
          { bone: 'rightUpperLeg', rotation: [-1.25, 0, -0.08] },
          { bone: 'leftLowerLeg', rotation: [1.7, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.7, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.3, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.3, 0, 0] },
          { bone: 'spine', rotation: [0.35, 0, 0] },
          { bone: 'chest', rotation: [0.35, 0, 0] },
          { bone: 'neck', rotation: [-0.2, 0, 0] },
          { bone: 'leftUpperArm', rotation: [0.2, 0, 0.15] },
          { bone: 'rightUpperArm', rotation: [0.2, 0, -0.15] },
        ],
      },
    ],
  },

  // 8. Downward-Facing Dog (Adho Mukha Śvānāsana)
  'adho-mukha-svanasana': {
    poseId: 'adho-mukha-svanasana',
    loop: false,
    holdTime: 45,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'leftUpperArm', rotation: [0, 0, 0.05] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.05] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0.8, 0, 0], position: [0, 0.72, -0.15] },
          { bone: 'leftUpperLeg', rotation: [-0.6, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [-0.6, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-1.4, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [-1.4, 0, -0.2] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Inverted 'V' shape
          { bone: 'hips', rotation: [1.35, 0, 0], position: [0, 0.78, -0.35] },
          { bone: 'leftUpperLeg', rotation: [1.05, 0, 0.05] },
          { bone: 'rightUpperLeg', rotation: [1.05, 0, -0.05] },
          { bone: 'leftLowerLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [0.05, 0, 0] },
          { bone: 'leftFoot', rotation: [0.3, 0, 0] },
          { bone: 'rightFoot', rotation: [0.3, 0, 0] },
          // Spine elongated, chest opening towards thighs
          { bone: 'spine', rotation: [0.05, 0, 0] },
          { bone: 'chest', rotation: [0.1, 0, 0] },
          // Arms aligned with torso
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 2.9] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -2.9] },
          { bone: 'leftForearm', rotation: [0.1, 0, 0] },
          { bone: 'rightForearm', rotation: [0.1, 0, 0] },
          { bone: 'neck', rotation: [0.2, 0, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [1.35, 0, 0], position: [0, 0.78, -0.35] },
          { bone: 'leftUpperLeg', rotation: [1.05, 0, 0.05] },
          { bone: 'rightUpperLeg', rotation: [1.05, 0, -0.05] },
          { bone: 'leftLowerLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [0.05, 0, 0] },
          { bone: 'leftFoot', rotation: [0.3, 0, 0] },
          { bone: 'rightFoot', rotation: [0.3, 0, 0] },
          { bone: 'spine', rotation: [0.05, 0, 0] },
          { bone: 'chest', rotation: [0.1, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 2.9] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -2.9] },
          { bone: 'leftForearm', rotation: [0.1, 0, 0] },
          { bone: 'rightForearm', rotation: [0.1, 0, 0] },
          { bone: 'neck', rotation: [0.2, 0, 0] },
        ],
      },
    ],
  },

  // 9. Easy Pose (Sukhāsana)
  sukhasana: {
    poseId: 'sukhasana',
    loop: false,
    holdTime: 120,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.38, 0] },
          { bone: 'leftUpperLeg', rotation: [-0.4, 0.3, 0.4] },
          { bone: 'rightUpperLeg', rotation: [-0.4, -0.3, -0.4] },
          { bone: 'leftLowerLeg', rotation: [1.2, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.2, 0, 0] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Grounded cross-legged meditation
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.12, 0] },
          { bone: 'leftUpperLeg', rotation: [-0.2, 0.55, 0.82] },
          { bone: 'leftLowerLeg', rotation: [2.15, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [-0.2, -0.55, -0.82] },
          { bone: 'rightLowerLeg', rotation: [2.15, 0, 0] },
          // Upright lengthened spine
          { bone: 'spine', rotation: [0.02, 0, 0] },
          { bone: 'chest', rotation: [0.05, 0, 0] },
          { bone: 'neck', rotation: [0, 0, 0] },
          // Hands resting on knees in Jnana Mudra
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 0.32] },
          { bone: 'leftForearm', rotation: [-0.45, 0.3, 0] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -0.32] },
          { bone: 'rightForearm', rotation: [-0.45, -0.3, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.12, 0] },
          { bone: 'leftUpperLeg', rotation: [-0.2, 0.55, 0.82] },
          { bone: 'leftLowerLeg', rotation: [2.15, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [-0.2, -0.55, -0.82] },
          { bone: 'rightLowerLeg', rotation: [2.15, 0, 0] },
          { bone: 'spine', rotation: [0.02, 0, 0] },
          { bone: 'chest', rotation: [0.05, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 0.32] },
          { bone: 'leftForearm', rotation: [-0.45, 0.3, 0] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -0.32] },
          { bone: 'rightForearm', rotation: [-0.45, -0.3, 0] },
        ],
      },
    ],
  },

  // 10. Corpse Pose (Śavāsana)
  shavasana: {
    poseId: 'shavasana',
    loop: false,
    holdTime: 300,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [-1.2, 0, 0], position: [0, 0.3, 0] },
          { bone: 'spine', rotation: [0.1, 0, 0] },
          { bone: 'leftUpperArm', rotation: [0, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.2] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Fully relaxed supine
          { bone: 'hips', rotation: [-1.57, 0, 0], position: [0, 0.08, 0] },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'neck', rotation: [0, 0, 0] },
          { bone: 'head', rotation: [0, 0, 0] },
          // Legs softly rotated outward
          { bone: 'leftUpperLeg', rotation: [0, 0.35, 0.18] },
          { bone: 'rightUpperLeg', rotation: [0, -0.35, -0.18] },
          { bone: 'leftLowerLeg', rotation: [0, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [0, 0, 0] },
          // Arms relaxed 30° out, palms facing upward
          { bone: 'leftUpperArm', rotation: [0, 0, 0.4] },
          { bone: 'leftForearm', rotation: [0, 0.5, 0] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.4] },
          { bone: 'rightForearm', rotation: [0, -0.5, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [-1.57, 0, 0], position: [0, 0.08, 0] },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0.35, 0.18] },
          { bone: 'rightUpperLeg', rotation: [0, -0.35, -0.18] },
          { bone: 'leftUpperArm', rotation: [0, 0, 0.4] },
          { bone: 'leftForearm', rotation: [0, 0.5, 0] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.4] },
          { bone: 'rightForearm', rotation: [0, -0.5, 0] },
        ],
      },
    ],
  },

  // 11. Sun Salutation (Sūrya Namaskāra - Dynamic Flow)
  'surya-namaskar': {
    poseId: 'surya-namaskar',
    loop: true,
    holdTime: 0,
    keyframes: [
      // 0s: Step 1 - Pranamasana (Prayer Pose)
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0.04, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 0.4] },
          { bone: 'leftForearm', rotation: [-1.2, 0.6, 0] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -0.4] },
          { bone: 'rightForearm', rotation: [-1.2, -0.6, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0, 0, 0] },
        ],
      },
      // 2s: Step 2 - Hastauttanasana (Raised Arms Pose)
      {
        time: 2.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [-0.2, 0, 0] },
          { bone: 'chest', rotation: [-0.25, 0, 0] },
          { bone: 'neck', rotation: [-0.2, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 2.9] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -2.9] },
          { bone: 'leftForearm', rotation: [0, 0, 0] },
          { bone: 'rightForearm', rotation: [0, 0, 0] },
        ],
      },
      // 4s: Step 3 - Padahastasana (Standing Forward Bend)
      {
        time: 4.0,
        bones: [
          { bone: 'hips', rotation: [1.45, 0, 0], position: [0, 0.88, 0] },
          { bone: 'spine', rotation: [0.4, 0, 0] },
          { bone: 'chest', rotation: [0.3, 0, 0] },
          { bone: 'neck', rotation: [0.25, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 0.1] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -0.1] },
          { bone: 'leftUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.05, 0, 0] },
        ],
      },
      // 6s: Step 4 - Ashwa Sanchalanasana (Equestrian Pose / Low Lunge)
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0.2, 0, 0], position: [0, 0.42, 0] },
          { bone: 'rightUpperLeg', rotation: [-1.4, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.55, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0.8, 0, 0.05] },
          { bone: 'leftLowerLeg', rotation: [0.6, 0, 0] },
          { bone: 'spine', rotation: [-0.15, 0, 0] },
          { bone: 'chest', rotation: [-0.2, 0, 0] },
          { bone: 'neck', rotation: [-0.2, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.3, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [-0.3, 0, -0.2] },
        ],
      },
      // 8s: Step 5 - Parvatasana (Downward-Facing Dog)
      {
        time: 8.0,
        bones: [
          { bone: 'hips', rotation: [1.35, 0, 0], position: [0, 0.78, -0.35] },
          { bone: 'leftUpperLeg', rotation: [1.0, 0, 0.05] },
          { bone: 'rightUpperLeg', rotation: [1.0, 0, -0.05] },
          { bone: 'leftLowerLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [0.05, 0, 0] },
          { bone: 'spine', rotation: [0.05, 0, 0] },
          { bone: 'chest', rotation: [0.1, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 2.85] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -2.85] },
        ],
      },
      // 10s: Step 6 - Bhujangasana (Cobra)
      {
        time: 10.0,
        bones: [
          { bone: 'hips', rotation: [-1.57, 0, 0], position: [0, 0.14, 0] },
          { bone: 'leftUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'spine', rotation: [0.45, 0, 0] },
          { bone: 'chest', rotation: [0.5, 0, 0] },
          { bone: 'neck', rotation: [0.35, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.3, 0, 0.25] },
          { bone: 'leftForearm', rotation: [-0.7, 0, 0] },
          { bone: 'rightUpperArm', rotation: [-0.3, 0, -0.25] },
          { bone: 'rightForearm', rotation: [-0.7, 0, 0] },
        ],
      },
      // 12s: Step 7 - Padahastasana (Forward Bend Return)
      {
        time: 12.0,
        bones: [
          { bone: 'hips', rotation: [1.45, 0, 0], position: [0, 0.88, 0] },
          { bone: 'spine', rotation: [0.4, 0, 0] },
          { bone: 'chest', rotation: [0.3, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 0.1] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -0.1] },
          { bone: 'leftUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.05, 0, 0] },
        ],
      },
      // 14s: Step 8 - Return to Pranamasana
      {
        time: 14.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0.04, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 0.4] },
          { bone: 'leftForearm', rotation: [-1.2, 0.6, 0] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -0.4] },
          { bone: 'rightForearm', rotation: [-1.2, -0.6, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0, 0, 0] },
        ],
      },
    ],
  },

  // 12. Warrior I (Vīrabhadrāsana I)
  'virabhadrasana-1': {
    poseId: 'virabhadrasana-1',
    loop: false,
    holdTime: 45,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0, 0.2, 0], position: [0, 0.85, 0] },
          { bone: 'rightUpperLeg', rotation: [-0.6, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [0.9, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0.3, 0.2, 0.1] },
          { bone: 'leftUpperArm', rotation: [-1.0, 0, 0.3] },
          { bone: 'rightUpperArm', rotation: [-1.0, 0, -0.3] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Sinking into deep lunge
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.78, 0] },
          // Right front leg bent 90 degrees
          { bone: 'rightUpperLeg', rotation: [-1.4, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.55, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.15, 0, 0] },
          // Left back leg extended straight
          { bone: 'leftUpperLeg', rotation: [0.45, 0.35, 0.1] },
          { bone: 'leftLowerLeg', rotation: [0, 0, 0] },
          { bone: 'leftFoot', rotation: [0.2, 0.4, 0] },
          // Torso upright with slight backbend
          { bone: 'spine', rotation: [-0.1, 0, 0] },
          { bone: 'chest', rotation: [-0.15, 0, 0] },
          { bone: 'neck', rotation: [-0.12, 0, 0] },
          // Arms reaching overhead
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 2.92] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -2.92] },
          { bone: 'leftForearm', rotation: [0, 0, 0] },
          { bone: 'rightForearm', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: [0, 0.78, 0] },
          { bone: 'rightUpperLeg', rotation: [-1.4, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.55, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0.45, 0.35, 0.1] },
          { bone: 'leftLowerLeg', rotation: [0, 0, 0] },
          { bone: 'spine', rotation: [-0.1, 0, 0] },
          { bone: 'chest', rotation: [-0.15, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.1, 0, 2.92] },
          { bone: 'rightUpperArm', rotation: [-0.1, 0, -2.92] },
        ],
      },
    ],
  },

  // 13. Warrior II (Vīrabhadrāsana II)
  'virabhadrasana-2': {
    poseId: 'virabhadrasana-2',
    loop: false,
    holdTime: 45,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0, -0.8, 0], position: [0, 0.85, 0] },
          { bone: 'rightUpperLeg', rotation: [-0.6, 0, -0.3] },
          { bone: 'rightLowerLeg', rotation: [0.8, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0.1, 0, 0.4] },
          { bone: 'leftUpperArm', rotation: [0, 0, 0.8] },
          { bone: 'rightUpperArm', rotation: [0, 0, -0.8] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Pelvis open to side, hips sinking
          { bone: 'hips', rotation: [0, -1.35, 0], position: [0, 0.78, 0] },
          // Right thigh parallel to floor, knee bent 90°
          { bone: 'rightUpperLeg', rotation: [-1.4, 0.3, -0.3] },
          { bone: 'rightLowerLeg', rotation: [1.55, 0, 0] },
          // Left back leg straight and grounded
          { bone: 'leftUpperLeg', rotation: [0, 0, 0.55] },
          { bone: 'leftLowerLeg', rotation: [0, 0, 0] },
          // Torso upright and centered
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          // Arms extended parallel to ground (right forward, left backward)
          { bone: 'rightUpperArm', rotation: [0, 0, -1.57] },
          { bone: 'rightForearm', rotation: [0, 0, 0] },
          { bone: 'leftUpperArm', rotation: [0, 0, 1.57] },
          { bone: 'leftForearm', rotation: [0, 0, 0] },
          // Head turned over right hand
          { bone: 'neck', rotation: [0, 1.35, 0] },
          { bone: 'head', rotation: [0, 0.1, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [0, -1.35, 0], position: [0, 0.78, 0] },
          { bone: 'rightUpperLeg', rotation: [-1.4, 0.3, -0.3] },
          { bone: 'rightLowerLeg', rotation: [1.55, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0.55] },
          { bone: 'leftLowerLeg', rotation: [0, 0, 0] },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'rightUpperArm', rotation: [0, 0, -1.57] },
          { bone: 'leftUpperArm', rotation: [0, 0, 1.57] },
          { bone: 'neck', rotation: [0, 1.35, 0] },
          { bone: 'head', rotation: [0, 0.1, 0] },
        ],
      },
    ],
  },

  // 14. Standing Forward Bend (Uttānāsana)
  uttanasana: {
    poseId: 'uttanasana',
    loop: false,
    holdTime: 30,
    keyframes: [
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [0, 0, 0], position: BASE_HIPS_POS },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'leftUpperLeg', rotation: [0, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0, 0, 0] },
        ],
      },
      {
        time: 1.5,
        bones: [
          { bone: 'hips', rotation: [0.75, 0, 0], position: [0, 0.9, 0] },
          { bone: 'spine', rotation: [0.2, 0, 0] },
          { bone: 'chest', rotation: [0.2, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.8, 0, 0.1] },
          { bone: 'rightUpperArm', rotation: [-0.8, 0, -0.1] },
        ],
      },
      {
        time: 3.5,
        bones: [
          // Pelvis rotating over legs
          { bone: 'hips', rotation: [1.52, 0, 0], position: [0, 0.88, 0.05] },
          { bone: 'leftUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'leftLowerLeg', rotation: [0, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [0, 0, 0] },
          // Spine flowing down
          { bone: 'spine', rotation: [0.45, 0, 0] },
          { bone: 'chest', rotation: [0.35, 0, 0] },
          { bone: 'neck', rotation: [0.25, 0, 0] },
          // Hands holding back of ankles / pressing near feet
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 0.1] },
          { bone: 'leftForearm', rotation: [0.15, 0, 0] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -0.1] },
          { bone: 'rightForearm', rotation: [0.15, 0, 0] },
        ],
      },
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [1.52, 0, 0], position: [0, 0.88, 0.05] },
          { bone: 'leftUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'rightUpperLeg', rotation: [0.05, 0, 0] },
          { bone: 'spine', rotation: [0.45, 0, 0] },
          { bone: 'chest', rotation: [0.35, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-0.2, 0, 0.1] },
          { bone: 'rightUpperArm', rotation: [-0.2, 0, -0.1] },
        ],
      },
    ],
  },

  // 15. Cat-Cow Stretch (Mārjārīāsana - Dynamic Loop)
  marjariasana: {
    poseId: 'marjariasana',
    loop: true,
    holdTime: 0,
    keyframes: [
      // 0s: Neutral Tabletop position on all fours
      {
        time: 0,
        bones: [
          { bone: 'hips', rotation: [1.57, 0, 0], position: [0, 0.48, 0] },
          { bone: 'leftUpperLeg', rotation: [1.57, 0, 0.1] },
          { bone: 'rightUpperLeg', rotation: [1.57, 0, -0.1] },
          { bone: 'leftLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'leftFoot', rotation: [-0.4, 0, 0] },
          { bone: 'rightFoot', rotation: [-0.4, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-1.57, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [-1.57, 0, -0.2] },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'neck', rotation: [0, 0, 0] },
        ],
      },
      // 2s: Cow Pose (Inhale - spine sways, belly down, head up)
      {
        time: 2.0,
        bones: [
          { bone: 'hips', rotation: [1.57, 0, 0], position: [0, 0.48, 0] },
          { bone: 'leftUpperLeg', rotation: [1.57, 0, 0.1] },
          { bone: 'rightUpperLeg', rotation: [1.57, 0, -0.1] },
          { bone: 'leftLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-1.57, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [-1.57, 0, -0.2] },
          { bone: 'spine', rotation: [-0.38, 0, 0] },
          { bone: 'chest', rotation: [-0.35, 0, 0] },
          { bone: 'neck', rotation: [0.45, 0, 0] },
        ],
      },
      // 4s: Neutral Tabletop Transition
      {
        time: 4.0,
        bones: [
          { bone: 'hips', rotation: [1.57, 0, 0], position: [0, 0.48, 0] },
          { bone: 'leftUpperLeg', rotation: [1.57, 0, 0.1] },
          { bone: 'rightUpperLeg', rotation: [1.57, 0, -0.1] },
          { bone: 'leftLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-1.57, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [-1.57, 0, -0.2] },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'neck', rotation: [0, 0, 0] },
        ],
      },
      // 6s: Cat Pose (Exhale - spine arches into dome, chin to chest)
      {
        time: 6.0,
        bones: [
          { bone: 'hips', rotation: [1.57, 0, 0], position: [0, 0.48, 0] },
          { bone: 'leftUpperLeg', rotation: [1.57, 0, 0.1] },
          { bone: 'rightUpperLeg', rotation: [1.57, 0, -0.1] },
          { bone: 'leftLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-1.57, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [-1.57, 0, -0.2] },
          { bone: 'spine', rotation: [0.48, 0, 0] },
          { bone: 'chest', rotation: [0.42, 0, 0] },
          { bone: 'neck', rotation: [-0.55, 0, 0] },
        ],
      },
      // 8s: Return to Neutral Tabletop (Smooth loop closure)
      {
        time: 8.0,
        bones: [
          { bone: 'hips', rotation: [1.57, 0, 0], position: [0, 0.48, 0] },
          { bone: 'leftUpperLeg', rotation: [1.57, 0, 0.1] },
          { bone: 'rightUpperLeg', rotation: [1.57, 0, -0.1] },
          { bone: 'leftLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'rightLowerLeg', rotation: [1.57, 0, 0] },
          { bone: 'leftUpperArm', rotation: [-1.57, 0, 0.2] },
          { bone: 'rightUpperArm', rotation: [-1.57, 0, -0.2] },
          { bone: 'spine', rotation: [0, 0, 0] },
          { bone: 'chest', rotation: [0, 0, 0] },
          { bone: 'neck', rotation: [0, 0, 0] },
        ],
      },
    ],
  },
};

// Map alternative naming conventions (underscores, aliases) to standard poses
poseAnimations['setu_bandhasana'] = poseAnimations['setu-bandhasana'];
poseAnimations['bridge'] = poseAnimations['setu-bandhasana'];
poseAnimations['adho_mukha_svanasana'] = poseAnimations['adho-mukha-svanasana'];
poseAnimations['downward_dog'] = poseAnimations['adho-mukha-svanasana'];
poseAnimations['downward-dog'] = poseAnimations['adho-mukha-svanasana'];
poseAnimations['surya_namaskar'] = poseAnimations['surya-namaskar'];
poseAnimations['sun_salutation'] = poseAnimations['surya-namaskar'];
poseAnimations['virabhadrasana_1'] = poseAnimations['virabhadrasana-1'];
poseAnimations['warrior_1'] = poseAnimations['virabhadrasana-1'];
poseAnimations['warrior1'] = poseAnimations['virabhadrasana-1'];
poseAnimations['virabhadrasana_2'] = poseAnimations['virabhadrasana-2'];
poseAnimations['warrior_2'] = poseAnimations['virabhadrasana-2'];
poseAnimations['warrior2'] = poseAnimations['virabhadrasana-2'];
poseAnimations['cat_cow'] = poseAnimations['marjariasana'];
poseAnimations['cat-cow'] = poseAnimations['marjariasana'];
poseAnimations['marjaryasana_bitilasana'] = poseAnimations['marjariasana'];
poseAnimations['tree'] = poseAnimations['vrikshasana'];
poseAnimations['cobra'] = poseAnimations['bhujangasana'];
poseAnimations['triangle'] = poseAnimations['trikonasana'];

/**
 * Creates a Three.js AnimationClip from defined keyframe tracks for the specified pose.
 */
export function createPoseAnimationClip(
  poseId: string,
  bones: Record<string, THREE.Bone>
): THREE.AnimationClip | null {
  const normalizedKey = poseId.toLowerCase().trim();
  let anim = poseAnimations[normalizedKey];

  if (!anim) {
    const hyphenated = normalizedKey.replace(/_/g, '-');
    const underscored = normalizedKey.replace(/-/g, '_');
    anim = poseAnimations[hyphenated] || poseAnimations[underscored];
  }

  if (!anim) {
    console.warn(`[YogaLife 3D] Animation not found for pose "${poseId}", falling back to "tadasana".`);
    anim = poseAnimations['tadasana'];
  }

  if (!anim) {
    return null;
  }

  const { keyframes } = anim;
  const times = keyframes.map((kf) => kf.time);
  const duration = times[times.length - 1];

  const tracks: THREE.KeyframeTrack[] = [];

  // Determine all bones that have rotations or positions defined in any keyframe
  const animatedBoneNames = new Set<string>();
  let hasHipsPosition = false;

  for (const kf of keyframes) {
    for (const b of kf.bones) {
      animatedBoneNames.add(b.bone);
      if (b.bone === 'hips' && b.position) {
        hasHipsPosition = true;
      }
    }
  }

  // Generate QuaternionKeyframeTrack for each animated bone
  for (const boneName of animatedBoneNames) {
    // Check if bone exists in the skeleton
    if (!bones[boneName]) {
      continue;
    }

    const quatValues: number[] = [];
    let currentEuler: [number, number, number] = [0, 0, 0];

    for (const kf of keyframes) {
      const match = kf.bones.find((b) => b.bone === boneName);
      if (match) {
        currentEuler = match.rotation;
      }

      const euler = new THREE.Euler(currentEuler[0], currentEuler[1], currentEuler[2], 'XYZ');
      const quat = new THREE.Quaternion().setFromEuler(euler);

      quatValues.push(quat.x, quat.y, quat.z, quat.w);
    }

    // Name format: boneName.quaternion
    const track = new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, quatValues);
    tracks.push(track);
  }

  // Generate VectorKeyframeTrack for hips position if hips move in 3D space
  if (hasHipsPosition && bones['hips']) {
    const posValues: number[] = [];
    let currentPos: [number, number, number] = [...BASE_HIPS_POS];

    for (const kf of keyframes) {
      const match = kf.bones.find((b) => b.bone === 'hips');
      if (match && match.position) {
        currentPos = match.position;
      }
      posValues.push(currentPos[0], currentPos[1], currentPos[2]);
    }

    const track = new THREE.VectorKeyframeTrack('hips.position', times, posValues);
    tracks.push(track);
  }

  return new THREE.AnimationClip(anim.poseId, duration, tracks);
}

export default poseAnimations;
