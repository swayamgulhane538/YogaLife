const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pres = new pptxgen();

// Set 16:9 Widescreen layout
pres.layout = 'LAYOUT_16x9';

const FONT_HEAD = 'Times New Roman';
const FONT_BODY = 'Times New Roman';
const COLOR_TITLE = '000000';
const COLOR_TEXT = '222222';
const COLOR_ACCENT = '2D5016'; // Deep forest wellness green
const COLOR_MUTED = '555555';

// Helper to create slide with standard header
function createStandardSlide(titleText) {
  const slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };

  // Underlined Centered Title (matching PDF template)
  slide.addText(titleText, {
    x: 0.5,
    y: 0.4,
    w: 9.0,
    h: 0.7,
    fontFace: FONT_HEAD,
    fontSize: 36,
    bold: true,
    underline: true,
    align: 'center',
    color: COLOR_TITLE,
  });

  // Footer
  slide.addText('Priyadarshini Bhagwati College of Engineering, Nagpur | Department of IT', {
    x: 0.8,
    y: 5.25,
    w: 8.4,
    h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 11,
    color: '888888',
    align: 'center',
  });

  return slide;
}

// -----------------------------------------------------------------------------
// SLIDE 1: Title Slide (matching Page 1 format)
// -----------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };

  // College Header
  slide.addText(
    'Priyadarshini Bhagwati College of Engineering, Nagpur\nDepartment of Information Technology\nSession: 2026-2027',
    {
      x: 0.5,
      y: 0.5,
      w: 9.0,
      h: 1.1,
      fontFace: FONT_HEAD,
      fontSize: 22,
      bold: true,
      align: 'center',
      color: COLOR_TITLE,
      lineSpacingMultiple: 1.2,
    }
  );

  // Decorative Institution Crest Box / Badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: 4.4,
    y: 1.75,
    w: 1.2,
    h: 1.2,
    fill: { color: 'F5F7F5' },
    line: { color: COLOR_ACCENT, width: 2 },
    rectRadius: 0.2,
  });
  slide.addText('🧘\nLTJSS', {
    x: 4.4,
    y: 1.85,
    w: 1.2,
    h: 1.0,
    fontFace: FONT_HEAD,
    fontSize: 16,
    bold: true,
    align: 'center',
    color: COLOR_ACCENT,
  });

  // Seminar Title
  slide.addText('CEP Task Seminar on', {
    x: 0.5,
    y: 3.1,
    w: 9.0,
    h: 0.45,
    fontFace: FONT_HEAD,
    fontSize: 22,
    bold: true,
    align: 'center',
    color: COLOR_TITLE,
  });

  slide.addText('YogaLife — 3D Interactive Yoga &\nWellness Android Application', {
    x: 0.5,
    y: 3.6,
    w: 9.0,
    h: 0.9,
    fontFace: FONT_HEAD,
    fontSize: 26,
    bold: true,
    align: 'center',
    color: COLOR_ACCENT,
    lineSpacingMultiple: 1.1,
  });

  // Footer: Guided by & Presented by (matching PDF Page 1)
  slide.addText('Guided by\n<Guide Name>', {
    x: 0.8,
    y: 4.65,
    w: 4.0,
    h: 0.7,
    fontFace: FONT_HEAD,
    fontSize: 18,
    bold: true,
    align: 'left',
    color: COLOR_TITLE,
    lineSpacingMultiple: 1.2,
  });

  slide.addText('Presented by\nSwayam Gulhane\n<Group Member Names>', {
    x: 5.2,
    y: 4.55,
    w: 4.0,
    h: 0.9,
    fontFace: FONT_HEAD,
    fontSize: 18,
    bold: true,
    align: 'right',
    color: COLOR_TITLE,
    lineSpacingMultiple: 1.2,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 2: Contents (matching Page 2 format)
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Contents');

  const contents = [
    'Introduction',
    'Aim and Objectives',
    'Problem / Issue Identified',
    'Proposed Solution',
    'Application Architecture & Features',
    'Application Screenshots & Demo',
    'Resources Required',
    'Outcome & Future Scope',
  ];

  const items = contents.map((c) => ({
    text: c,
    options: {
      bullet: true,
      fontFace: FONT_BODY,
      fontSize: 22,
      color: COLOR_TEXT,
      lineSpacingMultiple: 1.35,
    },
  }));

  slide.addText(items, {
    x: 1.2,
    y: 1.35,
    w: 7.6,
    h: 3.6,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 3: Introduction (matching Page 3 format)
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Introduction');

  const points = [
    {
      text: 'YogaLife is an interactive 3D mobile wellness platform combining yogic traditions with modern real-time graphics and speech.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Built with React Native, Expo SDK 53, and Three.js to deliver native 60 FPS skeletal animations on Android devices.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Features a 19-bone articulated humanoid mannequin that demonstrates precise posture geometry from 360° angles.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Integrates synchronized bilingual Hindi (हिंदी) and English voice guidance powered by Android Text-To-Speech.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
  ];

  slide.addText(points, {
    x: 0.8,
    y: 1.4,
    w: 8.4,
    h: 3.5,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 4: Aim and Objective (matching Page 4 format)
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Aim and Objective');

  const content = [
    {
      text: 'Aim:',
      options: { bold: true, fontSize: 24, fontFace: FONT_BODY, color: COLOR_ACCENT },
    },
    {
      text: ' To design and develop an interactive 3D Android yoga application offering real-time pose visualization and synchronized bilingual audio instruction.',
      options: { fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 },
    },
    {
      text: '\nObjectives:',
      options: { bold: true, fontSize: 24, fontFace: FONT_BODY, color: COLOR_ACCENT },
    },
    {
      text: 'Construct 3D skeletal humanoid models demonstrating correct biomechanical alignment.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 },
    },
    {
      text: 'Develop a synchronization engine pairing spoken cues with 3D pose transitions.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 },
    },
    {
      text: 'Provide bilingual accessibility across both Hindi and English with live subtitles.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 },
    },
    {
      text: 'Integrate wellness features including Pranayama breathwork and scheduled alarms.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 },
    },
  ];

  slide.addText(content, {
    x: 0.8,
    y: 1.3,
    w: 8.4,
    h: 3.8,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 5: Problem/Issue Identified (matching Page 5 format)
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Problem/Issue Identified');

  const points = [
    {
      text: '2D Visual Limitations: Static images and pre-recorded videos cannot be rotated or viewed from custom angles, obscuring subtle joint placements.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Language Accessibility Barriers: Existing yoga apps primarily provide English narration, excluding millions of native Hindi speakers.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Lack of Real-Time Breath Coordination: Users struggle to pace inhalation and exhalation with physical body movements.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'High Risk of Postural Injury: Practicing without alignment feedback or beginner modifications frequently causes muscular strains.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
  ];

  slide.addText(points, {
    x: 0.8,
    y: 1.4,
    w: 8.4,
    h: 3.6,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 6: Proposed Solution (matching Page 6 format)
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Proposed Solution');

  const points = [
    {
      text: 'Interactive 3D Skeletal Mannequin: 19-bone articulated rig offering 360° touch rotation, pinch-zoom, and 4 perspective presets (Front, Side, Back, Reset).',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Synchronized Bilingual Speech Engine: Dual Hindi & English TTS coordination tying step progression directly to narration timestamps.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Comprehensive 15+ Pose Library: Sanskrit, English, and Hindi names, breathing cues, alignment guidance, benefits, and safety precautions.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Integrated Wellness Ecosystem: Smart practice alarms with loud ringtones, animated Pranayama breath pacing, and persistent streak tracking.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
  ];

  slide.addText(points, {
    x: 0.8,
    y: 1.4,
    w: 8.4,
    h: 3.6,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 7: Screenshots — Home & Pose Library
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Application Screenshots — Home & Library');

  const homePath = path.join(__dirname, 'screen_home.png');
  const libPath = path.join(__dirname, 'screen_library.png');

  if (fs.existsSync(homePath)) {
    slide.addImage({
      path: homePath,
      x: 1.0,
      y: 1.25,
      w: 1.85,
      h: 3.75,
    });
    slide.addText('Home Screen\nStreak, Daily Pose & Quick Start', {
      x: 0.6,
      y: 5.05,
      w: 2.65,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      align: 'center',
      color: COLOR_ACCENT,
    });
  }

  if (fs.existsSync(libPath)) {
    slide.addImage({
      path: libPath,
      x: 3.3,
      y: 1.25,
      w: 1.85,
      h: 3.75,
    });
    slide.addText('Pose Library\nFilter by Category & Difficulty', {
      x: 2.9,
      y: 5.05,
      w: 2.65,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      align: 'center',
      color: COLOR_ACCENT,
    });
  }

  // Key Features Callout Box on Right
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.5,
    y: 1.3,
    w: 3.9,
    h: 3.6,
    fill: { color: 'F7FAF7' },
    line: { color: COLOR_ACCENT, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('Key UI Capabilities:', {
    x: 5.7,
    y: 1.5,
    w: 3.5,
    h: 0.4,
    fontFace: FONT_HEAD,
    fontSize: 20,
    bold: true,
    color: COLOR_ACCENT,
  });

  const featList = [
    { text: 'Dynamic bilingual greeting and flame streak counter.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: 'One-tap Hindi (हिंदी) and English language toggle switch.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: 'Live search bar across Sanskrit and Hindi keywords.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: 'Filter chips for Standing, Seated, Prone & Inversion poses.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: 'Direct access to Pranayama breathwork & meditation.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
  ];

  slide.addText(featList, {
    x: 5.7,
    y: 1.95,
    w: 3.5,
    h: 2.8,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 8: Screenshots — Practice & Progress Analytics
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Application Screenshots — Practice & Progress');

  const pracPath = path.join(__dirname, 'screen_practice.png');
  const progPath = path.join(__dirname, 'screen_progress.png');

  if (fs.existsSync(pracPath)) {
    slide.addImage({
      path: pracPath,
      x: 1.0,
      y: 1.25,
      w: 1.85,
      h: 3.75,
    });
    slide.addText('Practice Sessions\nCurated Multi-Pose Flows', {
      x: 0.6,
      y: 5.05,
      w: 2.65,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      align: 'center',
      color: COLOR_ACCENT,
    });
  }

  if (fs.existsSync(progPath)) {
    slide.addImage({
      path: progPath,
      x: 3.3,
      y: 1.25,
      w: 1.85,
      h: 3.75,
    });
    slide.addText('Progress Tracker\nHeatmap & 7-Day Analytics', {
      x: 2.9,
      y: 5.05,
      w: 2.65,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      align: 'center',
      color: COLOR_ACCENT,
    });
  }

  // Analytics Callout Box on Right
  slide.addShape(pres.ShapeType.roundRect, {
    x: 5.5,
    y: 1.3,
    w: 3.9,
    h: 3.6,
    fill: { color: 'F7FAF7' },
    line: { color: COLOR_ACCENT, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('Practice & Tracking Flow:', {
    x: 5.7,
    y: 1.5,
    w: 3.5,
    h: 0.4,
    fontFace: FONT_HEAD,
    fontSize: 20,
    bold: true,
    color: COLOR_ACCENT,
  });

  const featList = [
    { text: '6 Curated flows: Morning Yoga, Stress Relief & Surya Namaskar.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: 'Duration & difficulty tags for structured yogic routines.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: '30-Day calendar heatmap tracking daily consistency.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: 'Dynamic weekly practice chart with total minutes practiced.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
    { text: 'Persistent storage retention with AsyncStorage.', options: { bullet: true, fontSize: 16, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 } },
  ];

  slide.addText(featList, {
    x: 5.7,
    y: 1.95,
    w: 3.5,
    h: 2.8,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 9: Screenshots — 3D Pose Detail & Interactive Viewer
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Application Screenshots — 3D Pose Viewer');

  const detailPath = path.join(__dirname, 'screen_pose_detail.png');

  if (fs.existsSync(detailPath)) {
    slide.addImage({
      path: detailPath,
      x: 1.2,
      y: 1.25,
      w: 1.85,
      h: 3.75,
    });
    slide.addText('Pose Detail & 3D Viewer\nTadasana (Mountain Pose)', {
      x: 0.7,
      y: 5.05,
      w: 2.85,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 12,
      bold: true,
      align: 'center',
      color: COLOR_ACCENT,
    });
  }

  // 3D Engine Details Callout Box on Right
  slide.addShape(pres.ShapeType.roundRect, {
    x: 3.6,
    y: 1.3,
    w: 5.8,
    h: 3.6,
    fill: { color: 'F7FAF7' },
    line: { color: COLOR_ACCENT, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('3D Engine & Guidance Features:', {
    x: 3.9,
    y: 1.5,
    w: 5.2,
    h: 0.4,
    fontFace: FONT_HEAD,
    fontSize: 20,
    bold: true,
    color: COLOR_ACCENT,
  });

  const detailList = [
    { text: 'Real-time 3D Canvas rendering at 60 FPS using Expo-GL & Three.js.', options: { bullet: true, fontSize: 17, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 } },
    { text: 'Touch Orbit Controls: Drag for 360° rotation and pinch to zoom in/out.', options: { bullet: true, fontSize: 17, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 } },
    { text: 'Camera Presets: Front, Side, and Rear angle buttons for quick alignment check.', options: { bullet: true, fontSize: 17, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 } },
    { text: 'Four segmented tabs: Instructions, Yogic Benefits, Alignment, Precautions.', options: { bullet: true, fontSize: 17, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 } },
    { text: 'One-click "Start Guided Tutorial" for voice-synchronized guided practice.', options: { bullet: true, fontSize: 17, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.25 } },
  ];

  slide.addText(detailList, {
    x: 3.9,
    y: 1.95,
    w: 5.2,
    h: 2.8,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 10: Resources Required (matching Page 7 format)
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Resources Required');

  const content = [
    {
      text: 'Software Requirements:',
      options: { bold: true, fontSize: 24, fontFace: FONT_BODY, color: COLOR_ACCENT },
    },
    {
      text: 'Operating System: Windows 11 / Linux / macOS for cross-platform development.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 },
    },
    {
      text: 'Frontend & Runtime: React Native, Expo SDK 53, and Node.js v24.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 },
    },
    {
      text: '3D Graphics Engine: Three.js with Expo-GL WebGL context bindings.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 },
    },
    {
      text: 'Audio & Speech: Android native Text-To-Speech API (expo-speech) and Expo-AV.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 },
    },
    {
      text: '\nHardware Requirements:',
      options: { bold: true, fontSize: 24, fontFace: FONT_BODY, color: COLOR_ACCENT },
    },
    {
      text: 'Target Device: Mid-range Android smartphone (Android 9.0+, 3GB+ RAM, WebGL 2.0).',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 },
    },
    {
      text: 'Development Machine: Quad-core 64-bit processor, 8GB+ RAM, 20GB free storage.',
      options: { bullet: true, fontSize: 22, fontFace: FONT_BODY, color: COLOR_TEXT, lineSpacingMultiple: 1.2 },
    },
  ];

  slide.addText(content, {
    x: 0.8,
    y: 1.2,
    w: 8.4,
    h: 3.9,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 11: Outcome (matching Page 8 format)
// -----------------------------------------------------------------------------
{
  const slide = createStandardSlide('Outcome');

  const points = [
    {
      text: 'Delivered an interactive, production-ready 3D Android yoga learning platform with 15+ verified asana models.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Successfully unified skeletal 3D character animation with synchronized bilingual Hindi & English speech narration.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Eliminated dependencies on paid AI voice APIs by utilizing Android native speech synthesis engines.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
    {
      text: 'Deployed live production web build (https://dist-navy-nu-38.vercel.app) with full multi-device accessibility.',
      options: { bullet: true, fontFace: FONT_BODY, fontSize: 22, color: COLOR_TEXT, lineSpacingMultiple: 1.3 },
    },
  ];

  slide.addText(points, {
    x: 0.8,
    y: 1.4,
    w: 8.4,
    h: 3.6,
  });
}

// -----------------------------------------------------------------------------
// SLIDE 12: Thank You (matching Page 8 template)
// -----------------------------------------------------------------------------
{
  const slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };

  slide.addText('Thank You', {
    x: 0.5,
    y: 1.5,
    w: 9.0,
    h: 1.0,
    fontFace: FONT_HEAD,
    fontSize: 48,
    bold: true,
    underline: true,
    align: 'center',
    color: COLOR_TITLE,
  });

  slide.addText('Questions & Discussion', {
    x: 0.5,
    y: 2.6,
    w: 9.0,
    h: 0.6,
    fontFace: FONT_BODY,
    fontSize: 24,
    italic: true,
    align: 'center',
    color: COLOR_ACCENT,
  });

  slide.addShape(pres.ShapeType.line, {
    x: 3.5,
    y: 3.4,
    w: 3.0,
    h: 0,
    line: { color: COLOR_ACCENT, width: 2 },
  });

  slide.addText(
    'Priyadarshini Bhagwati College of Engineering, Nagpur\nDepartment of Information Technology\nSession: 2026-2027\n\nProject: YogaLife — 3D Interactive Yoga & Wellness Android App\nLive Demo: https://dist-navy-nu-38.vercel.app',
    {
      x: 0.5,
      y: 3.7,
      w: 9.0,
      h: 1.5,
      fontFace: FONT_BODY,
      fontSize: 16,
      align: 'center',
      color: COLOR_MUTED,
      lineSpacingMultiple: 1.25,
    }
  );
}

// Output PPTX file
const outputPath = path.join(__dirname, 'YogaLife_CEP_Seminar_Presentation.pptx');
pres.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`Presentation generated successfully at: ${outputPath}`);
  })
  .catch((err) => {
    console.error('Error generating presentation:', err);
  });
