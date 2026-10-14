import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { yogaSessions, YogaSession } from '@/data/sessions';

export default function PracticeScreen() {
  const { t, language } = useLanguageStore();

  const handleCustomPractice = () => {
    Alert.alert(
      t('Custom Routine Builder', 'कस्टम योग दिनचर्या'),
      t(
        'Custom routine builder and personalized playlists will be unlocked in the next version! Enjoy our curated pre-built sessions.',
        'कस्टम रूटीन और अपनी पसंद की योग सूची बनाने की सुविधा अगले संस्करण में उपलब्ध होगी! तब तक हमारे तैयार योग सत्रों का आनंद लें।'
      ),
      [{ text: t('Got It', 'ठीक है') }]
    );
  };

  const getSessionIcon = (session: YogaSession): keyof typeof Ionicons.glyphMap => {
    switch (session.category) {
      case 'morning':
        return 'sunny';
      case 'stress-relief':
        return 'leaf';
      case 'surya-namaskar':
        return 'flame';
      case 'flexibility':
        return 'body';
      case 'bedtime':
        return 'moon';
      case 'full-body':
        return 'barbell';
      default:
        return 'fitness';
    }
  };

  const getSessionColor = (category: string): { bg: string; icon: string } => {
    switch (category) {
      case 'morning':
        return { bg: '#FFF8E1', icon: '#F57F17' };
      case 'stress-relief':
        return { bg: '#E8F5E9', icon: '#2E7D32' };
      case 'surya-namaskar':
        return { bg: '#FBE9E7', icon: '#D84315' };
      case 'flexibility':
        return { bg: '#E0F2F1', icon: '#00695C' };
      case 'bedtime':
        return { bg: '#EDE7F6', icon: '#512DA8' };
      case 'full-body':
        return { bg: '#E1F5FE', icon: '#0277BD' };
      default:
        return { bg: '#E8F5E9', icon: Colors.deepForest };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('Yoga Sessions', 'योग सत्र')}</Text>
          <Text style={styles.screenSubtitle}>
            {t(
              'Curated guided sequences with 3D animation and voice feedback',
              '3D एनिमेशन और ध्वनि मार्गदर्शन से युक्त प्रामाणिक योग अभ्यास'
            )}
          </Text>
        </View>

        {/* List of Sessions */}
        <View style={styles.sessionList}>
          {yogaSessions.map((session) => {
            const colors = getSessionColor(session.category);
            const iconName = getSessionIcon(session);

            return (
              <TouchableOpacity
                key={session.id}
                style={styles.sessionCard}
                onPress={() => router.push(`/session/${session.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.cardMain}>
                  <View style={[styles.sessionIconBox, { backgroundColor: colors.bg }]}>
                    <Ionicons name={iconName} size={28} color={colors.icon} />
                  </View>

                  <View style={styles.sessionInfo}>
                    <View style={styles.titleRow}>
                      <Text style={styles.sessionName}>
                        {language === 'hi' ? session.name.hi : session.name.en}
                      </Text>
                      <View
                        style={[
                          styles.difficultyTag,
                          session.difficulty === 'beginner'
                            ? styles.diffBeginner
                            : styles.diffIntermediate,
                        ]}
                      >
                        <Text style={styles.difficultyText}>
                          {t(
                            session.difficulty,
                            session.difficulty === 'beginner' ? 'शुरुआती' : 'मध्यम'
                          )}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.sessionDesc} numberOfLines={2}>
                      {language === 'hi' ? session.description.hi : session.description.en}
                    </Text>

                    {/* Meta info tags */}
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={Colors.deepForest} />
                        <Text style={styles.metaText}>
                          {session.durationMinutes} {t('min', 'मिनट')}
                        </Text>
                      </View>

                      <View style={styles.metaDot} />

                      <View style={styles.metaItem}>
                        <Ionicons name="layers-outline" size={14} color={Colors.deepForest} />
                        <Text style={styles.metaText}>
                          {session.poseSequence.length} {t('poses', 'आसन')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bottom Card Action */}
                <View style={styles.cardAction}>
                  <Text style={styles.startSessionText}>
                    {t('Begin Routine', 'अभ्यास आरंभ करें')}
                  </Text>
                  <Ionicons name="play-circle" size={24} color={Colors.deepForest} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Practice Button */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={handleCustomPractice}
          activeOpacity={0.8}
        >
          <View style={styles.customIconWrap}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.deepForest} />
          </View>
          <View style={styles.customTextWrap}>
            <Text style={styles.customTitle}>
              {t('Create Custom Routine', 'कस्टम योग रूटीन बनाएं')}
            </Text>
            <Text style={styles.customSubtitle}>
              {t('Pick poses and set custom durations', 'अपनी पसंद के आसन और समय चुनें')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
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
    lineHeight: 18,
  },
  sessionList: {
    gap: 16,
    marginBottom: 20,
  },
  sessionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  cardMain: {
    flexDirection: 'row',
  },
  sessionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sessionInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffBeginner: {
    backgroundColor: '#E8F5E9',
  },
  diffIntermediate: {
    backgroundColor: '#FFF8E1',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sessionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C5D6C5',
    marginHorizontal: 8,
  },
  cardAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
  },
  startSessionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.sageGreen,
  },
  customIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.softGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  customTextWrap: {
    flex: 1,
  },
  customTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.deepForest,
  },
  customSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
