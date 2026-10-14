/**
 * YogaLife App Poses Dataset
 * Comprehensive list of 15 essential yoga poses with metadata, tags, and search helpers.
 */

export type PoseCategory = 'standing' | 'seated' | 'supine' | 'prone' | 'inversion' | 'sequence';
export type PoseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface YogaPose {
  id: string;
  sanskritName: string;
  englishName: string;
  hindiName: string;
  category: PoseCategory;
  difficulty: PoseDifficulty;
  duration: number; // Duration in seconds
  isSequence: boolean;
  tags: string[];
  icon: string; // MaterialCommunityIcons name
}

export const yogaPoses: YogaPose[] = [
  {
    id: 'tadasana',
    sanskritName: 'Tādāsana',
    englishName: 'Mountain Pose',
    hindiName: 'ताड़ासन',
    category: 'standing',
    difficulty: 'beginner',
    duration: 45,
    isSequence: false,
    tags: ['foundation', 'posture', 'standing', 'balance', 'spine', 'alignment'],
    icon: 'human-male-height',
  },
  {
    id: 'vrikshasana',
    sanskritName: 'Vṛkṣāsana',
    englishName: 'Tree Pose',
    hindiName: 'वृक्षासन',
    category: 'standing',
    difficulty: 'beginner',
    duration: 60,
    isSequence: false,
    tags: ['balance', 'focus', 'standing', 'legs', 'hips', 'concentration'],
    icon: 'tree',
  },
  {
    id: 'bhujangasana',
    sanskritName: 'Bhujaṅgāsana',
    englishName: 'Cobra Pose',
    hindiName: 'भुजंगासन',
    category: 'prone',
    difficulty: 'beginner',
    duration: 45,
    isSequence: false,
    tags: ['backbend', 'spine', 'chest', 'prone', 'flexibility', 'energy'],
    icon: 'snake',
  },
  {
    id: 'balasana',
    sanskritName: 'Bālāsana',
    englishName: "Child's Pose",
    hindiName: 'बालासन',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    isSequence: false,
    tags: ['resting', 'relaxation', 'calm', 'spine', 'hips', 'stress relief'],
    icon: 'human-child',
  },
  {
    id: 'trikonasana',
    sanskritName: 'Trikoṇāsana',
    englishName: 'Triangle Pose',
    hindiName: 'त्रिकोणासन',
    category: 'standing',
    difficulty: 'intermediate',
    duration: 60,
    isSequence: false,
    tags: ['standing', 'flexibility', 'hamstrings', 'hips', 'side-body', 'balance'],
    icon: 'triangle-outline',
  },
  {
    id: 'vajrasana',
    sanskritName: 'Vajrāsana',
    englishName: 'Thunderbolt Pose',
    hindiName: 'वज्रासन',
    category: 'seated',
    difficulty: 'beginner',
    duration: 60,
    isSequence: false,
    tags: ['digestion', 'seated', 'meditation', 'knees', 'posture', 'calm'],
    icon: 'lightning-bolt',
  },
  {
    id: 'setu-bandhasana',
    sanskritName: 'Setu Bandhāsana',
    englishName: 'Bridge Pose',
    hindiName: 'सेतुबंधासन',
    category: 'supine',
    difficulty: 'beginner',
    duration: 60,
    isSequence: false,
    tags: ['backbend', 'supine', 'glutes', 'spine', 'chest opener', 'circulation'],
    icon: 'bridge',
  },
  {
    id: 'adho-mukha-svanasana',
    sanskritName: 'Adho Mukha Śvānāsana',
    englishName: 'Downward-Facing Dog',
    hindiName: 'अधोमुख श्वानासन',
    category: 'inversion',
    difficulty: 'beginner',
    duration: 60,
    isSequence: false,
    tags: ['inversion', 'hamstrings', 'shoulders', 'calves', 'energizing', 'core'],
    icon: 'dog',
  },
  {
    id: 'sukhasana',
    sanskritName: 'Sukhāsana',
    englishName: 'Easy Pose',
    hindiName: 'सुखासन',
    category: 'seated',
    difficulty: 'beginner',
    duration: 120,
    isSequence: false,
    tags: ['meditation', 'seated', 'pranayama', 'calm', 'hip opener', 'relaxation'],
    icon: 'meditation',
  },
  {
    id: 'shavasana',
    sanskritName: 'Śavāsana',
    englishName: 'Corpse Pose',
    hindiName: 'शवासन',
    category: 'supine',
    difficulty: 'beginner',
    duration: 300,
    isSequence: false,
    tags: ['relaxation', 'supine', 'rest', 'mindfulness', 'cooling', 'recovery'],
    icon: 'bed-outline',
  },
  {
    id: 'surya-namaskar',
    sanskritName: 'Sūrya Namaskāra',
    englishName: 'Sun Salutation',
    hindiName: 'सूर्य नमस्कार',
    category: 'sequence',
    difficulty: 'intermediate',
    duration: 300,
    isSequence: true,
    tags: ['sequence', 'flow', 'full body', 'cardio', 'vitality', 'warmup', 'vinyasa'],
    icon: 'weather-sunny',
  },
  {
    id: 'virabhadrasana-1',
    sanskritName: 'Vīrabhadrāsana I',
    englishName: 'Warrior I',
    hindiName: 'वीरभद्रासन-1',
    category: 'standing',
    difficulty: 'intermediate',
    duration: 60,
    isSequence: false,
    tags: ['standing', 'strength', 'legs', 'chest opener', 'focus', 'stamina'],
    icon: 'sword',
  },
  {
    id: 'virabhadrasana-2',
    sanskritName: 'Vīrabhadrāsana II',
    englishName: 'Warrior II',
    hindiName: 'वीरभद्रासन-2',
    category: 'standing',
    difficulty: 'intermediate',
    duration: 60,
    isSequence: false,
    tags: ['standing', 'strength', 'hips', 'stamina', 'arms', 'endurance'],
    icon: 'human-handsup',
  },
  {
    id: 'uttanasana',
    sanskritName: 'Uttānāsana',
    englishName: 'Standing Forward Bend',
    hindiName: 'उत्तानासन',
    category: 'standing',
    difficulty: 'beginner',
    duration: 45,
    isSequence: false,
    tags: ['standing', 'forward fold', 'hamstrings', 'spine', 'calm', 'flexibility'],
    icon: 'human-male-board',
  },
  {
    id: 'marjariasana',
    sanskritName: 'Mārjārīāsana',
    englishName: 'Cat-Cow Stretch',
    hindiName: 'मार्जरासन',
    category: 'prone',
    difficulty: 'beginner',
    duration: 60,
    isSequence: false,
    tags: ['spine', 'warmup', 'back', 'neck', 'flexibility', 'core', 'prone'],
    icon: 'cat',
  },
];

/**
 * Get a single pose by its unique identifier
 */
export function getPoseById(id: string): YogaPose | undefined {
  return yogaPoses.find((pose) => pose.id.toLowerCase() === id.toLowerCase());
}

/**
 * Filter poses by their category (standing, seated, supine, prone, inversion, sequence)
 */
export function getPosesByCategory(category: string): YogaPose[] {
  const normalizedCategory = category.toLowerCase().trim();
  return yogaPoses.filter((pose) => pose.category.toLowerCase() === normalizedCategory);
}

/**
 * Filter poses by difficulty level (beginner, intermediate, advanced)
 */
export function getPosesByDifficulty(difficulty: string): YogaPose[] {
  const normalizedDifficulty = difficulty.toLowerCase().trim();
  return yogaPoses.filter((pose) => pose.difficulty.toLowerCase() === normalizedDifficulty);
}

/**
 * Search poses across Sanskrit name, English name, Hindi name, and tags
 */
export function searchPoses(query: string): YogaPose[] {
  if (!query || query.trim() === '') {
    return yogaPoses;
  }

  const cleanQuery = query.toLowerCase().trim();

  return yogaPoses.filter((pose) => {
    const matchesSanskrit = pose.sanskritName.toLowerCase().includes(cleanQuery);
    const matchesEnglish = pose.englishName.toLowerCase().includes(cleanQuery);
    const matchesHindi = pose.hindiName.toLowerCase().includes(cleanQuery);
    const matchesId = pose.id.toLowerCase().includes(cleanQuery);
    const matchesTags = pose.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));

    return matchesSanskrit || matchesEnglish || matchesHindi || matchesId || matchesTags;
  });
}

export default yogaPoses;
