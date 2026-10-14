/**
 * YogaLife App TTS Engine Wrapper
 * High-performance, cross-platform Text-To-Speech powered by expo-speech.
 * Supports bilingual speech (English & Hindi) with voice availability checks.
 */

import * as Speech from 'expo-speech';

export interface TTSOptions {
  language: 'en' | 'hi';
  rate?: number; // 0.5 to 2.0
  pitch?: number; // 0.5 to 2.0
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: any) => void;
}

export interface VoiceAvailabilityResult {
  en: boolean;
  hi: boolean;
  hindiInstallNeeded: boolean;
}

/**
 * Checks voice availability on the user's device for both English and Hindi.
 * Evaluates whether an explicit Hindi TTS voice package is missing on the platform.
 */
export async function checkVoiceAvailability(): Promise<VoiceAvailabilityResult> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();

    if (!voices || voices.length === 0) {
      // In web or environments where voice list is unavailable, assume basic English is present
      return {
        en: true,
        hi: false,
        hindiInstallNeeded: true,
      };
    }

    const hasEnglish = voices.some((v) => {
      const lang = (v.language || '').toLowerCase().replace('_', '-');
      return (
        lang.startsWith('en-us') ||
        lang.startsWith('en-in') ||
        lang.startsWith('en-gb') ||
        lang.startsWith('en')
      );
    });

    const hasHindi = voices.some((v) => {
      const lang = (v.language || '').toLowerCase().replace('_', '-');
      return lang.startsWith('hi-in') || lang.startsWith('hi');
    });

    return {
      en: hasEnglish,
      hi: hasHindi,
      hindiInstallNeeded: !hasHindi,
    };
  } catch (error) {
    console.warn('[TTS] checkVoiceAvailability encountered an error:', error);
    return {
      en: true,
      hi: false,
      hindiInstallNeeded: true,
    };
  }
}

/**
 * Speaks the provided text in the target language (English or Hindi).
 * Configures speech rate, pitch, and lifecycle callbacks.
 */
export function speak(text: string, options: TTSOptions): void {
  try {
    if (!text || text.trim().length === 0) {
      options.onDone?.();
      return;
    }

    // Language code selection
    const languageCode = options.language === 'hi' ? 'hi-IN' : 'en-US';

    // Clamp rate (expo-speech typical standard: 0.5 to 2.0, default: 1.0)
    const rate =
      options.rate !== undefined
        ? Math.min(2.0, Math.max(0.5, options.rate))
        : 1.0;

    // Clamp pitch (typical standard: 0.5 to 2.0, default: 1.0)
    const pitch =
      options.pitch !== undefined
        ? Math.min(2.0, Math.max(0.5, options.pitch))
        : 1.0;

    Speech.speak(text, {
      language: languageCode,
      rate,
      pitch,
      onStart: () => {
        try {
          options.onStart?.();
        } catch (err) {
          console.warn('[TTS] Error inside onStart callback:', err);
        }
      },
      onDone: () => {
        try {
          options.onDone?.();
        } catch (err) {
          console.warn('[TTS] Error inside onDone callback:', err);
        }
      },
      onStopped: () => {
        // Voice was explicitly stopped by user or interruption
      },
      onError: (error) => {
        console.warn('[TTS] Speech.speak encountered an error:', error);
        try {
          options.onError?.(error);
        } catch (cbErr) {
          console.warn('[TTS] Error inside onError callback:', cbErr);
        }
      },
    });
  } catch (error) {
    console.warn('[TTS] Failed to execute speak():', error);
    try {
      options.onError?.(error);
    } catch (cbErr) {
      console.warn('[TTS] Error inside onError callback:', cbErr);
    }
  }
}

/**
 * Stops any active speech and clears the utterance queue.
 */
export function stopSpeaking(): void {
  try {
    Speech.stop().catch((err) => {
      console.warn('[TTS] Error during Speech.stop():', err);
    });
  } catch (error) {
    console.warn('[TTS] Failed to stop speech:', error);
  }
}

/**
 * Pauses current speech playback (supported on iOS/Web).
 */
export function pauseSpeaking(): void {
  try {
    Speech.pause().catch((err) => {
      // pause is not supported on Android, gracefully handle
      console.warn('[TTS] Speech.pause() note:', err);
    });
  } catch (error) {
    console.warn('[TTS] Speech.pause() failed:', error);
  }
}

/**
 * Resumes speech playback (supported on iOS/Web).
 */
export function resumeSpeaking(): void {
  try {
    Speech.resume().catch((err) => {
      console.warn('[TTS] Speech.resume() note:', err);
    });
  } catch (error) {
    console.warn('[TTS] Speech.resume() failed:', error);
  }
}

/**
 * Checks whether speech synthesis is actively speaking.
 */
export async function isSpeaking(): Promise<boolean> {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.warn('[TTS] Error checking isSpeakingAsync:', error);
    return false;
  }
}

/**
 * Retrieves the full list of installed voices on the platform.
 */
export async function getAvailableVoices(): Promise<Speech.Voice[]> {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.warn('[TTS] Error in getAvailableVoicesAsync:', error);
    return [];
  }
}

export default {
  speak,
  stopSpeaking,
  pauseSpeaking,
  resumeSpeaking,
  isSpeaking,
  getAvailableVoices,
  checkVoiceAvailability,
};
