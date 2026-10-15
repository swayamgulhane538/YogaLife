import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';
import { yogaPoses, getPoseById, getPoseImage } from '@/data/poses';
import { yogaSessions } from '@/data/sessions';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

const INSPIRATIONAL_QUOTES = [
  {
    en: 'A little practice, often, is more valuable than a perfect practice.',
    hi: 'नियमित रूप से किया गया थोड़ा सा अभ्यास, कभी-कभार किए गए परिपूर्ण अभ्यास से कहीं अधिक मूल्यवान है।',
  },
  {
    en: 'Yoga is the journey of the self, through the self, to the self.',
    hi: 'योग स्वयं की, स्वयं के माध्यम से, स्वयं तक की आंतरिक यात्रा है।',
  },
  {
    en: 'Inhale the future with confidence, exhale the past with gratitude.',
    hi: 'विश्वास के साथ भविष्य को श्वास में भरें, कृतज्ञता के साथ अतीत को विसर्जित करें।',
  },
  {
    en: 'Quiet the mind, soften your shoulders, and the soul will speak.',
    hi: 'मन को शांत करें, कंधों को शिथिल करें, और आत्मा की आवाज़ सुनें।',
  },
  {
    en: 'Be gentle with yourself. You are doing the best you can today.',
    hi: 'स्वयं के प्रति कोमल रहें। आज आप अपना सर्वश्रेष्ठ प्रयास कर रहे हैं।',
  },
];

export default function HomeScreen() {
  const { t, language } = useLanguageStore();
  const { user, isLoggedIn } = useAuthStore();
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const getTodayPracticeTime = useProgressStore((state) => state.getTodayPracticeTime);
  const history = useProgressStore((state) => state.history);

  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
  };

  const currentQuote = INSPIRATIONAL_QUOTES[quoteIndex];

  // Daily recommended pose
  const dailyPose = useMemo(() => {
    const day = new Date().getDate();
    const index = (day * 3) % yogaPoses.length;
    return yogaPoses[index] || yogaPoses[0];
  }, []);

  // Popular poses for quick start
  const popularPoses = useMemo(() => {
    const targetIds = ['tadasana', 'vrikshasana', 'bhujangasana', 'trikonasana', 'shavasana'];
    return targetIds
      .map((id) => getPoseById(id))
      .filter((pose): pose is typeof yogaPoses[0] => Boolean(pose));
  }, []);

  const todayMinutes = Math.round(getTodayPracticeTime() / 60);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar matching Lovable Brand */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.brandIconWrap}>
              <Ionicons name="flower" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandText}>
                yoga<Text style={styles.brandSub}>life</Text>
              </Text>
              <Text style={styles.brandTagline}>
                {t('awareness & balance', 'जागरूकता एवं संतुलन')}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <LanguageSelector variant="compact" />
            <TouchableOpacity
              style={styles.profileBadge}
              onPress={() => {
                if (isLoggedIn && user && !user.isGuest) {
                  router.push('/(tabs)/settings');
                } else {
                  router.push('/login' as any);
                }
              }}
              accessibilityLabel={t('User Profile / Login', 'उपयोगकर्ता प्रोफ़ाइल / लॉगिन')}
              activeOpacity={0.7}
            >
              {isLoggedIn && user && !user.isGuest ? (
                <Text style={styles.profileInitial}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <Ionicons name="person-outline" size={16} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO SECTION matching Lovable (d-yoga-flow) */}
        <View style={styles.heroCard}>
          <View style={styles.eyebrowRow}>
            <Ionicons name="leaf" size={13} color={Colors.primary} />
            <Text style={styles.eyebrowText}>
              {t('Your daily wellness companion', 'आपका दैनिक स्वास्थ्य साथी 🌿')}
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            {t('Find Your Balance,', 'अपना संतुलन खोजें,')}
            {'\n'}
            <Text style={styles.heroTitleItalic}>
              {t('Transform Your Life.', 'जीवन रूपांतरित करें।')}
            </Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            {t(
              'Discover yoga, improve your well-being, and build a healthier lifestyle—one breath at a time.',
              'योग को अपनाएं, शारीरिक व मानसिक स्वास्थ्य सुधारें और हर श्वास के साथ स्वस्थ जीवन बनाएं।'
            )}
          </Text>

          {/* Hero Action Buttons */}
          <View style={styles.heroButtonsRow}>
            <TouchableOpacity
              style={styles.heroPrimaryBtn}
              onPress={() => router.push('/(tabs)/practice')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroPrimaryBtnText}>
                {t('Start Yoga Journey', 'अभ्यास शुरू करें')}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryBtn}
              onPress={() => router.push('/(tabs)/library')}
              activeOpacity={0.85}
            >
              <Ionicons name="play-outline" size={15} color={Colors.primary} />
              <Text style={styles.heroSecondaryBtnText}>
                {t('Explore Poses', 'आसन देखें')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Proof Avatar Stack */}
          <View style={styles.heroSocialRow}>
            <View style={styles.avatarStack}>
              <View style={[styles.miniAvatar, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="sparkles" size={12} color={Colors.primary} />
              </View>
              <View style={[styles.miniAvatar, { backgroundColor: '#FFF3E0', marginLeft: -8 }]}>
                <Ionicons name="flame" size={12} color="#F57C00" />
              </View>
              <View style={[styles.miniAvatar, { backgroundColor: '#E3F2FD', marginLeft: -8 }]}>
                <Ionicons name="heart" size={12} color="#0288D1" />
              </View>
            </View>
            <Text style={styles.heroSocialText}>
              {t('Every body. Every level.', 'हर शरीर। हर स्तर।')}{' '}
              <Text style={styles.heroSocialBold}>{t('Your pace.', 'आपकी गति।')}</Text>
            </Text>
          </View>

          {/* Hero Floating Banner */}
          <View style={styles.heroFloatCard}>
            <View style={styles.heroFloatIconWrap}>
              <Ionicons name="flower-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.heroFloatTextCol}>
              <Text style={styles.heroFloatHeading}>
                {t('A little practice. A lot of peace.', 'थोड़ा सा अभ्यास। अपार शांति।')}
              </Text>
              <Text style={styles.heroFloatDesc}>
                {t('Your moment of calm starts right here.', 'आपकी शांति का क्षण यहीं से शुरू होता है।')}
              </Text>
            </View>
          </View>
        </View>

        {/* STATS BAND matching Lovable */}
        <View style={styles.statsBand}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15+</Text>
            <Text style={styles.statLabel}>{t('Yoga poses', 'कुल आसन')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>{t('Guided routines', 'निर्देशित सत्र')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentStreak}d</Text>
            <Text style={styles.statLabel}>{t('Daily streak', 'दैनिक क्रम')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayMinutes}m</Text>
            <Text style={styles.statLabel}>{t('Today calm', 'आज का अभ्यास')}</Text>
          </View>
        </View>

        {/* STEP ONTO YOUR MAT (Featured Curated Sessions) matching Lovable */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              {t('A little time for yourself', 'स्वयं के लिए कुछ समय')}
            </Text>
            <Text style={styles.sectionTitle}>
              {t('Step onto your mat.', 'अपनी योग मैट पर आएं।')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.push('/(tabs)/practice')}
          >
            <Text style={styles.seeAllText}>{t('Explore all', 'सभी देखें')}</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Sessions Horizontal / Stack Cards */}
        <View style={styles.sessionCardList}>
          {yogaSessions.slice(0, 3).map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.featuredSessionCard}
              onPress={() => router.push(`/session/${session.id}`)}
              activeOpacity={0.88}
            >
              <View style={styles.sessionCardTop}>
                <View style={styles.sessionBadgeRow}>
                  <View style={styles.sessionDiffBadge}>
                    <Text style={styles.sessionDiffText}>
                      {t(session.difficulty, session.difficulty === 'beginner' ? 'शुरुआती' : 'मध्यम')}
                    </Text>
                  </View>
                  <View style={styles.sessionTimeBadge}>
                    <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
                    <Text style={styles.sessionTimeText}>
                      {session.durationMinutes} {t('min', 'मिनट')}
                    </Text>
                  </View>
                </View>

                {/* Pose Thumbnail Preview in Session */}
                <View style={styles.sessionThumbRow}>
                  {session.poseSequence.slice(0, 3).map((pId) => (
                    <View key={pId} style={styles.sessionPoseCircle}>
                      <Image
                        source={getPoseImage(pId)}
                        style={styles.sessionPoseCircleImg}
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </View>
              </View>

              <Text style={styles.featuredSessionName}>
                {language === 'hi' ? session.name.hi : session.name.en}
              </Text>
              <Text style={styles.featuredSessionDesc} numberOfLines={2}>
                {language === 'hi' ? session.description.hi : session.description.en}
              </Text>

              <View style={styles.featuredSessionFooter}>
                <Text style={styles.featuredSessionCategory}>
                  {session.category.toUpperCase()} · {session.poseSequence.length} {t('poses', 'आसन')}
                </Text>
                <View style={styles.startSessionPill}>
                  <Text style={styles.startSessionPillText}>
                    {t('Start session', 'सत्र शुरू करें')}
                  </Text>
                  <Ionicons name="arrow-forward" size={13} color={Colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* INSPIRATION QUOTE BAND matching Lovable */}
        <View style={styles.quoteBand}>
          <MaterialCommunityIcons
            name="format-quote-close"
            size={26}
            color={Colors.primary}
            style={styles.quoteIcon}
          />
          <View style={styles.quoteContent}>
            <Text style={styles.quoteEyebrow}>
              {t('YOUR DAILY DOSE OF INSPIRATION', 'दैनिक आत्म-प्रेरणा 🌿')}
            </Text>
            <Text style={styles.quoteText}>
              “{language === 'hi' ? currentQuote.hi : currentQuote.en}”
            </Text>
            <Text style={styles.quoteAuthor}>
              {t('A gentle reminder from YogaLife', 'योगलाइफ़ की ओर से एक सौम्य संदेश')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.quoteRefreshBtn}
            onPress={handleNextQuote}
            accessibilityLabel={t('New wellness tip', 'नया विचार')}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* DAILY RECOMMENDED ASANA FEATURE CARD */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              {t('Spotlight practice', 'दैनिक अनुशंसित अभ्यास')}
            </Text>
            <Text style={styles.sectionTitle}>
              {t('Pose of the Day', 'आज का विशेष आसन')}
            </Text>
          </View>
          <Ionicons name="sparkles" size={18} color={Colors.mutedGold} />
        </View>

        <View style={styles.dailyCard}>
          <View style={styles.dailyCardContent}>
            <View style={styles.dailyTextCol}>
              <View style={styles.dailyBadgeRow}>
                <View style={styles.badgeDifficulty}>
                  <Text style={styles.badgeTextDifficulty}>
                    {t(dailyPose.difficulty, dailyPose.difficulty === 'beginner' ? 'शुरुआती' : 'मध्यम')}
                  </Text>
                </View>
                <View style={styles.durationChip}>
                  <Ionicons name="timer-outline" size={13} color={Colors.primary} />
                  <Text style={styles.durationText}>{dailyPose.duration}s</Text>
                </View>
              </View>

              <Text style={styles.dailySanskrit}>{dailyPose.sanskritName}</Text>
              <Text style={styles.dailyEnglish}>
                {language === 'hi' ? dailyPose.hindiName : dailyPose.englishName}
              </Text>
              <Text style={styles.dailySubtext}>
                {language === 'hi' ? dailyPose.englishName : dailyPose.hindiName}
              </Text>
            </View>

            <View style={styles.dailyIconBox}>
              <Image
                source={getPoseImage(dailyPose.id)}
                style={styles.dailyPoseImg}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.dailyActionRow}>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => router.push(`/pose/${dailyPose.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.detailsBtnText}>{t('View Details', 'विवरण देखें')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => router.push(`/session/${dailyPose.id}`)}
              activeOpacity={0.85}
            >
              <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.startBtnText}>{t('Start Practice', 'सत्र शुरू करें')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* POPULAR ASANAS HORIZONTAL SCROLL with REAL PHOTOS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>{t('Visual asana library', 'आसन गैलरी')}</Text>
            <Text style={styles.sectionTitle}>{t('Popular Asanas', 'लोकप्रिय आसन')}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
            <Text style={styles.seeAllText}>{t('See all poses', 'सभी देखें')} →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {popularPoses.map((pose) => (
            <TouchableOpacity
              key={pose.id}
              style={styles.popularCard}
              onPress={() => router.push(`/pose/${pose.id}`)}
              activeOpacity={0.85}
            >
              <View style={styles.popularIconWrap}>
                <Image
                  source={getPoseImage(pose.id)}
                  style={styles.popularPoseImg}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.popularName} numberOfLines={1}>
                {pose.sanskritName}
              </Text>
              <Text style={styles.popularSecondary} numberOfLines={1}>
                {language === 'hi' ? pose.hindiName : pose.englishName}
              </Text>
              <View style={styles.popularBottom}>
                <Text style={styles.popularDuration}>{pose.duration}s</Text>
                <Ionicons name="arrow-forward-circle" size={18} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* MORE THAN MOVEMENT (3 Benefits Cards) matching Lovable */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              {t('More than movement', 'व्यायाम से कहीं अधिक')}
            </Text>
            <Text style={styles.sectionTitle}>
              {t('Small steps. Beautiful changes.', 'छोटे कदम। सुखद बदलाव।')}
            </Text>
          </View>
        </View>

        <View style={styles.benefitGrid}>
          {/* Card 1: Sage */}
          <View style={[styles.benefitCard, { backgroundColor: '#F2F8F2', borderColor: '#D9EADB' }]}>
            <View style={[styles.benefitIconBox, { backgroundColor: '#E4F1E5' }]}>
              <Ionicons name="body-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.benefitCardTitle}>
              {t('Move more freely', 'सहजता से गतिमान हों')}
            </Text>
            <Text style={styles.benefitCardDesc}>
              {t(
                'Gentle stretching can support flexibility, mobility, and everyday ease.',
                'सौम्य स्ट्रेचिंग शरीर में लचीलापन और दैनिक गतिविधियों में हल्कापन लाती है।'
              )}
            </Text>
          </View>

          {/* Card 2: Lavender */}
          <View style={[styles.benefitCard, { backgroundColor: '#F7F3FB', borderColor: '#E8DEF2' }]}>
            <View style={[styles.benefitIconBox, { backgroundColor: '#EDE4F7' }]}>
              <Ionicons name="heart-outline" size={22} color="#6A4982" />
            </View>
            <Text style={styles.benefitCardTitle}>
              {t('Find your calm', 'मानसिक शांति पाएं')}
            </Text>
            <Text style={styles.benefitCardDesc}>
              {t(
                'A mindful pause may help you manage stress and feel deeply relaxed.',
                'एक शांत पल तनाव को दूर कर मन को गहन शांति और स्थिरता प्रदान करता है।'
              )}
            </Text>
          </View>

          {/* Card 3: Peach */}
          <View style={[styles.benefitCard, { backgroundColor: '#FCF6EF', borderColor: '#F2E4D5' }]}>
            <View style={[styles.benefitIconBox, { backgroundColor: '#F8ECE0' }]}>
              <Ionicons name="scale-outline" size={22} color="#A05A1C" />
            </View>
            <Text style={styles.benefitCardTitle}>
              {t('Feel more balanced', 'संतुलित महसूस करें')}
            </Text>
            <Text style={styles.benefitCardDesc}>
              {t(
                'Build stability, core awareness, and a closer connection with your body.',
                'शारीरिक स्थिरता, आंतरिक संतुलन और आत्म-जागरूकता को सुदृढ़ करें।'
              )}
            </Text>
          </View>
        </View>

        {/* TODAY'S GENTLE CHALLENGE (Mindful Moment) matching Lovable */}
        <View style={styles.challengeCard}>
          <View style={styles.challengeLeft}>
            <View style={styles.eyebrowRow}>
              <Ionicons name="sparkles" size={13} color={Colors.primary} />
              <Text style={styles.challengeEyebrow}>
                {t('Today’s gentle challenge', 'आज की सौम्य चुनौती')}
              </Text>
            </View>
            <Text style={styles.challengeHeading}>
              {t('Five minutes. Just for you.', 'केवल पांच मिनट। आपके लिए।')}
            </Text>
            <Text style={styles.challengeDesc}>
              {t(
                'Put your phone aside, find a comfortable seat, and reconnect with your breath.',
                'फोन को एक तरफ रखें, आरामदायक मुद्रा में बैठें और अपनी सांसों से जुड़ें।'
              )}
            </Text>

            <TouchableOpacity
              style={styles.challengeBtn}
              onPress={() => router.push('/breathing')}
              activeOpacity={0.85}
            >
              <Text style={styles.challengeBtnText}>
                {t('Take a mindful moment', 'प्राणायाम शुरू करें')}
              </Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SAFETY NOTE matching Lovable */}
        <View style={styles.safetyBox}>
          <Ionicons name="heart" size={16} color={Colors.primary} style={{ marginTop: 2 }} />
          <Text style={styles.safetyText}>
            {t(
              'Yoga supports general well-being and does not replace medical treatment. Move within a comfortable range, stop for pain, and breathe with awareness.',
              'योग समग्र स्वास्थ्य का समर्थन करता है और चिकित्सीय उपचार का विकल्प नहीं है। अपनी शारीरिक सीमा में अभ्यास करें, दर्द होने पर रुकें।'
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FBF8',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 40,
  },

  // Brand Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontWeight: '400',
    color: Colors.primary,
  },
  brandTagline: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: -2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  profileInitial: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Hero Section
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2EDE2',
    ...Shadows.md,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  eyebrowText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 33,
    letterSpacing: -0.5,
  },
  heroTitleItalic: {
    color: Colors.primary,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 18,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  heroPrimaryBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    height: 46,
    borderRadius: 12,
    ...Shadows.sm,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  heroSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3FAF3',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFE4CF',
  },
  heroSecondaryBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  heroSocialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
    marginBottom: 14,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  heroSocialText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  heroSocialBold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // Floating Calm Banner inside Hero
  heroFloatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAF7',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0EDE0',
    gap: 12,
  },
  heroFloatIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4E8D4',
  },
  heroFloatTextCol: {
    flex: 1,
  },
  heroFloatHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  heroFloatDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },

  // Stats Band
  statsBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2EDE2',
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E8F0E8',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Featured Session Cards
  sessionCardList: {
    gap: 12,
    marginBottom: 20,
  },
  featuredSessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EFE4',
    ...Shadows.sm,
  },
  sessionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionDiffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#EBF4EB',
  },
  sessionDiffText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  sessionTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  sessionTimeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sessionThumbRow: {
    flexDirection: 'row',
    gap: 4,
  },
  sessionPoseCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F8F2',
    borderWidth: 1,
    borderColor: '#DFEADF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sessionPoseCircleImg: {
    width: '90%',
    height: '90%',
  },
  featuredSessionName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  featuredSessionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  featuredSessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
  },
  featuredSessionCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  startSessionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  startSessionPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Inspiration Quote Band
  quoteBand: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F4FAF4',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DFEADF',
    gap: 12,
  },
  quoteIcon: {
    marginTop: 2,
  },
  quoteContent: {
    flex: 1,
  },
  quoteEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 6,
  },
  quoteAuthor: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  quoteRefreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFE4CF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  // Daily Pose Card
  dailyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DFEADF',
    ...Shadows.md,
  },
  dailyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dailyBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badgeDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#EBF4EB',
  },
  badgeTextDifficulty: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4FAF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  dailyTextCol: {
    flex: 1,
  },
  dailySanskrit: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  dailyEnglish: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  dailySubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dailyIconBox: {
    width: 84,
    height: 84,
    borderRadius: 18,
    backgroundColor: '#F3FAF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#DFEADF',
    overflow: 'hidden',
    padding: 4,
  },
  dailyPoseImg: {
    width: '100%',
    height: '100%',
  },
  dailyActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  startBtn: {
    flex: 1.4,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  startBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Popular Asanas Horizontal Cards
  horizontalScroll: {
    gap: 12,
    paddingBottom: 6,
    marginBottom: 20,
  },
  popularCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8F0E8',
    ...Shadows.sm,
  },
  popularIconWrap: {
    width: '100%',
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F3FAF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DFEADF',
    overflow: 'hidden',
    padding: 4,
  },
  popularPoseImg: {
    width: '100%',
    height: '100%',
  },
  popularName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  popularSecondary: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  popularBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  popularDuration: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },

  // Benefits 3 Grid Cards matching Lovable
  benefitGrid: {
    gap: 10,
    marginBottom: 20,
  },
  benefitCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  benefitIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  benefitCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  benefitCardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Challenge Card matching Lovable
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DFEADF',
    ...Shadows.sm,
  },
  challengeLeft: {},
  challengeEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  challengeHeading: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  challengeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    height: 44,
    borderRadius: 12,
    ...Shadows.sm,
  },
  challengeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Safety Disclaimer
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F5FAF5',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DFEADF',
  },
  safetyText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
});
