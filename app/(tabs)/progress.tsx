import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useProgressStore, PracticeEntry } from '@/stores/progressStore';
import { getPoseById } from '@/data/poses';

export default function ProgressScreen() {
  const { t, language } = useLanguageStore();

  const history = useProgressStore((state) => state.history);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const longestStreak = useProgressStore((state) => state.longestStreak);
  const totalPracticeTime = useProgressStore((state) => state.totalPracticeTime);
  const posesCompleted = useProgressStore((state) => state.posesCompleted);
  const getWeeklyStats = useProgressStore((state) => state.getWeeklyStats);

  // Format total practice time into hours and minutes
  const formattedTotalTime = useMemo(() => {
    const totalMinutes = Math.floor(totalPracticeTime / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  }, [totalPracticeTime]);

  // Weekly stats for bar chart
  const weeklyData = useMemo(() => {
    return getWeeklyStats();
  }, [getWeeklyStats, history]);

  const maxWeeklyMinutes = useMemo(() => {
    const maxVal = Math.max(...weeklyData.map((d) => d.minutes), 10);
    return maxVal;
  }, [weeklyData]);

  // Generate 30 days for activity heatmap
  const activityDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; practiced: boolean }[] = [];
    const now = new Date();

    // Map history dates
    const practicedDates = new Set<string>();
    history.forEach((h) => {
      const d = new Date(h.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      practicedDates.add(key);
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      days.push({
        dateStr: key,
        dayNum: d.getDate(),
        practiced: practicedDates.has(key),
      });
    }

    return days;
  }, [history]);

  // Last 10 history entries
  const recentEntries = useMemo(() => {
    return [...history].reverse().slice(0, 10);
  }, [history]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('Your Progress', 'आपकी प्रगति')}</Text>
          <Text style={styles.screenSubtitle}>
            {t(
              'Consistency is the key to yogic transformation',
              'निरंतर अभ्यास ही आंतरिक शांति और स्वास्थ्य की कुंजी है'
            )}
          </Text>
        </View>

        {/* 4 Stats Cards Grid */}
        <View style={styles.statsGrid}>
          {/* Total Time */}
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="time" size={20} color={Colors.deepForest} />
            </View>
            <Text style={styles.statVal}>{formattedTotalTime}</Text>
            <Text style={styles.statDesc}>{t('Total Time', 'कुल समय')}</Text>
          </View>

          {/* Poses Learned */}
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="body" size={20} color="#00695C" />
            </View>
            <Text style={styles.statVal}>{posesCompleted ? posesCompleted.size : 0}</Text>
            <Text style={styles.statDesc}>{t('Poses Mastered', 'सिखे गए आसन')}</Text>
          </View>

          {/* Current Streak */}
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="flame" size={20} color="#E65100" />
            </View>
            <Text style={styles.statVal}>
              {currentStreak} {t('days', 'दिन')}
            </Text>
            <Text style={styles.statDesc}>{t('Current Streak', 'चालू क्रम')}</Text>
          </View>

          {/* Longest Streak */}
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="trophy" size={20} color="#7B1FA2" />
            </View>
            <Text style={styles.statVal}>
              {longestStreak} {t('days', 'दिन')}
            </Text>
            <Text style={styles.statDesc}>{t('Longest Streak', 'सर्वोत्तम क्रम')}</Text>
          </View>
        </View>

        {/* Weekly Activity Bar Chart */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardHeaderTitle}>
              {t('Weekly Practice (Minutes)', 'साप्ताहिक अभ्यास (मिनट)')}
            </Text>
            <Ionicons name="bar-chart-outline" size={18} color={Colors.deepForest} />
          </View>

          <View style={styles.chartContainer}>
            {weeklyData.map((dayItem, idx) => {
              const barHeightPct = Math.min(
                100,
                Math.max(8, Math.round((dayItem.minutes / maxWeeklyMinutes) * 100))
              );
              const isToday = idx === 6;

              return (
                <View key={`week-bar-${idx}`} style={styles.barColumn}>
                  {dayItem.minutes > 0 && (
                    <Text style={styles.barMinutesText}>{dayItem.minutes}</Text>
                  )}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${barHeightPct}%` },
                        dayItem.minutes > 0 ? styles.barFillActive : styles.barFillZero,
                        isToday && styles.barFillToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayLabel, isToday && styles.barDayLabelToday]}>
                    {dayItem.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 30-Day Activity Heatmap */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardHeaderTitle}>
              {t('30-Day Activity Heatmap', '30-दिवसीय गतिविधि चार्ट')}
            </Text>
            <Ionicons name="calendar-outline" size={18} color={Colors.deepForest} />
          </View>

          <View style={styles.heatmapGrid}>
            {activityDays.map((item, index) => (
              <View
                key={`heatmap-${index}`}
                style={[
                  styles.heatmapDot,
                  item.practiced ? styles.heatmapDotActive : styles.heatmapDotInactive,
                ]}
              >
                <Text
                  style={[
                    styles.heatmapDayText,
                    item.practiced && styles.heatmapDayTextActive,
                  ]}
                >
                  {item.dayNum}
                </Text>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.heatmapDotInactive]} />
              <Text style={styles.legendText}>{t('Rest / Missed', 'विश्राम')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.heatmapDotActive]} />
              <Text style={styles.legendText}>{t('Practiced', 'अभ्यास पूर्ण')}</Text>
            </View>
          </View>
        </View>

        {/* Practice History List (Last 10) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardHeaderTitle}>
              {t('Recent Sessions', 'हाल के सत्र')}
            </Text>
            <Text style={styles.historyCount}>{recentEntries.length}</Text>
          </View>

          {recentEntries.length > 0 ? (
            recentEntries.map((item, i) => {
              const pose = getPoseById(item.poseId);
              const displayName = pose
                ? language === 'hi'
                  ? pose.hindiName || pose.sanskritName
                  : pose.englishName || pose.sanskritName
                : item.poseId;

              const dateObj = new Date(item.date);
              const formattedDate = dateObj.toLocaleDateString(
                language === 'hi' ? 'hi-IN' : 'en-US',
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              );

              return (
                <View
                  key={`history-${i}`}
                  style={[
                    styles.historyItem,
                    i === recentEntries.length - 1 && styles.historyItemLast,
                  ]}
                >
                  <View style={styles.historyLeft}>
                    <View
                      style={[
                        styles.historyStatusBadge,
                        item.completed ? styles.badgeSuccess : styles.badgePartial,
                      ]}
                    >
                      <Ionicons
                        name={item.completed ? 'checkmark-circle' : 'time'}
                        size={18}
                        color={item.completed ? Colors.success : Colors.mutedGold}
                      />
                    </View>
                    <View style={styles.historyTextWrap}>
                      <Text style={styles.historyPoseName}>{displayName}</Text>
                      <Text style={styles.historyDateText}>{formattedDate}</Text>
                    </View>
                  </View>

                  <Text style={styles.historyDurationText}>
                    {Math.round(item.durationSeconds / 60) > 0
                      ? `${Math.round(item.durationSeconds / 60)} min`
                      : `${item.durationSeconds}s`}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyHistory}>
              <Ionicons name="barbell-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.emptyHistoryText}>
                {t('No practice history yet. Start today!', 'अभी तक कोई सत्र नहीं। आज ही शुरू करें!')}
              </Text>
            </View>
          )}
        </View>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.deepForest,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barMinutesText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
  },
  barTrack: {
    height: 90,
    width: 14,
    backgroundColor: '#F0F5F0',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barFillActive: {
    backgroundColor: Colors.sageGreen,
  },
  barFillZero: {
    backgroundColor: '#E4EDE4',
  },
  barFillToday: {
    backgroundColor: Colors.deepForest,
  },
  barDayLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
    fontWeight: '500',
  },
  barDayLabelToday: {
    color: Colors.deepForest,
    fontWeight: '700',
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  heatmapDot: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmapDotActive: {
    backgroundColor: Colors.deepForest,
  },
  heatmapDotInactive: {
    backgroundColor: '#F0F5F0',
    borderWidth: 1,
    borderColor: '#E2ECE2',
  },
  heatmapDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  heatmapDayTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  historyCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  historyItemLast: {
    borderBottomWidth: 0,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyStatusBadge: {
    marginRight: 12,
  },
  badgeSuccess: {},
  badgePartial: {},
  historyTextWrap: {
    flex: 1,
  },
  historyPoseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  historyDateText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyDurationText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyHistoryText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
});
