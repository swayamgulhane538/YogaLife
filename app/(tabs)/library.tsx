import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Shadows } from '@/constants/theme';
import { useLanguageStore } from '@/stores/languageStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { yogaPoses, YogaPose, getPoseImage } from '@/data/poses';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChips } from '@/components/ui/FilterChips';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 32 - CARD_GAP) / 2;

export default function LibraryScreen() {
  const { t, language } = useLanguageStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categoryOptions = useMemo(
    () => [
      { label: t('All Poses', 'सभी आसन'), value: 'all' },
      { label: t('Standing', 'खड़े होकर'), value: 'standing' },
      { label: t('Seated', 'बैठकर'), value: 'seated' },
      { label: t('Supine', 'पीठ के बल'), value: 'supine' },
      { label: t('Prone', 'पेट के बल'), value: 'prone' },
      { label: t('Sequence', 'क्रम/प्रवाह'), value: 'sequence' },
    ],
    [t]
  );

  const difficultyOptions = useMemo(
    () => [
      { label: t('All Levels', 'सभी स्तर'), value: 'all' },
      { label: t('Beginner', 'शुरुआती'), value: 'beginner' },
      { label: t('Intermediate', 'मध्यम'), value: 'intermediate' },
    ],
    [t]
  );

  const filteredPoses = useMemo(() => {
    let result = yogaPoses;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(
        (p) => p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        return (
          p.sanskritName.toLowerCase().includes(q) ||
          p.englishName.toLowerCase().includes(q) ||
          p.hindiName.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const renderPoseCard = ({ item }: { item: YogaPose }) => {
    const favorite = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/pose/${item.id}`)}
        activeOpacity={0.8}
      >
        {/* Top Badges & Favorite Heart */}
        <View style={styles.cardTopRow}>
          <View
            style={[
              styles.difficultyBadge,
              item.difficulty === 'beginner' ? styles.beginnerBadge : styles.intermediateBadge,
            ]}
          >
            <Text style={styles.difficultyBadgeText}>
              {t(item.difficulty, item.difficulty === 'beginner' ? 'शुरुआती' : 'मध्यम')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.heartButton}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={18}
              color={favorite ? Colors.error : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Pose Visual / Photo Box */}
        <View style={styles.poseIconBox}>
          <Image
            source={getPoseImage(item.id)}
            style={styles.poseImage}
            resizeMode="contain"
          />
        </View>

        {/* Pose Titles */}
        <Text style={styles.sanskritTitle} numberOfLines={1}>
          {item.sanskritName}
        </Text>
        <Text style={styles.primaryTitle} numberOfLines={1}>
          {language === 'hi' ? item.hindiName : item.englishName}
        </Text>
        <Text style={styles.secondaryTitle} numberOfLines={1}>
          {language === 'hi' ? item.englishName : item.hindiName}
        </Text>

        {/* Card Footer: Category & Duration */}
        <View style={styles.cardFooter}>
          <Text style={styles.categoryLabel}>{item.category}</Text>
          <View style={styles.durationPill}>
            <Ionicons name="timer-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.durationLabel}>{item.duration}s</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen Header matching Lovable Postures */}
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
            <Ionicons name="leaf" size={13} color={Colors.primary} />
            <Text style={styles.eyebrowText}>
              {t('Explore your possibilities', 'अपनी संभावनाएं खोजें 🌿')}
            </Text>
          </View>
          <Text style={styles.screenTitle}>
            {t('Every pose is a beginning.', 'प्रत्येक आसन एक नई शुरुआत है।')}
          </Text>
          <Text style={styles.screenSubtitle}>
            {t(
              'Learn the foundations. Find your alignment. Move with awareness, not perfection.',
              'मूल सिद्धांतों को समझें। संरेखण खोजें। जागरूकता के साथ अभ्यास करें।'
            )}
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('Search a pose or Sanskrit name…', 'आसन या संस्कृत नाम से खोजें…')}
          />
        </View>

        {/* Category Filter Chips */}
        <FilterChips
          options={categoryOptions}
          selected={[selectedCategory]}
          onSelect={(val) => setSelectedCategory(val)}
          style={styles.filterRow}
        />

        {/* Difficulty Filter Chips */}
        <FilterChips
          options={difficultyOptions}
          selected={[selectedDifficulty]}
          onSelect={(val) => setSelectedDifficulty(val)}
          style={styles.filterRowSecondary}
        />

        {/* Grid of Poses */}
        <FlatList
          data={filteredPoses}
          keyExtractor={(item) => item.id}
          renderItem={renderPoseCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>
                {t('No poses found', 'कोई आसन नहीं मिला')}
              </Text>
              <Text style={styles.emptySubtitle}>
                {t(
                  'Try modifying your filters or searching with another keyword',
                  'कृपया अपनी खोज या फ़िल्टर बदलकर पुनः प्रयास करें'
                )}
              </Text>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
              >
                <Text style={styles.resetBtnText}>{t('Reset Filters', 'फ़िल्टर हटाएं')}</Text>
              </TouchableOpacity>
            </View>
          }
        />
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    marginBottom: 12,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 4,
  },
  filterRowSecondary: {
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 12,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: '#E8F0E8',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  beginnerBadge: {
    backgroundColor: '#E8F5E9',
  },
  intermediateBadge: {
    backgroundColor: '#FFF8E1',
  },
  difficultyBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  heartButton: {
    padding: 2,
  },
  poseIconBox: {
    height: 96,
    backgroundColor: '#F5FAF5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DFEADF',
    overflow: 'hidden',
    padding: 6,
  },
  poseImage: {
    width: '100%',
    height: '100%',
  },
  sanskritTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.deepForest,
  },
  primaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  secondaryTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
  },
  categoryLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  resetBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.deepForest,
    borderRadius: 20,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },
});
