# 🧘 YogaLife — 3D Interactive Yoga & Wellness Android App

> A premium, interactive 3D yoga learning and wellness mobile application built with **React Native**, **Expo SDK 53**, and **Three.js**. Features realistic 3D skeletal animations for 15+ yoga poses and synchronized bilingual Hindi & English voice guidance.

---

## 🌟 Key Features

### 1. 🚶 Realistic 3D Yoga Pose Engine
- **Skeletal Articulation**: 19-bone articulated human figure with realistic bone hierarchy and smooth mesh skinning (~2,200 polygons optimized for 60fps on mobile devices).
- **Biomechanical Keyframes**: Custom Euler rotation and translation keyframes for all 15 yoga poses.
- **Dynamic Loops & Sequences**: Full looping transitions for movement-based poses (*Marjariasana / Cat-Cow*) and continuous sequences (*Surya Namaskar*).
- **Interactive Camera Controls**: Touch pan to rotate 360°, pinch to zoom, and one-tap perspective buttons (**Front**, **Side**, **Back**, **Reset**).
- **Playback Controls**: Play, Pause, Replay, Speed selector (`0.5x`, `1.0x`, `1.5x`, `2.0x`), and Step progress scrubber.

### 2. 📚 Comprehensive Yoga Pose Library
Features 15 core poses with Sanskrit, English, and Hindi names:
1. **Tadasana** — Mountain Pose — ताड़ासन
2. **Vrikshasana** — Tree Pose — वृक्षासन
3. **Bhujangasana** — Cobra Pose — भुजंगासन
4. **Balasana** — Child's Pose — बालासन
5. **Trikonasana** — Triangle Pose — त्रिकोणासन
6. **Vajrasana** — Thunderbolt Pose — वज्रासन
7. **Setu Bandhasana** — Bridge Pose — सेतुबंधासन
8. **Adho Mukha Svanasana** — Downward-Facing Dog — अधोमुख श्वानासन
9. **Sukhasana** — Easy Pose — सुखासन
10. **Shavasana** — Corpse Pose — शवासन
11. **Surya Namaskar** — Sun Salutation (12-step sequence) — सूर्य नमस्कार
12. **Virabhadrasana I** — Warrior I — वीरभद्रासन-1
13. **Virabhadrasana II** — Warrior II — वीरभद्रासन-2
14. **Uttanasana** — Standing Forward Bend — उत्तानासन
15. **Marjariasana** — Cat-Cow Pose — मार्जरासन

Each pose provides:
- Step-by-step instructions with breath timing cues
- Anatomical and therapeutic benefits
- Common mistakes & alignment checkpoints
- Safety precautions & contraindications
- Beginner-friendly modifications

### 3. 🇮🇳 Bilingual Hindi & English Voice Guidance
- **Native Android Text-to-Speech**: Natural-sounding speech guidance in both Hindi (`hi-IN`) and English (`en-US`) without requiring paid third-party APIs.
- **Synchronized Subtitles**: Spoken cues trigger step advances via TTS lifecycle events, locking voice, subtitles, and 3D animations in sync.
- **Bilingual Language Switcher**: Instant toggle between 🇮🇳 हिंदी and English across the entire application.

### 4. ⏰ Smart Practice Reminders & Alarms
- Scheduled repeating weekly notification alarms using Android high-priority channels.
- Loud ambient ringtone options (Temple Bell, Wind Chimes, Bamboo Flute, Nature, Om).

### 5. 📊 Practice Tracking & Wellness Tools
- Streak tracking with flame counter.
- 30-day activity heatmap grid & 7-day weekly practice charts.
- **Pranayama (Breathwork)**: Animated expanding/contracting circle with guided Box Breathing and 4-7-8 techniques.
- **Guided Meditation**: Mindfulness timer with soothing affirmations.

---

## 🎨 Theme Palette

- **Sage Green**: `#8FBC8F`
- **Deep Forest Green**: `#2D5016`
- **Dark Forest**: `#1A3A0A`
- **Warm Cream**: `#FFF8DC`
- **Soft Ivory**: `#FFFFF0`
- **Muted Gold**: `#B8860B`
- **Soft Green Background**: `#F0F7F0`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on your Android device (optional for mobile testing)

### Installation
```bash
# Clone the repository
git clone https://github.com/swayamgulhane538/YogaLife.git

# Navigate to project directory
cd YogaLife

# Install dependencies
npm install --legacy-peer-deps
```

### Running the App
```bash
# Start the Expo development server
npx expo start

# Open on Android device via Expo Go
# Scan the terminal QR code or enter exp://<your-local-ip>:8081

# Open in Web Browser
npx expo start --web
```

### Building Standalone Android APK (EAS Build)
```bash
# Login to EAS
npx eas-cli login

# Build APK
npx eas-cli build --profile preview --platform android
```

---

## 📁 Project Structure

```text
├── app/                      # Expo Router file-based screens
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── index.tsx         # Home screen with daily pose & stats
│   │   ├── library.tsx       # Searchable pose library & filters
│   │   ├── practice.tsx      # Curated practice sessions
│   │   ├── progress.tsx      # Practice history & heatmap
│   │   └── settings.tsx      # Language, alarms, voice settings
│   ├── pose/[id].tsx         # 3D Pose viewer & detailed guide
│   ├── session/[id].tsx      # Synchronized 3D session player
│   ├── breathing.tsx         # Pranayama breathwork visualizer
│   └── meditation.tsx        # Guided meditation timer
├── components/
│   ├── 3d/                   # HumanoidModel, YogaScene, CameraControls
│   ├── voice/                # VoiceGuidance, VoiceControls, Subtitles
│   ├── ui/                   # ThemedCard, StepIndicator, LanguageSelector
│   └── alarm/                # AlarmScheduler, RingtonePlayer
├── data/
│   ├── poses.ts              # 15+ Pose database
│   ├── instructions.ts       # Bilingual Hindi/English instructions
│   ├── animations.ts         # Biomechanical 3D keyframe clips
│   └── sessions.ts           # Curated practice routines
├── stores/                   # Zustand stores with AsyncStorage persistence
└── utils/                    # TTS engine, SyncEngine, theme tokens
```

---

## 📄 License

MIT License. Designed with wellness in mind.
