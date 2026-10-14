/**
 * YogaLife App Synchronization Engine
 * Coordinates voice narration, breathing cues, and 3D animation timeline playback.
 * Uses TTS completion callbacks as the primary event driver with timer-based fallbacks.
 */

import tts from './tts';

export interface SyncStep {
  index: number;
  text: { en: string; hi: string };
  duration: number; // Duration in seconds
  breathe?: 'inhale' | 'exhale' | 'hold' | 'normal';
  bodyFocus?: string;
  animationTime: number; // Start time in animation timeline (seconds)
}

export interface SyncState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isSpeaking: boolean;
  progress: number; // 0.0 to 1.0
  currentText: string;
  currentBreathing?: string;
  currentBodyFocus?: string;
  isComplete?: boolean;
}

export class SyncEngine {
  private steps: SyncStep[];
  private currentStep: number = 0;
  private language: 'en' | 'hi';
  private speed: number = 1.0;
  private isPlaying: boolean = false;
  private isSpeaking: boolean = false;
  private onStateChange: (state: SyncState) => void;
  private onStepChange: (step: number, animTime: number) => void;

  // Internal execution management
  private backupTimer: ReturnType<typeof setTimeout> | null = null;
  private stepExecutionToken: number = 0;
  private isDestroyed: boolean = false;
  private isComplete: boolean = false;

  constructor(config: {
    steps: SyncStep[];
    language: 'en' | 'hi';
    speed?: number;
    onStateChange: (state: SyncState) => void;
    onStepChange: (step: number, animTime: number) => void;
  }) {
    this.steps = config.steps && config.steps.length > 0 ? config.steps : [];
    this.language = config.language || 'en';
    this.speed = config.speed !== undefined ? config.speed : 1.0;
    this.onStateChange = config.onStateChange;
    this.onStepChange = config.onStepChange;
    this.currentStep = 0;
    this.isPlaying = false;
    this.isSpeaking = false;
  }

  /**
   * Start or resume session playback.
   */
  public play(): void {
    if (this.isDestroyed || this.steps.length === 0) return;

    // If already at the end, restart from beginning
    if (this.currentStep >= this.steps.length) {
      this.currentStep = 0;
    }

    this.isPlaying = true;
    this.notifyStepChange(this.currentStep);
    this.executeCurrentStep();
  }

  /**
   * Pause speech narration and session progress.
   */
  public pause(): void {
    if (this.isDestroyed) return;

    this.clearBackupTimer();
    this.stepExecutionToken++; // Invalidate pending callbacks
    this.isPlaying = false;
    this.isSpeaking = false;
    tts.stopSpeaking();

    this.notifyStateChange();
  }

  /**
   * Resume session playback from paused state.
   */
  public resume(): void {
    if (this.isDestroyed || this.isPlaying) return;
    this.play();
  }

  /**
   * Stop session and reset to initial step.
   */
  public stop(): void {
    if (this.isDestroyed) return;

    this.clearBackupTimer();
    this.stepExecutionToken++;
    this.isPlaying = false;
    this.isSpeaking = false;
    this.isComplete = false;
    this.currentStep = 0;
    tts.stopSpeaking();

    this.notifyStepChange(0);
    this.notifyStateChange();
  }

  /**
   * Advance immediately to next step.
   */
  public nextStep(): void {
    if (this.isDestroyed || this.steps.length === 0) return;

    this.clearBackupTimer();
    this.stepExecutionToken++;
    tts.stopSpeaking();

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.notifyStepChange(this.currentStep);

      if (this.isPlaying) {
        this.executeCurrentStep();
      } else {
        this.isSpeaking = false;
        this.notifyStateChange();
      }
    } else {
      // Reached the end of all steps
      this.isPlaying = false;
      this.isSpeaking = false;
      this.notifyStateChange();
    }
  }

  /**
   * Jump back to previous step.
   */
  public prevStep(): void {
    if (this.isDestroyed || this.steps.length === 0) return;

    this.clearBackupTimer();
    this.stepExecutionToken++;
    tts.stopSpeaking();

    if (this.currentStep > 0) {
      this.currentStep--;
      this.notifyStepChange(this.currentStep);

      if (this.isPlaying) {
        this.executeCurrentStep();
      } else {
        this.isSpeaking = false;
        this.notifyStateChange();
      }
    } else {
      // At the very first step, simply re-execute or notify
      if (this.isPlaying) {
        this.executeCurrentStep();
      } else {
        this.notifyStateChange();
      }
    }
  }

  /**
   * Jump directly to a specific step index.
   */
  public goToStep(n: number): void {
    if (this.isDestroyed || this.steps.length === 0) return;

    const targetStep = Math.max(0, Math.min(n, this.steps.length - 1));

    this.clearBackupTimer();
    this.stepExecutionToken++;
    tts.stopSpeaking();

    this.currentStep = targetStep;
    this.notifyStepChange(targetStep);

    if (this.isPlaying) {
      this.executeCurrentStep();
    } else {
      this.isSpeaking = false;
      this.notifyStateChange();
    }
  }

  /**
   * Replay current step instruction from the beginning.
   */
  public replay(): void {
    if (this.isDestroyed || this.steps.length === 0) return;

    this.clearBackupTimer();
    this.stepExecutionToken++;
    tts.stopSpeaking();

    this.isPlaying = true;
    this.notifyStepChange(this.currentStep);
    this.executeCurrentStep();
  }

  /**
   * Adjust speech playback rate.
   */
  public setSpeed(s: number): void {
    const clampedSpeed = Math.max(0.5, Math.min(2.0, s));
    this.speed = clampedSpeed;

    // If currently playing and speaking, restart step with new speed
    if (this.isPlaying && this.isSpeaking) {
      this.replay();
    } else {
      this.notifyStateChange();
    }
  }

  /**
   * Switch guidance language between English and Hindi.
   */
  public setLanguage(lang: 'en' | 'hi'): void {
    if (this.language === lang) return;
    this.language = lang;

    if (this.isPlaying) {
      // Re-narrate current instruction in selected language
      this.replay();
    } else {
      this.notifyStateChange();
    }
  }

  /**
   * Returns a snapshot of the current synchronization state.
   */
  public getState(): SyncState {
    const step = this.steps[this.currentStep];
    const totalSteps = this.steps.length;

    let currentText = '';
    let currentBreathing: string | undefined = undefined;
    let currentBodyFocus: string | undefined = undefined;

    if (step) {
      currentText = this.language === 'hi' ? step.text.hi : step.text.en;
      currentBreathing = step.breathe;
      currentBodyFocus = step.bodyFocus;
    }

    // Progress calculation
    const progress =
      totalSteps > 0
        ? Math.min(1.0, Math.max(0.0, this.currentStep / totalSteps))
        : 0;

    return {
      currentStep: this.currentStep,
      totalSteps,
      isPlaying: this.isPlaying,
      isSpeaking: this.isSpeaking,
      progress,
      currentText,
      currentBreathing,
      currentBodyFocus,
      isComplete: this.isComplete,
    };
  }

  /**
   * Cleans up timers, audio, and state listeners.
   */
  public destroy(): void {
    this.isDestroyed = true;
    this.isPlaying = false;
    this.isSpeaking = false;
    this.clearBackupTimer();
    this.stepExecutionToken++;
    tts.stopSpeaking();
  }

  // ==========================================
  // Private Core Execution Logic
  // ==========================================

  private executeCurrentStep(): void {
    if (this.isDestroyed || !this.isPlaying) return;

    if (this.currentStep >= this.steps.length) {
      // All steps completed
      this.isPlaying = false;
      this.isSpeaking = false;
      this.notifyStateChange();
      return;
    }

    const currentStepObj = this.steps[this.currentStep];
    const currentToken = ++this.stepExecutionToken;

    this.isSpeaking = true;
    this.notifyStateChange();

    const textToSpeak =
      this.language === 'hi'
        ? currentStepObj.text.hi
        : currentStepObj.text.en;

    // Compute backup timer duration:
    // If TTS hangs or user platform audio stalls, fallback based on duration / speed
    const stepDuration = currentStepObj.duration > 0 ? currentStepObj.duration : 8;
    const fallbackDelayMs = Math.max(
      3000,
      Math.round((stepDuration / this.speed) * 1000)
    );

    this.clearBackupTimer();
    this.backupTimer = setTimeout(() => {
      if (this.isDestroyed || currentToken !== this.stepExecutionToken) return;

      console.warn(
        `[SyncEngine] Step ${this.currentStep} backup timer triggered (${fallbackDelayMs}ms). Advancing...`
      );
      this.handleStepDone(currentToken);
    }, fallbackDelayMs);

    // Call TTS speak
    tts.speak(textToSpeak, {
      language: this.language,
      rate: this.speed,
      onStart: () => {
        if (this.isDestroyed || currentToken !== this.stepExecutionToken) return;
        this.isSpeaking = true;
        this.notifyStateChange();
      },
      onDone: () => {
        if (this.isDestroyed || currentToken !== this.stepExecutionToken) return;
        // Primary trigger to advance steps!
        this.handleStepDone(currentToken);
      },
      onError: (err) => {
        if (this.isDestroyed || currentToken !== this.stepExecutionToken) return;
        console.warn(`[SyncEngine] TTS error on step ${this.currentStep}:`, err);
        // On error, let backup timer or short safety delay advance
        setTimeout(() => {
          if (currentToken === this.stepExecutionToken && this.isPlaying) {
            this.handleStepDone(currentToken);
          }
        }, 1500);
      },
    });
  }

  /**
   * Handles completion of a step (whether triggered by onDone or fallback timer).
   */
  private handleStepDone(token: number): void {
    if (this.isDestroyed || token !== this.stepExecutionToken || !this.isPlaying) {
      return;
    }

    this.clearBackupTimer();
    this.isSpeaking = false;

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.notifyStepChange(this.currentStep);
      this.executeCurrentStep();
    } else {
      // Reached the final step
      this.isPlaying = false;
      this.isSpeaking = false;
      this.isComplete = true;
      this.notifyStateChange();
    }
  }

  private clearBackupTimer(): void {
    if (this.backupTimer !== null) {
      clearTimeout(this.backupTimer);
      this.backupTimer = null;
    }
  }

  private notifyStepChange(stepIndex: number): void {
    const step = this.steps[stepIndex];
    const animTime = step ? step.animationTime : 0;
    try {
      this.onStepChange(stepIndex, animTime);
    } catch (err) {
      console.warn('[SyncEngine] Error in onStepChange listener:', err);
    }
  }

  private notifyStateChange(): void {
    try {
      this.onStateChange(this.getState());
    } catch (err) {
      console.warn('[SyncEngine] Error in onStateChange listener:', err);
    }
  }
}

export default SyncEngine;
