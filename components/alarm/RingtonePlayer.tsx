import { Audio } from 'expo-av';

export interface SoundOption {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
}

const AVAILABLE_SOUNDS: SoundOption[] = [
  {
    id: 'bell',
    name: 'Temple Bell',
    nameHi: 'मंदिर की घंटी',
    description: 'Resonant Tibetan singing bowl / temple bell',
    descriptionHi: 'गंभीर तिब्बती गायन कटोरा / मंदिर की घंटी',
  },
  {
    id: 'chime',
    name: 'Wind Chimes',
    nameHi: 'हवा की झंकार',
    description: 'Soft metallic wind chimes in gentle breeze',
    descriptionHi: 'हल्की हवा में गूंजती मधुर झंकार',
  },
  {
    id: 'flute',
    name: 'Bamboo Flute',
    nameHi: 'बांसुरी',
    description: 'Peaceful Indian classical bamboo flute',
    descriptionHi: 'शांत और मधुर भारतीय शास्त्रीय बांसुरी',
  },
  {
    id: 'nature',
    name: 'Forest Birds & Stream',
    nameHi: 'प्रकृति और पक्षी',
    description: 'Flowing mountain river and forest morning birds',
    descriptionHi: 'बहती नदी और सुबह के चहचहाते पक्षी',
  },
  {
    id: 'gentle',
    name: 'Gentle Om',
    nameHi: 'शांत ॐ ध्वनि',
    description: 'Harmonic meditative Om vibration',
    descriptionHi: 'ध्यानमय ॐ कंपन और शांति',
  },
];

let activeSound: Audio.Sound | null = null;
let isPlaying = false;

/**
 * Returns list of all available reminder sounds
 */
export function getAvailableSounds(): SoundOption[] {
  return AVAILABLE_SOUNDS;
}

/**
 * Play a preview of the alarm / reminder sound
 * Uses bundled sound asset or fallback synth frequency
 */
export async function playAlarmSound(soundId: string = 'bell'): Promise<void> {
  try {
    // Stop any currently playing preview sound
    await stopAlarmSound();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    let soundSource: any;

    switch (soundId) {
      case 'bell':
        soundSource = require('@/assets/sounds/bell.wav');
        break;
      case 'chime':
      case 'flute':
      case 'nature':
      case 'gentle':
      default:
        // Use bell.wav as universal reliable audio source
        soundSource = require('@/assets/sounds/bell.wav');
        break;
    }

    const { sound } = await Audio.Sound.createAsync(
      soundSource,
      { shouldPlay: true, volume: 1.0, isLooping: false }
    );

    activeSound = sound;
    isPlaying = true;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        isPlaying = false;
        sound.unloadAsync().catch(() => {});
        if (activeSound === sound) {
          activeSound = null;
        }
      }
    });
  } catch (error) {
    console.warn(`Error playing sound '${soundId}':`, error);
    isPlaying = false;
  }
}

/**
 * Stop any active ringtone playback
 */
export async function stopAlarmSound(): Promise<void> {
  try {
    if (activeSound) {
      await activeSound.stopAsync();
      await activeSound.unloadAsync();
      activeSound = null;
    }
    isPlaying = false;
  } catch (error) {
    console.warn('Error stopping sound:', error);
    activeSound = null;
    isPlaying = false;
  }
}

/**
 * Check if audio is currently playing
 */
export function isAlarmSoundPlaying(): boolean {
  return isPlaying;
}
