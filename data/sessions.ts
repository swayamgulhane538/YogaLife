/**
 * YogaLife App Pre-built Yoga Sessions Dataset
 * Curated sessions spanning morning wakeups, stress relief, flexibility flows,
 * Surya Namaskar, meditation, and full body workouts.
 */

export interface YogaSession {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  poseSequence: string[]; // Pose IDs matching data/poses.ts
  icon: string; // MaterialCommunityIcons name
  category: string;
}

export const yogaSessions: YogaSession[] = [
  {
    id: 'morning-yoga',
    name: {
      en: 'Morning Yoga',
      hi: 'प्रातःकालीन योग',
    },
    description: {
      en: 'Awaken your body and mind with gentle morning stretches and grounding postures to start your day energized.',
      hi: 'अपने दिन की शुरुआत ताजगी और ऊर्जा के साथ करने के लिए कोमल खिंचाव और संतुलन वाले आसनों का प्रातःकालीन अभ्यास।',
    },
    difficulty: 'beginner',
    durationMinutes: 15,
    poseSequence: [
      'tadasana',
      'marjariasana',
      'adho-mukha-svanasana',
      'bhujangasana',
      'balasana',
      'shavasana',
    ],
    icon: 'weather-sunset-up',
    category: 'morning',
  },
  {
    id: 'stress-relief',
    name: {
      en: 'Stress Relief',
      hi: 'तनाव मुक्ति',
    },
    description: {
      en: 'Calm your mind, release deep tension from your neck and spine, and soothe the nervous system after a long day.',
      hi: 'दिनभर की थकान दूर करने, गर्दन और पीठ के तनाव को मिटाने और तंत्रिका तंत्र को शांत करने वाला सुखद सत्र।',
    },
    difficulty: 'beginner',
    durationMinutes: 20,
    poseSequence: [
      'balasana',
      'marjariasana',
      'uttanasana',
      'setu-bandhasana',
      'sukhasana',
      'shavasana',
    ],
    icon: 'spa-outline',
    category: 'wellness',
  },
  {
    id: 'flexibility-flow',
    name: {
      en: 'Flexibility Flow',
      hi: 'लचीलापन प्रवाह',
    },
    description: {
      en: 'Deepen hip, hamstring, and shoulder mobility with dynamic standing postures and expansive heart openers.',
      hi: 'कूल्हों, जांघों और कंधों के लचीलेपन को बढ़ाने और शरीर को चुस्त बनाने के लिए ऊर्जावान प्रवाह।',
    },
    difficulty: 'intermediate',
    durationMinutes: 25,
    poseSequence: [
      'tadasana',
      'uttanasana',
      'trikonasana',
      'virabhadrasana-1',
      'virabhadrasana-2',
      'bhujangasana',
      'setu-bandhasana',
      'shavasana',
    ],
    icon: 'run-fast',
    category: 'flexibility',
  },
  {
    id: 'surya-namaskar-practice',
    name: {
      en: 'Surya Namaskar Practice',
      hi: 'सूर्य नमस्कार अभ्यास',
    },
    description: {
      en: 'Traditional sun salutation sequence connecting breath with continuous flow to build heat, stamina, and vitality.',
      hi: 'सांस और शारीरिक गति के अद्भुत तालमेल के साथ ऊर्जा, सहनशक्ति और स्फूर्ति जगाने वाला पारंपरिक सूर्य नमस्कार।',
    },
    difficulty: 'intermediate',
    durationMinutes: 15,
    poseSequence: ['surya-namaskar'],
    icon: 'weather-sunny',
    category: 'cardio',
  },
  {
    id: 'relaxation-meditation',
    name: {
      en: 'Relaxation & Meditation',
      hi: 'विश्राम एवं ध्यान',
    },
    description: {
      en: 'Soothing seated and restorative postures paired with mindful breathwork for deep inner peace and tranquil relaxation.',
      hi: 'गहरी आंतरिक शांति और तनावमुक्ति के लिए शांत बैठने वाले आसनों और श्वास अभ्यास का विशेष सत्र।',
    },
    difficulty: 'beginner',
    durationMinutes: 20,
    poseSequence: [
      'sukhasana',
      'vajrasana',
      'balasana',
      'setu-bandhasana',
      'shavasana',
    ],
    icon: 'meditation',
    category: 'meditation',
  },
  {
    id: 'full-body-workout',
    name: {
      en: 'Full Body Workout',
      hi: 'सम्पूर्ण शरीर योग',
    },
    description: {
      en: 'A comprehensive practice targeting every muscle group, cultivating balance, core strength, stamina, and total vitality.',
      hi: 'शरीर के प्रत्येक अंग को सक्रिय करने, संतुलन, कोर शक्ति और संपूर्ण सहनशक्ति को सशक्त बनाने वाला व्यापक योग अभ्यास।',
    },
    difficulty: 'intermediate',
    durationMinutes: 30,
    poseSequence: [
      'tadasana',
      'vrikshasana',
      'virabhadrasana-1',
      'virabhadrasana-2',
      'trikonasana',
      'uttanasana',
      'adho-mukha-svanasana',
      'bhujangasana',
      'marjariasana',
      'setu-bandhasana',
      'balasana',
      'shavasana',
    ],
    icon: 'arm-flex',
    category: 'strength',
  },
];

/**
 * Get a single session by its unique ID
 */
export function getSessionById(id: string): YogaSession | undefined {
  if (!id) return undefined;
  return yogaSessions.find((session) => session.id.toLowerCase() === id.toLowerCase().trim());
}

/**
 * Get sessions filtered by difficulty (beginner, intermediate, advanced)
 */
export function getSessionsByDifficulty(difficulty: string): YogaSession[] {
  const norm = difficulty.toLowerCase().trim();
  return yogaSessions.filter((session) => session.difficulty.toLowerCase() === norm);
}

/**
 * Get sessions filtered by category (morning, wellness, flexibility, cardio, meditation, strength)
 */
export function getSessionsByCategory(category: string): YogaSession[] {
  const norm = category.toLowerCase().trim();
  return yogaSessions.filter((session) => session.category.toLowerCase() === norm);
}

/**
 * Search sessions across English and Hindi names, descriptions, and categories
 */
export function searchSessions(query: string): YogaSession[] {
  if (!query || query.trim() === '') {
    return yogaSessions;
  }

  const cleanQuery = query.toLowerCase().trim();

  return yogaSessions.filter((session) => {
    const matchesEnName = session.name.en.toLowerCase().includes(cleanQuery);
    const matchesHiName = session.name.hi.toLowerCase().includes(cleanQuery);
    const matchesEnDesc = session.description.en.toLowerCase().includes(cleanQuery);
    const matchesHiDesc = session.description.hi.toLowerCase().includes(cleanQuery);
    const matchesCategory = session.category.toLowerCase().includes(cleanQuery);
    const matchesId = session.id.toLowerCase().includes(cleanQuery);

    return (
      matchesEnName ||
      matchesHiName ||
      matchesEnDesc ||
      matchesHiDesc ||
      matchesCategory ||
      matchesId
    );
  });
}

export default yogaSessions;
