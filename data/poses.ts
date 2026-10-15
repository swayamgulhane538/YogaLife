/**
 * YogaLife App Poses Dataset
 * Comprehensive list of 15 essential yoga poses with metadata, tags, realistic photos, illustrations, and search helpers.
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
  icon: string; // MaterialCommunityIcons or Ionicons name
  thumbnailUrl: string; // Transparent anatomical pose visual
  photoUrl: string; // Realistic high-definition pose photography
}

// Local offline bundled asset illustrations for 100% offline reliability & instant rendering
export const poseLocalImages: Record<string, any> = {
  tadasana: require('@/assets/poses/tadasana.png'),
  vrikshasana: require('@/assets/poses/vrikshasana.png'),
  bhujangasana: require('@/assets/poses/bhujangasana.png'),
  balasana: require('@/assets/poses/balasana.png'),
  trikonasana: require('@/assets/poses/trikonasana.png'),
  vajrasana: require('@/assets/poses/vajrasana.png'),
  'setu-bandhasana': require('@/assets/poses/setu-bandhasana.png'),
  'adho-mukha-svanasana': require('@/assets/poses/adho-mukha-svanasana.png'),
  sukhasana: require('@/assets/poses/sukhasana.png'),
  shavasana: require('@/assets/poses/shavasana.png'),
  'surya-namaskar': require('@/assets/poses/surya-namaskar.png'),
  'virabhadrasana-1': require('@/assets/poses/virabhadrasana-1.png'),
  'virabhadrasana-2': require('@/assets/poses/virabhadrasana-2.png'),
  uttanasana: require('@/assets/poses/uttanasana.png'),
  marjariasana: require('@/assets/poses/marjariasana.png'),
};

/**
 * Helper to get local pose visual asset
 */
export function getPoseImage(id: string): any {
  return poseLocalImages[id] || poseLocalImages['tadasana'];
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
    icon: 'body',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Tadasana_-_Yoga_Art_and_Science.jpg',
    photoUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
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
    icon: 'leaf',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483094/yoga-api/41_veknug.png',
    photoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
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
    icon: 'flame',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483092/yoga-api/35_dytwvz.png',
    photoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
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
    icon: 'flower',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483079/yoga-api/10_wzpo85.png',
    photoUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
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
    icon: 'triangle',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483096/yoga-api/42_jawxqw.png',
    photoUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
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
    icon: 'flash',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483091/yoga-api/31_ozseum.png',
    photoUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
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
    icon: 'infinite',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483074/yoga-api/4_qq6nxw.png',
    photoUrl: 'https://images.unsplash.com/photo-1599447292180-45fd84092dd4?auto=format&fit=crop&w=800&q=80',
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
    icon: 'paw',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483081/yoga-api/15_vkviqn.png',
    photoUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
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
    icon: 'sunny',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483091/yoga-api/31_ozseum.png',
    photoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
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
    icon: 'bed',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483078/yoga-api/11_dczyrp.png',
    photoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
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
    icon: 'partly-sunny',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483095/yoga-api/39_hqj0sa.png',
    photoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
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
    icon: 'shield',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483096/yoga-api/44_dqeayo.png',
    photoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
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
    icon: 'fitness',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483096/yoga-api/45_ehimr1.png',
    photoUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
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
    icon: 'arrow-down',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483093/yoga-api/38_yb3thk.png',
    photoUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
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
    icon: 'repeat',
    thumbnailUrl: 'https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483075/yoga-api/7_a6aspg.png',
    photoUrl: 'https://images.unsplash.com/photo-1599447292180-45fd84092dd4?auto=format&fit=crop&w=800&q=80',
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
