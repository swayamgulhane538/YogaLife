/**
 * YogaLife 3D Engine - YogaScene
 * Primary 3D rendering component using expo-gl, expo-three, and Three.js.
 * Features:
 * - Real-time skeletal 3D humanoid rendering with smooth skinning
 * - High performance 60fps render loop with AnimationMixer
 * - Soft wellness environment (warm cream to sage ambient lighting, ground yoga mat)
 * - Orbit camera controls (drag to orbit, pinch to zoom, quick angles)
 * - Imperative ref controls (play, pause, setSpeed, replay, resetCamera, setView)
 * - Step progress detection with onAnimationStep callback
 * - Graceful fallback card with pose details if WebGL is unavailable
 * - Robust memory cleanup disposing all geometries, materials, and GL contexts on unmount
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { createHumanoid, HumanoidResult } from './HumanoidModel';
import {
  createPoseAnimationClip,
  poseAnimations,
  PoseAnimation,
} from '../../data/animations';
import { CameraControls, CameraViewMode } from './CameraControls';
import { Colors, Shadows } from '../../constants/theme';
import { useLanguageStore } from '../../stores/languageStore';
import { getPoseById } from '../../data/poses';

export interface YogaSceneProps {
  poseId: string;
  isPlaying: boolean;
  speed: number;
  onAnimationStep?: (step: number) => void;
  onLoadError?: (error: string) => void;
  onReady?: () => void;
  style?: StyleProp<ViewStyle>;
  showCameraControls?: boolean;
}

export interface YogaSceneRef {
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  replay: () => void;
  resetCamera: () => void;
  setView: (view: CameraViewMode) => void;
  getCurrentStep: () => number;
}

export const YogaScene = forwardRef<YogaSceneRef, YogaSceneProps>(
  (
    {
      poseId,
      isPlaying,
      speed,
      onAnimationStep,
      onLoadError,
      onReady,
      style,
      showCameraControls = true,
    },
    ref
  ) => {
    const { t } = useLanguageStore();

    // Scene & Engine State
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [activeView, setActiveView] = useState<CameraViewMode>('front');

    // Three.js References to prevent React re-renders
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const glRef = useRef<ExpoWebGLRenderingContext | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const bonesRef = useRef<Record<string, THREE.Bone> | null>(null);
    const currentActionRef = useRef<THREE.AnimationAction | null>(null);
    const humanoidGroupRef = useRef<THREE.Group | null>(null);

    // Lifecycle & Loop control refs
    const isMountedRef = useRef<boolean>(true);
    const frameIdRef = useRef<number | null>(null);
    const isPlayingRef = useRef<boolean>(isPlaying);
    const speedRef = useRef<number>(speed);
    const poseIdRef = useRef<string>(poseId);
    const currentStepRef = useRef<number>(1);
    const lastTimeRef = useRef<number>(Date.now());

    // Spherical Camera Coordinates (radius, theta, phi)
    const cameraSphericalRef = useRef({
      radius: 2.85,
      theta: 0, // Azimuth: 0 = front (+Z), Math.PI/2 = right side (+X), Math.PI = back (-Z)
      phi: Math.PI / 2.35, // Polar angle: ~76 degrees from zenith
      target: new THREE.Vector3(0, 0.82, 0),
    });

    // Keep props in sync with refs
    useEffect(() => {
      isPlayingRef.current = isPlaying;
      if (currentActionRef.current) {
        currentActionRef.current.paused = !isPlaying;
      }
    }, [isPlaying]);

    useEffect(() => {
      speedRef.current = speed;
      if (mixerRef.current) {
        mixerRef.current.timeScale = speed;
      }
    }, [speed]);

    // Updates camera position based on spherical coordinates
    const updateCameraTransform = useCallback(() => {
      const camera = cameraRef.current;
      if (!camera) return;

      const { radius, theta, phi, target } = cameraSphericalRef.current;
      const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      const y = target.y + radius * Math.cos(phi);
      const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

      camera.position.set(x, y, z);
      camera.lookAt(target.x, target.y, target.z);
    }, []);

    // Play animation clip for specified pose
    const switchPoseAnimation = useCallback(
      (newPoseId: string, crossFade: boolean = true) => {
        if (!mixerRef.current || !bonesRef.current) return;

        const clip = createPoseAnimationClip(newPoseId, bonesRef.current);
        if (!clip) {
          console.warn(`[YogaScene] Failed to create clip for pose "${newPoseId}".`);
          return;
        }

        const animDef: PoseAnimation | undefined =
          poseAnimations[newPoseId] ||
          poseAnimations[newPoseId.replace(/_/g, '-')] ||
          poseAnimations[newPoseId.replace(/-/g, '_')];

        const isLoop = animDef ? animDef.loop : false;

        const newAction = mixerRef.current.clipAction(clip);
        newAction.setLoop(isLoop ? THREE.LoopRepeat : THREE.LoopPingPong, Infinity);
        newAction.clampWhenFinished = !isLoop;

        if (crossFade && currentActionRef.current && currentActionRef.current !== newAction) {
          newAction.reset();
          newAction.crossFadeFrom(currentActionRef.current, 0.45, true);
          newAction.play();
        } else {
          if (currentActionRef.current) {
            currentActionRef.current.stop();
          }
          newAction.reset();
          newAction.play();
        }

        newAction.paused = !isPlayingRef.current;
        mixerRef.current.timeScale = speedRef.current;
        currentActionRef.current = newAction;
        currentStepRef.current = 1;
        onAnimationStep?.(1);
      },
      [onAnimationStep]
    );

    // Switch pose when poseId prop changes
    useEffect(() => {
      if (poseId !== poseIdRef.current) {
        poseIdRef.current = poseId;
        switchPoseAnimation(poseId, true);
      }
    }, [poseId, switchPoseAnimation]);

    // Camera control handlers
    const handleRotate = useCallback(
      (deltaX: number, deltaY: number) => {
        const spherical = cameraSphericalRef.current;
        spherical.theta -= deltaX * 0.008;
        // Clamp polar angle so camera doesn't flip underneath floor or straight above
        spherical.phi = Math.max(0.18, Math.min(Math.PI / 2 + 0.1, spherical.phi - deltaY * 0.008));
        updateCameraTransform();
      },
      [updateCameraTransform]
    );

    const handleZoom = useCallback(
      (scale: number) => {
        const spherical = cameraSphericalRef.current;
        // Clamp zoom distance between 1.3m and 5.2m
        spherical.radius = Math.max(1.3, Math.min(5.2, spherical.radius / scale));
        updateCameraTransform();
      },
      [updateCameraTransform]
    );

    const handleResetCamera = useCallback(() => {
      const spherical = cameraSphericalRef.current;
      spherical.radius = 2.85;
      spherical.theta = 0;
      spherical.phi = Math.PI / 2.35;
      setActiveView('front');
      updateCameraTransform();
    }, [updateCameraTransform]);

    const handleSetView = useCallback(
      (view: CameraViewMode) => {
        const spherical = cameraSphericalRef.current;
        setActiveView(view);

        if (view === 'front') {
          spherical.theta = 0;
          spherical.phi = Math.PI / 2.35;
        } else if (view === 'side') {
          spherical.theta = Math.PI / 2;
          spherical.phi = Math.PI / 2.35;
        } else if (view === 'back') {
          spherical.theta = Math.PI;
          spherical.phi = Math.PI / 2.35;
        }

        updateCameraTransform();
      },
      [updateCameraTransform]
    );

    // Imperative ref methods
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          isPlayingRef.current = true;
          if (currentActionRef.current) {
            currentActionRef.current.paused = false;
          }
        },
        pause: () => {
          isPlayingRef.current = false;
          if (currentActionRef.current) {
            currentActionRef.current.paused = true;
          }
        },
        setSpeed: (newSpeed: number) => {
          speedRef.current = newSpeed;
          if (mixerRef.current) {
            mixerRef.current.timeScale = newSpeed;
          }
        },
        replay: () => {
          if (currentActionRef.current) {
            currentActionRef.current.reset();
            currentActionRef.current.play();
            currentActionRef.current.paused = !isPlayingRef.current;
            currentStepRef.current = 1;
            onAnimationStep?.(1);
          }
        },
        resetCamera: handleResetCamera,
        setView: handleSetView,
        getCurrentStep: () => currentStepRef.current,
      }),
      [handleResetCamera, handleSetView, onAnimationStep]
    );

    // Context creation callback from GLView
    const onContextCreate = useCallback(
      async (gl: ExpoWebGLRenderingContext) => {
        try {
          glRef.current = gl;

          // 1. Initialize Three.js WebGLRenderer using ExpoTHREE.Renderer
          const renderer = new Renderer({ gl });
          renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
          renderer.setClearColor(0xF0F7F0, 1.0); // Soft green wellness theme
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          rendererRef.current = renderer;

          // 2. Setup Scene
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xF0F7F0);
          scene.fog = new THREE.FogExp2(0xF0F7F0, 0.05);
          sceneRef.current = scene;

          // 3. Setup Camera
          const camera = new THREE.PerspectiveCamera(
            45,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            100
          );
          cameraRef.current = camera;
          updateCameraTransform();

          // 4. Lighting Environment (Warm Cream to Sage Palette)
          // Soft Warm Ambient Light
          const ambientLight = new THREE.AmbientLight(0xFFF8DC, 0.65);
          scene.add(ambientLight);

          // Sky / Ground Hemisphere Light
          const hemiLight = new THREE.HemisphereLight(0xFFF8DC, 0x8FBC8F, 0.55);
          hemiLight.position.set(0, 10, 0);
          scene.add(hemiLight);

          // Key Sunlight / Studio Light from above-right
          const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.85);
          keyLight.position.set(2.8, 4.5, 3.2);
          keyLight.castShadow = true;
          keyLight.shadow.mapSize.width = 1024;
          keyLight.shadow.mapSize.height = 1024;
          keyLight.shadow.bias = -0.001;
          scene.add(keyLight);

          // Soft Cool Rim Light from rear-left
          const rimLight = new THREE.DirectionalLight(0xD4E8DC, 0.4);
          rimLight.position.set(-2.5, 3.0, -2.8);
          scene.add(rimLight);

          // 5. Environment: Ground & Yoga Mat
          // Ground Grid
          const grid = new THREE.GridHelper(6, 12, 0xC8DEC9, 0xDCEADC);
          grid.position.y = -0.002;
          scene.add(grid);

          // Yoga Mat Mesh (0.72m x 1.85m)
          const matGeometry = new THREE.BoxGeometry(0.72, 0.012, 1.85);
          const matMaterial = new THREE.MeshStandardMaterial({
            color: 0x7CA99A, // Sage green mat
            roughness: 0.65,
            metalness: 0.05,
          });
          const yogaMat = new THREE.Mesh(matGeometry, matMaterial);
          yogaMat.position.set(0, 0.006, 0);
          yogaMat.receiveShadow = true;
          scene.add(yogaMat);

          // Center Alignment Guide on Mat
          const lineGeo = new THREE.PlaneGeometry(0.018, 1.6);
          const lineMat = new THREE.MeshBasicMaterial({
            color: 0x9EC0B4,
            side: THREE.DoubleSide,
          });
          const line = new THREE.Mesh(lineGeo, lineMat);
          line.rotation.x = -Math.PI / 2;
          line.position.set(0, 0.013, 0);
          scene.add(line);

          // 6. Build Humanoid Mannequin Model
          const humanoid: HumanoidResult = createHumanoid();
          scene.add(humanoid.group);
          humanoidGroupRef.current = humanoid.group;
          bonesRef.current = humanoid.bones;
          mixerRef.current = humanoid.mixer;

          // 7. Load and bind initial pose animation
          switchPoseAnimation(poseIdRef.current, false);

          setIsLoading(false);
          onReady?.();

          // 8. 60fps RequestAnimationFrame Render Loop
          lastTimeRef.current = Date.now();

          const renderLoop = () => {
            if (!isMountedRef.current) return;

            frameIdRef.current = requestAnimationFrame(renderLoop);

            const now = Date.now();
            const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
            lastTimeRef.current = now;

            // Update Animation Mixer
            if (mixerRef.current && isPlayingRef.current) {
              mixerRef.current.update(delta * speedRef.current);

              // Detect Step based on animation time and keyframes
              const action = currentActionRef.current;
              if (action && action.getClip()) {
                const clip = action.getClip();
                const animData =
                  poseAnimations[poseIdRef.current] ||
                  poseAnimations[poseIdRef.current.replace(/_/g, '-')];

                if (animData && animData.keyframes.length > 0) {
                  const clipTime = action.time % clip.duration;
                  const keyframes = animData.keyframes;

                  let stepIdx = 0;
                  for (let i = 0; i < keyframes.length; i++) {
                    if (clipTime >= keyframes[i].time) {
                      stepIdx = i;
                    }
                  }

                  const detectedStep = stepIdx + 1;
                  if (detectedStep !== currentStepRef.current) {
                    currentStepRef.current = detectedStep;
                    onAnimationStep?.(detectedStep);
                  }
                }
              }
            }

            // Render Scene
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
              rendererRef.current.render(sceneRef.current, cameraRef.current);
              if (typeof gl.endFrameEXP === 'function') {
                gl.endFrameEXP();
              }
            }
          };

          frameIdRef.current = requestAnimationFrame(renderLoop);
        } catch (err: any) {
          console.error('[YogaScene] GLView Initialization Error:', err);
          if (isMountedRef.current) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(err?.message || 'Failed to initialize WebGL context');
            onLoadError?.(err?.message || 'Failed to initialize 3D scene');
          }
        }
      },
      [onLoadError, onReady, switchPoseAnimation, updateCameraTransform, onAnimationStep]
    );

    // Unmount Cleanup
    useEffect(() => {
      isMountedRef.current = true;

      return () => {
        isMountedRef.current = false;

        if (frameIdRef.current !== null) {
          cancelAnimationFrame(frameIdRef.current);
          frameIdRef.current = null;
        }

        if (mixerRef.current) {
          mixerRef.current.stopAllAction();
          mixerRef.current = null;
        }

        // Dispose all scene geometries and materials
        if (sceneRef.current) {
          sceneRef.current.traverse((object: any) => {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((mat: any) => mat.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
          sceneRef.current = null;
        }

        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current = null;
        }

        currentActionRef.current = null;
        humanoidGroupRef.current = null;
        bonesRef.current = null;
      };
    }, []);

    // Graceful Fallback if GLView encounters an error
    if (hasError) {
      const poseData = getPoseById(poseId);

      return (
        <View style={[styles.container, styles.errorContainer, style]}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconCircle}>
              <MaterialCommunityIcons
                name={(poseData?.icon as any) || 'yoga'}
                size={48}
                color={Colors.deepForest}
              />
            </View>

            <Text style={styles.errorTitle}>
              {poseData ? `${poseData.sanskritName}` : '3D Yoga View'}
            </Text>

            <Text style={styles.errorSubtitle}>
              {poseData ? `${poseData.englishName} • ${poseData.hindiName}` : ''}
            </Text>

            <Text style={styles.errorDesc}>
              {t(
                '3D rendering is currently unavailable on this device mode. You can still practice this posture following guided voice and step-by-step instructions.',
                'इस डिवाइस पर 3D दृश्य उपलब्ध नहीं है। आप अभी भी निर्देशित आवाज और चरणों के साथ अभ्यास जारी रख सकते हैं।'
              )}
            </Text>

            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="reload" size={16} color={Colors.cardBg} />
              <Text style={styles.retryBtnText}>
                {t('Retry 3D Scene', 'पुनः प्रयास करें')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        {/* Three.js Canvas via GLView */}
        <GLView style={styles.glView} onContextCreate={onContextCreate} />

        {/* Loading Spinner */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.deepForest} />
            <Text style={styles.loadingText}>
              {t('Preparing 3D Mannequin...', '3D मॉडल तैयार हो रहा है...')}
            </Text>
          </View>
        )}

        {/* Camera Control Touch Layer & Quick-Views */}
        {!isLoading && showCameraControls && (
          <CameraControls
            onRotate={handleRotate}
            onZoom={handleZoom}
            onResetCamera={handleResetCamera}
            onSetView={handleSetView}
            activeView={activeView}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7F0',
    overflow: 'hidden',
    position: 'relative',
  },
  glView: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 247, 240, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(143, 188, 143, 0.4)',
  },
  errorIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.softGreenBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.sageGreen,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.deepForest,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.deepForest,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryBtnText: {
    color: Colors.cardBg,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default YogaScene;
