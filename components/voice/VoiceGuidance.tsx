/**
 * YogaLife App Voice Guidance Component
 * Encapsulates SyncEngine in a React component with imperative handle control.
 * Coordinates instructions for 3D yoga poses with audio narration.
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { SyncEngine, SyncStep, SyncState } from '../../utils/syncEngine';
import { getInstructionsForPose, PoseInstructions } from '../../data/instructions';

export interface VoiceGuidanceProps {
  poseId: string;
  language: 'en' | 'hi';
  isActive: boolean; // whether voice should be active
  speed: number;
  onStepChange: (step: number, animTime: number) => void;
  onStateChange: (state: SyncState) => void;
}

export interface VoiceGuidanceHandle {
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  replay: () => void;
  getState: () => SyncState | null;
}

export const VoiceGuidance = forwardRef<VoiceGuidanceHandle, VoiceGuidanceProps>(
  ({ poseId, language, isActive, speed, onStepChange, onStateChange }, ref) => {
    const engineRef = useRef<SyncEngine | null>(null);

    // Keep callbacks referenced to prevent unnecessary recreation
    const onStepChangeRef = useRef(onStepChange);
    const onStateChangeRef = useRef(onStateChange);

    useEffect(() => {
      onStepChangeRef.current = onStepChange;
    }, [onStepChange]);

    useEffect(() => {
      onStateChangeRef.current = onStateChange;
    }, [onStateChange]);

    // Load pose instructions and build SyncStep array
    const syncSteps = useMemo<SyncStep[]>(() => {
      const poseData: PoseInstructions = getInstructionsForPose(poseId);

      return (poseData.steps || []).map((step, index) => ({
        index,
        text: {
          en: step.textEn,
          hi: step.textHi,
        },
        duration: step.duration,
        breathe: step.breathe,
        bodyFocus: step.bodyFocus,
        animationTime: step.animationTime,
      }));
    }, [poseId]);

    // Initialize or recreate SyncEngine when pose or steps change
    useEffect(() => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }

      if (syncSteps.length === 0) return;

      const engine = new SyncEngine({
        steps: syncSteps,
        language,
        speed,
        onStateChange: (state) => {
          onStateChangeRef.current?.(state);
        },
        onStepChange: (stepIndex, animTime) => {
          onStepChangeRef.current?.(stepIndex, animTime);
        },
      });

      engineRef.current = engine;

      // Broadcast initial state
      onStateChangeRef.current?.(engine.getState());

      // If active immediately on mount, start playing
      if (isActive) {
        engine.play();
      }

      return () => {
        engine.destroy();
        if (engineRef.current === engine) {
          engineRef.current = null;
        }
      };
    }, [syncSteps]);

    // Synchronize isActive state
    useEffect(() => {
      if (!engineRef.current) return;

      const state = engineRef.current.getState();
      if (isActive && !state.isPlaying) {
        engineRef.current.play();
      } else if (!isActive && state.isPlaying) {
        engineRef.current.pause();
      }
    }, [isActive]);

    // Synchronize language changes
    useEffect(() => {
      if (engineRef.current) {
        engineRef.current.setLanguage(language);
      }
    }, [language]);

    // Synchronize speed changes
    useEffect(() => {
      if (engineRef.current) {
        engineRef.current.setSpeed(speed);
      }
    }, [speed]);

    // Expose imperative methods to parent components
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          engineRef.current?.play();
        },
        pause: () => {
          engineRef.current?.pause();
        },
        resume: () => {
          engineRef.current?.resume();
        },
        stop: () => {
          engineRef.current?.stop();
        },
        nextStep: () => {
          engineRef.current?.nextStep();
        },
        prevStep: () => {
          engineRef.current?.prevStep();
        },
        goToStep: (step: number) => {
          engineRef.current?.goToStep(step);
        },
        replay: () => {
          engineRef.current?.replay();
        },
        getState: () => {
          return engineRef.current ? engineRef.current.getState() : null;
        },
      }),
      []
    );

    return null; // Headless component
  }
);

VoiceGuidance.displayName = 'VoiceGuidance';

export default VoiceGuidance;
