/**
 * YogaLife 3D Engine - HumanoidModel
 * Programmatic 3D humanoid mannequin using Three.js with skeletal animation.
 * Features:
 * - 19-bone anatomical skeleton hierarchy
 * - Proportional human figure (~1.72m tall)
 * - Low-to-mid poly smoothed geometry (~2,200 polygons) optimized for mobile 60fps
 * - SkinnedMesh with vertex skinning indices and weights
 * - Integrated AnimationMixer for yoga posture transitions
 */

import * as THREE from 'three';

export interface HumanoidResult {
  group: THREE.Group;
  skeleton: THREE.Skeleton;
  bones: Record<string, THREE.Bone>;
  mixer: THREE.AnimationMixer;
}

export const BONE_NAMES = [
  'hips',           // 0 - Root
  'spine',          // 1 - Lumbar / Mid-torso
  'chest',          // 2 - Thoracic / Upper-torso
  'neck',           // 3 - Cervical spine
  'head',           // 4 - Cranium
  'leftShoulder',   // 5 - Left clavicle/scapula
  'leftUpperArm',   // 6 - Left humerus
  'leftForearm',    // 7 - Left radius/ulna
  'leftHand',       // 8 - Left manus
  'rightShoulder',  // 9 - Right clavicle/scapula
  'rightUpperArm',  // 10 - Right humerus
  'rightForearm',   // 11 - Right radius/ulna
  'rightHand',      // 12 - Right manus
  'leftUpperLeg',   // 13 - Left femur
  'leftLowerLeg',   // 14 - Left tibia/fibula
  'leftFoot',       // 15 - Left pes
  'rightUpperLeg',  // 16 - Right femur
  'rightLowerLeg',  // 17 - Right tibia/fibula
  'rightFoot',      // 18 - Right pes
] as const;

export type BoneName = (typeof BONE_NAMES)[number];

interface BodyPart {
  geometry: THREE.BufferGeometry;
  boneIndex: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Creates and constructs the complete 3D humanoid model ready for animation.
 */
export function createHumanoid(): HumanoidResult {
  const group = new THREE.Group();
  group.name = 'HumanoidRoot';

  // 1. Create all 19 bones
  const bones: Record<string, THREE.Bone> = {};
  for (const name of BONE_NAMES) {
    const bone = new THREE.Bone();
    bone.name = name;
    bones[name] = bone;
  }

  // 2. Establish proportional bone hierarchy and bind-pose relative offsets (in meters)
  // Total standing height: ~1.72m, hips at 0.94m
  bones.hips.position.set(0, 0.94, 0);

  // Spine & Head chain
  bones.spine.position.set(0, 0.16, 0);
  bones.chest.position.set(0, 0.20, 0);
  bones.neck.position.set(0, 0.16, 0);
  bones.head.position.set(0, 0.14, 0);

  // Left Arm chain
  bones.leftShoulder.position.set(0.14, 0.12, 0);
  bones.leftUpperArm.position.set(0.08, -0.04, 0);
  bones.leftForearm.position.set(0, -0.26, 0);
  bones.leftHand.position.set(0, -0.24, 0);

  // Right Arm chain
  bones.rightShoulder.position.set(-0.14, 0.12, 0);
  bones.rightUpperArm.position.set(-0.08, -0.04, 0);
  bones.rightForearm.position.set(0, -0.26, 0);
  bones.rightHand.position.set(0, -0.24, 0);

  // Left Leg chain
  bones.leftUpperLeg.position.set(0.11, -0.06, 0);
  bones.leftLowerLeg.position.set(0, -0.42, 0);
  bones.leftFoot.position.set(0, -0.40, 0);

  // Right Leg chain
  bones.rightUpperLeg.position.set(-0.11, -0.06, 0);
  bones.rightLowerLeg.position.set(0, -0.42, 0);
  bones.rightFoot.position.set(0, -0.40, 0);

  // Assemble parent-child relationships
  bones.hips.add(bones.spine);
  bones.spine.add(bones.chest);
  bones.chest.add(bones.neck);
  bones.neck.add(bones.head);

  bones.chest.add(bones.leftShoulder);
  bones.leftShoulder.add(bones.leftUpperArm);
  bones.leftUpperArm.add(bones.leftForearm);
  bones.leftForearm.add(bones.leftHand);

  bones.chest.add(bones.rightShoulder);
  bones.rightShoulder.add(bones.rightUpperArm);
  bones.rightUpperArm.add(bones.rightForearm);
  bones.rightForearm.add(bones.rightHand);

  bones.hips.add(bones.leftUpperLeg);
  bones.leftUpperLeg.add(bones.leftLowerLeg);
  bones.leftLowerLeg.add(bones.leftFoot);

  bones.hips.add(bones.rightUpperLeg);
  bones.rightUpperLeg.add(bones.rightLowerLeg);
  bones.rightLowerLeg.add(bones.rightFoot);

  // Skeleton array matching exact BONE_NAMES order
  const bonesList: THREE.Bone[] = BONE_NAMES.map((name) => bones[name]);
  const skeleton = new THREE.Skeleton(bonesList);

  // 3. Define anatomical mesh segments in world bind-pose space
  const parts: BodyPart[] = [
    // Pelvis / Hips (Bone 0)
    {
      geometry: new THREE.CylinderGeometry(0.13, 0.105, 0.15, 16),
      boneIndex: 0,
      position: [0, 0.93, 0],
    },
    // Spine / Abdomen (Bone 1)
    {
      geometry: new THREE.CylinderGeometry(0.12, 0.128, 0.16, 16),
      boneIndex: 1,
      position: [0, 1.08, 0],
    },
    // Chest / Thorax (Bone 2)
    {
      geometry: new THREE.CylinderGeometry(0.15, 0.118, 0.22, 16),
      boneIndex: 2,
      position: [0, 1.27, 0],
    },
    // Neck (Bone 3)
    {
      geometry: new THREE.CylinderGeometry(0.048, 0.054, 0.12, 12),
      boneIndex: 3,
      position: [0, 1.45, 0],
    },
    // Head (Bone 4)
    {
      geometry: new THREE.SphereGeometry(0.105, 16, 14),
      boneIndex: 4,
      position: [0, 1.60, 0],
    },

    // --- LEFT ARM ---
    // Left Shoulder Joint (Bone 5)
    {
      geometry: new THREE.SphereGeometry(0.052, 12, 10),
      boneIndex: 5,
      position: [0.18, 1.40, 0],
    },
    // Left Upper Arm (Bone 6)
    {
      geometry: new THREE.CylinderGeometry(0.045, 0.038, 0.24, 12),
      boneIndex: 6,
      position: [0.22, 1.26, 0],
    },
    // Left Elbow Joint (Bone 7)
    {
      geometry: new THREE.SphereGeometry(0.039, 12, 10),
      boneIndex: 7,
      position: [0.22, 1.12, 0],
    },
    // Left Forearm (Bone 7)
    {
      geometry: new THREE.CylinderGeometry(0.038, 0.032, 0.22, 12),
      boneIndex: 7,
      position: [0.22, 0.99, 0],
    },
    // Left Wrist Joint (Bone 8)
    {
      geometry: new THREE.SphereGeometry(0.032, 10, 8),
      boneIndex: 8,
      position: [0.22, 0.87, 0],
    },
    // Left Hand (Bone 8)
    {
      geometry: new THREE.BoxGeometry(0.028, 0.10, 0.065),
      boneIndex: 8,
      position: [0.22, 0.81, 0],
    },

    // --- RIGHT ARM ---
    // Right Shoulder Joint (Bone 9)
    {
      geometry: new THREE.SphereGeometry(0.052, 12, 10),
      boneIndex: 9,
      position: [-0.18, 1.40, 0],
    },
    // Right Upper Arm (Bone 10)
    {
      geometry: new THREE.CylinderGeometry(0.045, 0.038, 0.24, 12),
      boneIndex: 10,
      position: [-0.22, 1.26, 0],
    },
    // Right Elbow Joint (Bone 11)
    {
      geometry: new THREE.SphereGeometry(0.039, 12, 10),
      boneIndex: 11,
      position: [-0.22, 1.12, 0],
    },
    // Right Forearm (Bone 11)
    {
      geometry: new THREE.CylinderGeometry(0.038, 0.032, 0.22, 12),
      boneIndex: 11,
      position: [-0.22, 0.99, 0],
    },
    // Right Wrist Joint (Bone 12)
    {
      geometry: new THREE.SphereGeometry(0.032, 10, 8),
      boneIndex: 12,
      position: [-0.22, 0.87, 0],
    },
    // Right Hand (Bone 12)
    {
      geometry: new THREE.BoxGeometry(0.028, 0.10, 0.065),
      boneIndex: 12,
      position: [-0.22, 0.81, 0],
    },

    // --- LEFT LEG ---
    // Left Hip Joint (Bone 13)
    {
      geometry: new THREE.SphereGeometry(0.065, 12, 10),
      boneIndex: 13,
      position: [0.11, 0.88, 0],
    },
    // Left Upper Leg / Thigh (Bone 13)
    {
      geometry: new THREE.CylinderGeometry(0.066, 0.050, 0.38, 14),
      boneIndex: 13,
      position: [0.11, 0.67, 0],
    },
    // Left Knee Joint (Bone 14)
    {
      geometry: new THREE.SphereGeometry(0.050, 12, 10),
      boneIndex: 14,
      position: [0.11, 0.46, 0],
    },
    // Left Lower Leg / Calf (Bone 14)
    {
      geometry: new THREE.CylinderGeometry(0.048, 0.038, 0.36, 14),
      boneIndex: 14,
      position: [0.11, 0.26, 0],
    },
    // Left Ankle Joint (Bone 15)
    {
      geometry: new THREE.SphereGeometry(0.038, 10, 8),
      boneIndex: 15,
      position: [0.11, 0.07, 0],
    },
    // Left Foot (Bone 15)
    {
      geometry: new THREE.BoxGeometry(0.066, 0.055, 0.16),
      boneIndex: 15,
      position: [0.11, 0.03, 0.04],
    },

    // --- RIGHT LEG ---
    // Right Hip Joint (Bone 16)
    {
      geometry: new THREE.SphereGeometry(0.065, 12, 10),
      boneIndex: 16,
      position: [-0.11, 0.88, 0],
    },
    // Right Upper Leg / Thigh (Bone 16)
    {
      geometry: new THREE.CylinderGeometry(0.066, 0.050, 0.38, 14),
      boneIndex: 16,
      position: [-0.11, 0.67, 0],
    },
    // Right Knee Joint (Bone 17)
    {
      geometry: new THREE.SphereGeometry(0.050, 12, 10),
      boneIndex: 17,
      position: [-0.11, 0.46, 0],
    },
    // Right Lower Leg / Calf (Bone 17)
    {
      geometry: new THREE.CylinderGeometry(0.048, 0.038, 0.36, 14),
      boneIndex: 17,
      position: [-0.11, 0.26, 0],
    },
    // Right Ankle Joint (Bone 18)
    {
      geometry: new THREE.SphereGeometry(0.038, 10, 8),
      boneIndex: 18,
      position: [-0.11, 0.07, 0],
    },
    // Right Foot (Bone 18)
    {
      geometry: new THREE.BoxGeometry(0.066, 0.055, 0.16),
      boneIndex: 18,
      position: [-0.11, 0.03, 0.04],
    },
  ];

  // 4. Merge all segments into a single Skinned BufferGeometry with skin indices and weights
  const masterPositions: number[] = [];
  const masterNormals: number[] = [];
  const masterUvs: number[] = [];
  const masterSkinIndices: number[] = [];
  const masterSkinWeights: number[] = [];
  const masterIndices: number[] = [];

  let vertexOffset = 0;

  for (const part of parts) {
    const geo = part.geometry;

    if (part.rotation) {
      geo.rotateX(part.rotation[0]);
      geo.rotateY(part.rotation[1]);
      geo.rotateZ(part.rotation[2]);
    }
    if (part.position) {
      geo.translate(part.position[0], part.position[1], part.position[2]);
    }

    geo.computeVertexNormals();

    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const normAttr = geo.getAttribute('normal') as THREE.BufferAttribute;
    const uvAttr = geo.getAttribute('uv') as THREE.BufferAttribute | undefined;
    const indexAttr = geo.getIndex();

    const vertexCount = posAttr.count;

    for (let i = 0; i < vertexCount; i++) {
      masterPositions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      masterNormals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));

      if (uvAttr) {
        masterUvs.push(uvAttr.getX(i), uvAttr.getY(i));
      } else {
        masterUvs.push(0, 0);
      }

      // 100% weight to this segment's bone
      masterSkinIndices.push(part.boneIndex, 0, 0, 0);
      masterSkinWeights.push(1.0, 0.0, 0.0, 0.0);
    }

    if (indexAttr) {
      for (let i = 0; i < indexAttr.count; i++) {
        masterIndices.push(indexAttr.getX(i) + vertexOffset);
      }
    } else {
      for (let i = 0; i < vertexCount; i++) {
        masterIndices.push(i + vertexOffset);
      }
    }

    vertexOffset += vertexCount;
    geo.dispose(); // Free intermediate sub-geometry
  }

  const mergedGeometry = new THREE.BufferGeometry();
  mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(masterPositions, 3));
  mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(masterNormals, 3));
  mergedGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(masterUvs, 2));
  mergedGeometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(masterSkinIndices, 4));
  mergedGeometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(masterSkinWeights, 4));
  mergedGeometry.setIndex(masterIndices);

  // 5. Aesthetic wellness material (soft sage/teal tone)
  const material = new THREE.MeshStandardMaterial({
    color: 0x5F9EA0, // Cadet blue / soft sage teal
    roughness: 0.35,
    metalness: 0.12,
    flatShading: false,
  });

  const skinnedMesh = new THREE.SkinnedMesh(mergedGeometry, material);
  skinnedMesh.name = 'HumanoidMesh';
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;

  // 6. Bind skeleton to mesh
  group.add(skinnedMesh);
  skinnedMesh.add(bones.hips);

  // Update world matrices before bind so boneInverses are computed precisely
  group.updateMatrixWorld(true);
  skinnedMesh.bind(skeleton);

  // 7. Setup animation mixer bound to root group
  const mixer = new THREE.AnimationMixer(group);

  return {
    group,
    skeleton,
    bones,
    mixer,
  };
}

export default createHumanoid;
