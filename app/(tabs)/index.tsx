import React, { useMemo } from 'react';
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
import { yogaPoses, getPoseById } from '@/data/poses';
import { ThemedCard } from '@/components/ui/ThemedCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export default function HomeScreen() {
  const { t, language } = useLanguageStore();
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const getTodayPracticeTime = useProgressStore((state) => state.getTodayPracticeTime);
  const history = useProgressStore((state) => state.history);

  // Dynamic greeting based on current time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { en: 'Good Morning', hi: 'शुभ प्रभात' };
    } else if (hour < 17) {
      return { en: 'Good Afternoon', hi: 'शुभ दोपहर' };
    } else {
      return { en: 'Good Evening', hi: 'शुभ संध्या' };
    }
  }, []);

  // Daily recommended pose (deterministic based on day of month)
  const dailyPose = useMemo(() => {
    const day = new Date().getDate();
    const index = (day * 3) % yogaPoses.length;
    return yogaPoses[index] || yogaPoses[0];
  }, []);

  // Popular poses for quick start
  const popularPoses = useMemo(() => {
    const targetIds = ['tadasana', 'surya-namaskar', 'vrikshasana', 'bhujangasana', 'shavasana'];
    return targetIds
      .map((id) => getPoseById(id))
      .filter((pose): pose is typeof yogaPoses[0] => Boolean(pose));
  }, []);

  const todayMinutes = Math.round(getTodayPracticeTime() / 60);

  // Recent practice entries
  const recentHistory = useMemo(() => {
    return [...history].reverse().slice(0, 3);
  }, [history]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingSub}>{t(greeting.en, greeting.hi)} 🌿</Text>
            <Text style={styles.greetingTitle}>YogaLife</Text>
          </View>
          <LanguageSelector variant="compact" />
        </View>

        {/* Stats Row: Streak & Today's Practice */}
        <View style={styles.statsRow}>
          {/* Streak Card */}
          <View style={[styles.statCard, styles.streakCard]}>
            <View style={styles.statIconBadgeStreak}>
              <Ionicons name="flame" size={24} color="#E65100" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {currentStreak}{' '}
                <Text style={styles.statUnit}>{t('Days', 'दिन')}</Text>
              </Text>
              <Text style={styles.statLabel}>{t('Current Streak', 'दैनिक क्रम')}</Text>
            </View>
          </View>

          {/* Today Practice Time Card */}
          <View style={[styles.statCard, styles.timeCard]}>
            <View style={styles.statIconBadgeTime}>
              <Ionicons name="time" size={22} color={Colors.deepForest} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>
                {todayMinutes}{' '}
                <Text style={styles.statUnit}>{t('Min', 'मिनट')}</Text>
              </Text>
              <Text style={styles.statLabel}>{t('Today Practiced', 'आज का अभ्यास')}</Text>
            </View>
          </View>
        </View>

        {/* Daily Recommended Pose Feature Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('Daily Recommended Pose', 'दैनिक अनुशंसित आसन')}
          </Text>
          <Ionicons name="sparkles" size={18} color={Colors.mutedGold} />
        </View>

        <View style={styles.dailyCard}>
          <View style={styles.dailyCardHeader}>
            <View style={styles.dailyBadgeRow}>
              <View style={styles.badgeCategory}>
                <Text style={styles.badgeTextCategory}>
                  {dailyPose.category.toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.badgeDifficulty,
                  dailyPose.difficulty === 'beginner'
                    ? styles.badgeBeginner
                    : styles.badgeIntermediate,
                ]}
              >
                <Text style={styles.badgeTextDifficulty}>
                  {t(dailyPose.difficulty, dailyPose.difficulty === 'beginner' ? 'शुरुआती' : 'मध्यम')}
                </Text>
              </View>
            </View>
            <View style={styles.durationChip}>
              <Ionicons name="timer-outline" size={14} color={Colors.deepForest} />
              <Text style={styles.durationText}>{dailyPose.duration}s</Text>
            </View>
          </View>

          <View style={styles.dailyBody}>
            <View style={styles.dailyTextCol}>
              <Text style={styles.dailySanskrit}>{dailyPose.sanskritName}</Text>
              <Text style={styles.dailyEnglish}>
                {language === 'hi' ? dailyPose.hindiName : dailyPose.englishName}
              </Text>
              <Text style={styles.dailySubtext}>
                {language === 'hi' ? dailyPose.englishName : dailyPose.hindiName}
              </Text>
            </View>
            <View style={styles.dailyIconBox}>
              <Ionicons name="body" size={38} color={Colors.deepForest} />
            </View>
          </View>

          <View style={styles.dailyActionRow}>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => router.push(`/pose/${dailyPose.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsBtnText}>{t('View Details', 'विवरण देखें')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => router.push(`/session/${dailyPose.id}`)}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={16} color={Colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.startBtnText}>{t('Start Practice', 'सत्र शुरू करें')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Wellness Modules: Breathing & Meditation */}
        <View style={styles.wellnessRow}>
          <TouchableOpacity
            style={styles.wellnessCard}
            onPress={() => router.push('/breathing')}
            activeOpacity={0.8}
          >
            <View style={[styles.wellnessIconWrap, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="water" size={24} color="#0288D1" />
            </View>
            <View style={styles.wellnessContent}>
              <Text style={styles.wellnessTitle}>{t('Pranayama', 'प्राणायाम')}</Text>
              <Text style={styles.wellnessDesc}>
                {t('Calming breathing exercises', 'श्वास क्रिया एवं एकाग्रता')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.wellnessCard}
            onPress={() => router.push('/meditation')}
            activeOpacity={0.8}
          >
            <View style={[styles.wellnessIconWrap, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="sunny" size={24} color="#F57C00" />
            </View>
            <View style={styles.wellnessContent}>
              <Text style={styles.wellnessTitle}>{t('Meditation', 'ध्यान साधना')}</Text>
              <Text style={styles.wellnessDesc}>
                {t('Inner peace & mindfulness', 'शांत मन व आत्मिक शांति')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Quick Start Poses Horizontal Scroll */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('Popular Asanas', 'लोकप्रिय आसन')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
            <Text style={styles.seeAllText}>{t('See All', 'सभी देखें')} →</Text>
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
              activeOpacity={0.8}
            >
              <View style={styles.popularIconWrap}>
                <Ionicons name="fitness" size={28} color={Colors.deepForest} />
              </View>
              <Text style={styles.popularName} numberOfLines={1}>
                {pose.sanskritName}
              </Text>
              <Text style={styles.popularSecondary} numberOfLines={1}>
                {language === 'hi' ? pose.hindiName : pose.englishName}
              </Text>
              <View style={styles.popularBottom}>
                <Text style={styles.popularDuration}>{pose.duration}s</Text>
                <Ionicons name="arrow-forward-circle" size={18} color={Colors.deepForest} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Sessions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('Recent Activity', 'हाल की गतिविधि')}</Text>
        </View>

        {recentHistory.length > 0 ? (
          recentHistory.map((item, idx) => {
            const pose = getPoseById(item.poseId);
            const poseTitle = pose
              ? language === 'hi'
                ? pose.hindiName || pose.sanskritName
                : pose.englishName || pose.sanskritName
              : item.poseId;

            return (
              <View key={`${item.date}-${idx}`} style={styles.historyCard}>
                <View style={styles.historyIcon}>
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'time'}
                    size={22}
                    color={item.completed ? Colors.success : Colors.mutedGold}
                  />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{poseTitle}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(item.date).toLocaleDateString(
                      language === 'hi' ? 'hi-IN' : 'en-US',
                      { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                    )}
                  </Text>
                </View>
                <Text style={styles.historyDuration}>
                  {Math.round(item.durationSeconds / 60) > 0
                    ? `${Math.round(item.durationSeconds / 60)} min`
                    : `${item.durationSeconds}s`}
                </Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles-outline" size={32} color={Colors.sageGreen} />
            <Text style={styles.emptyTitle}>
              {t('Start your wellness journey today', 'आज से अपनी योग यात्रा शुरू करें')}
            </Text>
            <Text style={styles.emptySub}>
              {t(
                'Complete a daily recommended pose or session to build your streak!',
                'अपने दैनिक क्रम को बनाने के लिए कोई आसन या सत्र पूरा करें!'
              )}
            </Text>
          </View>
        )}
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.deepForest,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  streakCard: {},
  timeCard: {},
  statIconBadgeStreak: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statIconBadgeTime: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EAF4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  dailyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: '#DFEADF',
  },
  dailyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeCategory: {
    backgroundColor: '#EBF3EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTextCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  badgeDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeBeginner: {
    backgroundColor: '#E8F5E9',
  },
  badgeIntermediate: {
    backgroundColor: '#FFF8E1',
  },
  badgeTextDifficulty: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.softGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  dailyBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dailyTextCol: {
    flex: 1,
  },
  dailySanskrit: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.deepForest,
    letterSpacing: -0.3,
  },
  dailyEnglish: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  dailySubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dailyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.softGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  dailyActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  detailsBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.deepForest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  startBtn: {
    flex: 1.3,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.deepForest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  startBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  wellnessRow: {
    gap: 10,
    marginBottom: 20,
  },
  wellnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  wellnessIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  wellnessContent: {
    flex: 1,
  },
  wellnessTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  wellnessDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  horizontalScroll: {
    gap: 12,
    paddingBottom: 6,
    marginBottom: 16,
  },
  popularCard: {
    width: 140,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  popularIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.softGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  popularName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepForest,
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
    marginTop: 10,
  },
  popularDuration: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  historyIcon: {
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  historyDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyDuration: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  emptyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.deepForest,
    marginTop: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
