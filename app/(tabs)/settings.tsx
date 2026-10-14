import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { scheduleYogaReminder, cancelAllReminders } from '@/components/alarm/AlarmScheduler';
import {
  getAvailableSounds,
  playAlarmSound,
  stopAlarmSound,
} from '@/components/alarm/RingtonePlayer';

export default function SettingsScreen() {
  const { t, language } = useLanguageStore();

  const {
    voiceSpeed,
    beginnerMode,
    alarmEnabled,
    alarmTime,
    alarmDays,
    alarmSound,
    alarmVibrate,
    setVoiceSpeed,
    setBeginnerMode,
    setAlarmEnabled,
    setAlarmTime,
    setAlarmDays,
    setAlarmSound,
    setAlarmVibrate,
  } = useSettingsStore();

  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);

  const availableSounds = getAvailableSounds();

  // Day of week labels
  const daysOfWeek = [
    { label: t('Sun', 'रवि'), value: 0 },
    { label: t('Mon', 'सोम'), value: 1 },
    { label: t('Tue', 'मंगल'), value: 2 },
    { label: t('Wed', 'बुध'), value: 3 },
    { label: t('Thu', 'गुरु'), value: 4 },
    { label: t('Fri', 'शुक्र'), value: 5 },
    { label: t('Sat', 'शनि'), value: 6 },
  ];

  // Toggle day in reminder schedule
  const toggleDay = (dayIndex: number) => {
    let updatedDays: number[];
    if (alarmDays.includes(dayIndex)) {
      if (alarmDays.length === 1) {
        Alert.alert(
          t('Notice', 'सूचना'),
          t('At least one day must be selected', 'कम से कम एक दिन चुना जाना आवश्यक है')
        );
        return;
      }
      updatedDays = alarmDays.filter((d) => d !== dayIndex);
    } else {
      updatedDays = [...alarmDays, dayIndex].sort();
    }
    setAlarmDays(updatedDays);

    if (alarmEnabled) {
      scheduleYogaReminder(alarmTime, updatedDays, alarmSound);
    }
  };

  // Toggle Alarm master switch
  const handleToggleAlarm = async (enabled: boolean) => {
    setAlarmEnabled(enabled);
    if (enabled) {
      const scheduled = await scheduleYogaReminder(alarmTime, alarmDays, alarmSound);
      if (scheduled.length > 0) {
        Alert.alert(
          t('Reminder Set', 'अनुस्मारक सक्रिय'),
          t(
            `Yoga practice reminders set for ${alarmTime}`,
            `योग अभ्यास अनुस्मारक ${alarmTime} बजे के लिए सेट किया गया`
          )
        );
      }
    } else {
      await cancelAllReminders();
    }
  };

  // Sound Preview Play/Stop
  const handleSoundPreview = async (soundId: string) => {
    if (playingSoundId === soundId) {
      await stopAlarmSound();
      setPlayingSoundId(null);
    } else {
      setAlarmSound(soundId);
      setPlayingSoundId(soundId);
      await playAlarmSound(soundId);
      if (alarmEnabled) {
        scheduleYogaReminder(alarmTime, alarmDays, soundId);
      }
    }
  };

  // Simple Time Adjusters
  const adjustHour = (delta: number) => {
    const [h, m] = alarmTime.split(':').map(Number);
    const newHour = (h + delta + 24) % 24;
    const newTime = `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setAlarmTime(newTime);
    if (alarmEnabled) {
      scheduleYogaReminder(newTime, alarmDays, alarmSound);
    }
  };

  const adjustMinute = (delta: number) => {
    const [h, m] = alarmTime.split(':').map(Number);
    let newMinute = m + delta;
    let newHour = h;
    if (newMinute >= 60) {
      newMinute = 0;
      newHour = (newHour + 1) % 24;
    } else if (newMinute < 0) {
      newMinute = 45;
      newHour = (newHour - 1 + 24) % 24;
    }
    const newTime = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    setAlarmTime(newTime);
    if (alarmEnabled) {
      scheduleYogaReminder(newTime, alarmDays, alarmSound);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('Settings', 'सेटिंग्स')}</Text>
          <Text style={styles.screenSubtitle}>
            {t('Customize your yoga practice & experience', 'अपनी योग साधना और प्राथमिकताओं को अनुकूलित करें')}
          </Text>
        </View>

        {/* Section 1: Language */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="globe-outline" size={20} color={Colors.deepForest} />
              <Text style={styles.sectionTitle}>{t('Language', 'भाषा')}</Text>
            </View>
          </View>
          <LanguageSelector variant="full" />
        </View>

        {/* Section 2: Voice & Instruction Guidance */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="mic-outline" size={20} color={Colors.deepForest} />
              <Text style={styles.sectionTitle}>
                {t('Voice Guidance', 'वाक् मार्गदर्शन')}
              </Text>
            </View>
          </View>

          {/* Voice Speed Control */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>{t('Voice Speed', 'ध्वनि गति')}</Text>
              <Text style={styles.settingSubtext}>
                {voiceSpeed.toFixed(1)}x {t('speech rate', 'गति')}
              </Text>
            </View>
            <View style={styles.speedPills}>
              {[0.8, 1.0, 1.2].map((speed) => (
                <TouchableOpacity
                  key={`speed-${speed}`}
                  style={[
                    styles.speedPill,
                    voiceSpeed === speed && styles.speedPillActive,
                  ]}
                  onPress={() => setVoiceSpeed(speed)}
                >
                  <Text
                    style={[
                      styles.speedPillText,
                      voiceSpeed === speed && styles.speedPillTextActive,
                    ]}
                  >
                    {speed}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Beginner Mode Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>{t('Beginner Mode', 'शुरुआती मोड')}</Text>
              <Text style={styles.settingSubtext}>
                {t(
                  'Provides detailed alignment cues and longer step holds',
                  'विस्तृत शारीरिक संरेखण और लंबे विश्राम निर्देश प्रदान करता है'
                )}
              </Text>
            </View>
            <Switch
              value={beginnerMode}
              onValueChange={setBeginnerMode}
              trackColor={{ false: '#DCE6DC', true: Colors.sageGreen }}
              thumbColor={beginnerMode ? Colors.deepForest : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Section 3: Daily Reminders */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="alarm-outline" size={20} color={Colors.deepForest} />
              <Text style={styles.sectionTitle}>
                {t('Daily Practice Reminder', 'दैनिक अभ्यास अनुस्मारक')}
              </Text>
            </View>
            <Switch
              value={alarmEnabled}
              onValueChange={handleToggleAlarm}
              trackColor={{ false: '#DCE6DC', true: Colors.sageGreen }}
              thumbColor={alarmEnabled ? Colors.deepForest : '#FFFFFF'}
            />
          </View>

          {alarmEnabled && (
            <View style={styles.alarmContent}>
              {/* Time Picker Stepper */}
              <View style={styles.timePickerContainer}>
                <Text style={styles.timePickerLabel}>
                  {t('Reminder Time', 'अनुस्मारक समय')}
                </Text>
                <View style={styles.stepperRow}>
                  {/* Hour */}
                  <View style={styles.stepperBox}>
                    <TouchableOpacity
                      onPress={() => adjustHour(1)}
                      style={styles.stepBtn}
                    >
                      <Ionicons name="chevron-up" size={18} color={Colors.deepForest} />
                    </TouchableOpacity>
                    <Text style={styles.timeNumber}>{alarmTime.split(':')[0]}</Text>
                    <TouchableOpacity
                      onPress={() => adjustHour(-1)}
                      style={styles.stepBtn}
                    >
                      <Ionicons name="chevron-down" size={18} color={Colors.deepForest} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.timeColon}>:</Text>

                  {/* Minute */}
                  <View style={styles.stepperBox}>
                    <TouchableOpacity
                      onPress={() => adjustMinute(15)}
                      style={styles.stepBtn}
                    >
                      <Ionicons name="chevron-up" size={18} color={Colors.deepForest} />
                    </TouchableOpacity>
                    <Text style={styles.timeNumber}>{alarmTime.split(':')[1]}</Text>
                    <TouchableOpacity
                      onPress={() => adjustMinute(-15)}
                      style={styles.stepBtn}
                    >
                      <Ionicons name="chevron-down" size={18} color={Colors.deepForest} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Days Selector */}
              <View style={styles.daysRow}>
                {daysOfWeek.map((d) => {
                  const isSelected = alarmDays.includes(d.value);
                  return (
                    <TouchableOpacity
                      key={`day-${d.value}`}
                      onPress={() => toggleDay(d.value)}
                      style={[styles.dayChip, isSelected && styles.dayChipActive]}
                    >
                      <Text
                        style={[
                          styles.dayChipText,
                          isSelected && styles.dayChipTextActive,
                        ]}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.divider} />

              {/* Sound Selector */}
              <Text style={styles.soundPickerLabel}>
                {t('Reminder Chime', 'घंटी ध्वनि')}
              </Text>
              <View style={styles.soundsList}>
                {availableSounds.map((snd) => {
                  const isCurrent = alarmSound === snd.id;
                  const isPlaying = playingSoundId === snd.id;

                  return (
                    <TouchableOpacity
                      key={snd.id}
                      style={[styles.soundRow, isCurrent && styles.soundRowActive]}
                      onPress={() => handleSoundPreview(snd.id)}
                    >
                      <View style={styles.soundInfo}>
                        <Text
                          style={[
                            styles.soundName,
                            isCurrent && styles.soundNameActive,
                          ]}
                        >
                          {language === 'hi' ? snd.nameHi : snd.name}
                        </Text>
                        <Text style={styles.soundDesc}>
                          {language === 'hi' ? snd.descriptionHi : snd.description}
                        </Text>
                      </View>

                      <Ionicons
                        name={isPlaying ? 'pause-circle' : 'play-circle'}
                        size={24}
                        color={isCurrent ? Colors.deepForest : Colors.textMuted}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.divider} />

              {/* Vibration Toggle */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextCol}>
                  <Text style={styles.settingLabel}>{t('Vibrate', 'कंपन')}</Text>
                  <Text style={styles.settingSubtext}>
                    {t('Haptic pulse when alarm triggers', 'अनुस्मारक पर हल्का कंपन')}
                  </Text>
                </View>
                <Switch
                  value={alarmVibrate}
                  onValueChange={setAlarmVibrate}
                  trackColor={{ false: '#DCE6DC', true: Colors.sageGreen }}
                  thumbColor={alarmVibrate ? Colors.deepForest : '#FFFFFF'}
                />
              </View>
            </View>
          )}
        </View>

        {/* Section 4: About & Philosophy */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={Colors.deepForest}
              />
              <Text style={styles.sectionTitle}>{t('About YogaLife', 'योगलाइफ़ के बारे में')}</Text>
            </View>
          </View>

          <View style={styles.aboutContent}>
            <Text style={styles.aboutVersion}>YogaLife v1.0.0</Text>
            <Text style={styles.aboutDesc}>
              {t(
                'YogaLife unites authentic Sanskrit yogic traditions with interactive 3D humanoid biomechanics and intelligent synchronized bilingual voice guidance. Crafted for conscious practitioners worldwide.',
                'योगलाइफ़ पारंपरिक संस्कृत योग दर्शन को 3D मानव बायोमैकेनिक्स और द्विभाषी वाक् मार्गदर्शन के साथ प्रस्तुत करता है।'
              )}
            </Text>

            <View style={styles.aboutFooter}>
              <Ionicons name="heart" size={16} color="#E53935" />
              <Text style={styles.aboutFooterText}>
                {t('Crafted for Health, Peace & Vitality', 'स्वास्थ्य, शांति और जीवनी शक्ति के लिए समर्पित')}
              </Text>
            </View>
          </View>
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
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingTextCol: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  speedPills: {
    flexDirection: 'row',
    backgroundColor: '#EEF5EE',
    borderRadius: 20,
    padding: 2,
  },
  speedPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  speedPillActive: {
    backgroundColor: Colors.deepForest,
  },
  speedPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  speedPillTextActive: {
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F5F0',
    marginVertical: 14,
  },
  alarmContent: {
    marginTop: 8,
  },
  timePickerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timePickerLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBox: {
    alignItems: 'center',
    backgroundColor: Colors.softGreenBg,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DCE6DC',
  },
  stepBtn: {
    padding: 4,
  },
  timeNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.deepForest,
    marginVertical: 2,
  },
  timeColon: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dayChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: {
    backgroundColor: Colors.deepForest,
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dayChipTextActive: {
    color: Colors.white,
  },
  soundPickerLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  soundsList: {
    gap: 8,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F9FBF9',
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  soundRowActive: {
    backgroundColor: '#EFF7EF',
    borderColor: Colors.deepForest,
  },
  soundInfo: {
    flex: 1,
    marginRight: 10,
  },
  soundName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  soundNameActive: {
    color: Colors.deepForest,
  },
  soundDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  aboutVersion: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepForest,
    marginBottom: 6,
  },
  aboutDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  aboutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aboutFooterText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
