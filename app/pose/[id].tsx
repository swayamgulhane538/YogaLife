import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { getPoseById, yogaPoses, getPoseImage } from '@/data/poses';
import { getInstructionsForPose, poseInstructions } from '@/data/instructions';
import { YogaScene } from '@/components/3d/YogaScene';

const { height } = Dimensions.get('window');
const SCENE_HEIGHT = Math.min(380, Math.max(300, Math.round(height * 0.42)));

type DetailTab = 'instructions' | 'benefits' | 'alignment' | 'precautions';

// Comprehensive authentic benefits, alignment points, and precautions dataset
const POSE_DETAILS_EXT: Record<
  string,
  {
    benefits: { en: string[]; hi: string[] };
    alignment: { en: string[]; hi: string[] };
    precautions: { en: string[]; hi: string[] };
    modifications: { en: string[]; hi: string[] };
  }
> = {
  tadasana: {
    benefits: {
      en: [
        'Improves posture and spinal alignment',
        'Strengthens thighs, knees, and ankles',
        'Firms abdomen and glutes',
        'Reduces flat feet and balances energy flow',
      ],
      hi: [
        'रीढ़ की हड्डी और शारीरिक मुद्रा में सुधार करता है',
        'जांघों, घुटनों और टखनों को मजबूती देता है',
        'पेट और नितंबों की मांसपेशियों को सुदृढ़ करता है',
        'शारीरिक संतुलन और ऊर्जा प्रवाह को बढ़ाता है',
      ],
    },
    alignment: {
      en: [
        'Ground through all 4 corners of both feet',
        'Engage quadriceps and lift kneecaps gently',
        'Lengthen the tailbone down toward the heels',
        'Roll shoulder blades down and broad across the chest',
      ],
      hi: [
        'दोनों पैरों के चारों कोनों पर समान वजन रखें',
        'जांघों को सक्रिय कर घुटनों को ऊपर खींचें',
        'मेरूदंड को सीधा और कंधों को ढीला रखें',
        'छाती को खोलें और दोनों भुजाओं को सीधा रखें',
      ],
    },
    precautions: {
      en: [
        'Avoid prolonged holding if experiencing insomnia or severe headache',
        'Keep feet hip-width apart if balance is unstable',
      ],
      hi: [
        'सिरदर्द या चक्कर आने की स्थिति में ज्यादा देर न रुकें',
        'संतुलन न बने तो पैरों में हल्का फासला रखें',
      ],
    },
    modifications: {
      en: ['Stand with back against a flat wall for verified postural feedback'],
      hi: ['शुरुआत में दीवार के सहारे खड़े होकर अभ्यास करें'],
    },
  },
  vrikshasana: {
    benefits: {
      en: [
        'Enhances physical balance and mental focus',
        'Strengthens calves, ankles, and spine',
        'Opens hips and stretches groin and inner thighs',
        'Relieves mild sciatica symptoms',
      ],
      hi: [
        'शारीरिक संतुलन और एकाग्रता का विकास करता है',
        'पिंडलियों, टखनों और रीढ़ को सुदृढ़ करता है',
        'कूल्हों को खोलता है और जांघों को लचीला बनाता है',
        'साइटिका के हल्के दर्द में लाभकारी है',
      ],
    },
    alignment: {
      en: [
        'Place sole of foot against inner thigh or calf—never directly on the knee joint',
        'Press standing foot firmly into the earth',
        'Keep hips squared evenly facing forward',
        'Fix your gaze softly on an unmoving focal point (drishti)',
      ],
      hi: [
        'उठे हुए पैर के तलवे को जांघ या पिंडली पर रखें, घुटने के जोड़ पर बिल्कुल न रखें',
        'नीचे वाले पैर को भूमि पर दृढ़ता से टिकाएं',
        'कूल्हों को सामने की दिशा में सीधा रखें',
        'सामने किसी स्थिर बिंदु पर दृष्टि एकाग्र रखें',
      ],
    },
    precautions: {
      en: [
        'Avoid raising arms if you have high blood pressure',
        'Do not practice if suffering from acute knee injury',
      ],
      hi: [
        'उच्च रक्तचाप होने पर हाथों को सिर के ऊपर न उठाएं',
        'घुटने में गंभीर चोट हो तो अभ्यास से बचें',
      ],
    },
    modifications: {
      en: ['Rest one hand against a wall or sturdy chair for balance support'],
      hi: ['शुरुआत में दीवार या कुर्सी का सहारा ले सकते हैं'],
    },
  },
  bhujangasana: {
    benefits: {
      en: [
        'Strengthens spine and invigorates spinal nerves',
        'Stretches chest, lungs, shoulders, and abdomen',
        'Stimulates abdominal organs and aids digestion',
        'Helps relieve stress and fatigue',
      ],
      hi: [
        'मेरूदंड को मजबूत और लचीला बनाता है',
        'छाती, फेफड़ों और कंधों का फैलाव करता है',
        'पाचन तंत्र को सक्रिय करता है',
        'मानसिक तनाव और थकान को दूर करता है',
      ],
    },
    alignment: {
      en: [
        'Keep tops of feet pressing firmly into the mat',
        'Elbows tucked close to your ribs, shoulders away from ears',
        'Use back strength rather than pushing solely with hands',
        'Keep the back of your neck long—do not crunch backward',
      ],
      hi: [
        'पैरों के पंजों को जमीन पर सटाकर रखें',
        'कोहनियों को पसलियों के पास रखें, कंधों को ढीला छोड़ें',
        'हाथों के बल के बजाय पीठ की मांसपेशियों से ऊपर उठें',
        'गर्दन को सामान्य रूप से पीछे ले जाएं, झटका न दें',
      ],
    },
    precautions: {
      en: [
        'Avoid during pregnancy or acute abdominal surgery recovery',
        'Limit depth of arch if experiencing acute back pain',
      ],
      hi: [
        'गर्भावस्था या पेट की सर्जरी के बाद इसका अभ्यास न करें',
        'पीठ में तीव्र दर्द हो तो ज्यादा पीछे न झुकें',
      ],
    },
    modifications: {
      en: ['Practice Sphinx Pose (forearms on floor) for a milder lumbar curve'],
      hi: ['कोहनियों को जमीन पर रखकर सरल भुजंगासन का अभ्यास करें'],
    },
  },
};

// Generic fallback generator for poses not explicitly listed above
function getPoseDetailsFallback(pose: any) {
  return {
    benefits: {
      en: [
        'Strengthens the musculoskeletal core and improves flexibility',
        'Promotes deep breathing, relaxation, and mental clarity',
        'Stimulates circulation and vital organ function',
        'Balances energy centers and cultivates mind-body awareness',
      ],
      hi: [
        'मांसपेशियों और जोड़ों को मजबूत व लचीला बनाता है',
        'गहरे श्वास, तनाव मुक्ति और मानसिक स्पष्टता को बढ़ावा देता है',
        'रक्त संचार और आंतरिक अंगों की कार्यप्रणाली में सुधार करता है',
        'शरीर और मन के बीच संतुलन स्थापित करता है',
      ],
    },
    alignment: {
      en: [
        'Maintain a steady, neutral spine without excessive strain',
        'Sync every movement smoothly with gentle inhalation and exhalation',
        'Distribute weight symmetrically across all contact points',
        'Listen to your body and honor natural physical boundaries',
      ],
      hi: [
        'रीढ़ को सीधा और संतुलित बनाए रखें, किसी भी जोड़ पर अत्यधिक दबाव न डालें',
        'प्रत्येक गतिविधि को धीमी और गहरी सांस के साथ जोड़ें',
        'शरीर के वजन को दोनों तरफ समान रूप से बांटें',
        'अपनी शारीरिक क्षमता का ध्यान रखते हुए ही खिंचाव दें',
      ],
    },
    precautions: {
      en: [
        'Consult your physician if recovering from recent injury or surgery',
        'Discontinue immediately if you experience sharp pain or dizziness',
      ],
      hi: [
        'हाल ही में चोट या सर्जरी हुई हो तो चिकित्सक से परामर्श लें',
        'तीव्र दर्द या चक्कर आने पर तुरंत विश्राम करें',
      ],
    },
    modifications: {
      en: ['Use a yoga block or cushion for additional support and ease'],
      hi: ['योग ब्लॉक या तकिये का सहारा लेकर मुद्रा को सुगम बनाएं'],
    },
  };
}

export default function PoseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language } = useLanguageStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const [activeTab, setActiveTab] = useState<DetailTab>('instructions');
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

  const pose = useMemo(() => {
    return getPoseById(id as string) || yogaPoses[0];
  }, [id]);

  const instructionsData = useMemo(() => {
    return getInstructionsForPose(pose.id);
  }, [pose.id]);

  const detailsExt = useMemo(() => {
    return POSE_DETAILS_EXT[pose.id] || getPoseDetailsFallback(pose);
  }, [pose.id, pose]);

  const favorite = isFavorite(pose.id);

  const getBreatheIcon = (breathe?: string): keyof typeof Ionicons.glyphMap => {
    switch (breathe) {
      case 'inhale':
        return 'arrow-up-circle-outline';
      case 'exhale':
        return 'arrow-down-circle-outline';
      case 'hold':
        return 'pause-circle-outline';
      default:
        return 'refresh-circle-outline';
    }
  };

  const getBreatheText = (breathe?: string) => {
    switch (breathe) {
      case 'inhale':
        return t('Inhale', 'श्वास लें');
      case 'exhale':
        return t('Exhale', 'श्वास छोड़ें');
      case 'hold':
        return t('Hold', 'रोकें');
      default:
        return t('Normal Breath', 'सामान्य श्वास');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.deepForest} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerSanskrit} numberOfLines={1}>
              {pose.sanskritName}
            </Text>
            <Text style={styles.headerEnglish} numberOfLines={1}>
              {language === 'hi' ? pose.hindiName : pose.englishName}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => toggleFavorite(pose.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={favorite ? Colors.error : Colors.deepForest}
            />
          </TouchableOpacity>
        </View>

        {/* View Mode Toggle: Real Pose Photo vs 3D Scene */}
        <View style={styles.viewModeToggleRow}>
          <TouchableOpacity
            style={[styles.viewModeBtn, viewMode === 'photo' && styles.viewModeBtnActive]}
            onPress={() => setViewMode('photo')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="image-outline"
              size={15}
              color={viewMode === 'photo' ? '#FFFFFF' : Colors.deepForest}
            />
            <Text
              style={[
                styles.viewModeText,
                viewMode === 'photo' && styles.viewModeTextActive,
              ]}
            >
              {t('Pose Photo', 'आसन फोटो')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewModeBtn, viewMode === '3d' && styles.viewModeBtnActive]}
            onPress={() => setViewMode('3d')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="cube-outline"
              size={15}
              color={viewMode === '3d' ? '#FFFFFF' : Colors.deepForest}
            />
            <Text
              style={[
                styles.viewModeText,
                viewMode === '3d' && styles.viewModeTextActive,
              ]}
            >
              {t('3D Interactive', '3D मॉडल')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scene / Photo Interactive Preview */}
        <View style={[styles.sceneContainer, { height: SCENE_HEIGHT }]}>
          {viewMode === 'photo' ? (
            <View style={styles.photoContainer}>
              <Image
                source={getPoseImage(pose.id)}
                style={styles.posePhoto}
                resizeMode="contain"
              />
            </View>
          ) : (
            <YogaScene
              poseId={pose.id}
              isPlaying={true}
              speed={1.0}
              showCameraControls={true}
              style={styles.sceneCanvas}
            />
          )}
        </View>

        {/* Tabs Bar */}
        <View style={styles.tabBar}>
          {(['instructions', 'benefits', 'alignment', 'precautions'] as DetailTab[]).map(
            (tab) => {
              const isActive = activeTab === tab;
              const tabLabels: Record<DetailTab, { en: string; hi: string }> = {
                instructions: { en: 'Guide', hi: 'निर्देश' },
                benefits: { en: 'Benefits', hi: 'लाभ' },
                alignment: { en: 'Alignment', hi: 'संरेखण' },
                precautions: { en: 'Safety', hi: 'सावधानी' },
              };

              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {t(tabLabels[tab].en, tabLabels[tab].hi)}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {/* Tab Content Section */}
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentPadding}
          showsVerticalScrollIndicator={false}
        >
          {/* Tab 1: Instructions */}
          {activeTab === 'instructions' && (
            <View style={styles.tabPane}>
              {instructionsData.steps.map((step, idx) => (
                <View key={`step-${idx}`} style={styles.stepCard}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumBadge}>
                      <Text style={styles.stepNumText}>{step.stepNumber || idx + 1}</Text>
                    </View>
                    <View style={styles.breatheTag}>
                      <Ionicons
                        name={getBreatheIcon(step.breathe)}
                        size={14}
                        color={Colors.deepForest}
                      />
                      <Text style={styles.breatheTagText}>
                        {getBreatheText(step.breathe)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.stepText}>
                    {language === 'hi' ? step.textHi : step.textEn}
                  </Text>
                  {Boolean(step.bodyFocus) && (
                    <Text style={styles.stepFocus}>
                      🎯 {t('Focus', 'ध्यान')}:{' '}
                      {language === 'hi' ? step.bodyFocusHi || step.bodyFocus : step.bodyFocus}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Tab 2: Benefits */}
          {activeTab === 'benefits' && (
            <View style={styles.tabPane}>
              {(language === 'hi'
                ? detailsExt.benefits.hi
                : detailsExt.benefits.en
              ).map((benefit, i) => (
                <View key={`benefit-${i}`} style={styles.bulletRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Colors.success}
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.bulletText}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tab 3: Alignment */}
          {activeTab === 'alignment' && (
            <View style={styles.tabPane}>
              {(language === 'hi'
                ? detailsExt.alignment.hi
                : detailsExt.alignment.en
              ).map((cue, i) => (
                <View key={`align-${i}`} style={styles.bulletRow}>
                  <Ionicons
                    name="compass-outline"
                    size={18}
                    color={Colors.deepForest}
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.bulletText}>{cue}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tab 4: Precautions & Modifications */}
          {activeTab === 'precautions' && (
            <View style={styles.tabPane}>
              <Text style={styles.subHeading}>{t('Precautions', 'सावधानियां')}</Text>
              {(language === 'hi'
                ? detailsExt.precautions.hi
                : detailsExt.precautions.en
              ).map((precaution, i) => (
                <View key={`prec-${i}`} style={styles.bulletRow}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={Colors.error}
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.bulletText}>{precaution}</Text>
                </View>
              ))}

              <Text style={[styles.subHeading, { marginTop: 16 }]}>
                {t('Beginner Modifications', 'शुरुआती रूपांतरण')}
              </Text>
              {(language === 'hi'
                ? detailsExt.modifications.hi
                : detailsExt.modifications.en
              ).map((mod, i) => (
                <View key={`mod-${i}`} style={styles.bulletRow}>
                  <Ionicons
                    name="bulb-outline"
                    size={18}
                    color={Colors.mutedGold}
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.bulletText}>{mod}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push(`/session/${pose.id}`)}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.ctaButtonText}>
              {t('Start Guided Tutorial', 'मार्गदर्शित ट्यूटोरियल शुरू करें')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.softGreenBg,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerSanskrit: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  headerEnglish: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  viewModeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3FAF3',
    borderBottomWidth: 1,
    borderBottomColor: '#DFEADF',
  },
  viewModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8DEC8',
  },
  viewModeBtnActive: {
    backgroundColor: Colors.deepForest,
    borderColor: Colors.deepForest,
  },
  viewModeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  sceneContainer: {
    width: '100%',
    backgroundColor: '#FAF5ED',
    overflow: 'hidden',
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  posePhoto: {
    width: '90%',
    height: '90%',
  },
  sceneCanvas: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EFE6',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.deepForest,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.deepForest,
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 24,
  },
  tabPane: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.deepForest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  breatheTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.softGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  breatheTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  stepText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  stepFocus: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.deepForest,
    marginBottom: 4,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: '#E6EFE6',
  },
  ctaButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.deepForest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
