import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, fontSize, radius } from '../../global/theme';
import { glossaryApi } from '../../global/api';
import { useDebounce } from '../../global/hooks';
import { ScreenContainer, TermCardSkeleton } from '../../global/components';
import type { GlossaryTerm } from '../../global/types';
import { TermCard } from './core/TermCard';
import { CategoryChip } from './core/CategoryChip';
import { TermDetail } from './core/TermDetail';

const Glossary = () => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const debouncedSearch = useDebounce(searchQuery.trim(), 500);

  // 카테고리 조회
  const { data: categoryData } = useQuery({
    queryKey: ['glossaryCategories'],
    queryFn: () => glossaryApi.getCategories(),
  });

  // 용어 목록 조회
  const {
    data: termsData,
    isLoading: isLoadingTerms,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['glossaryTerms', selectedCategory],
    queryFn: () => glossaryApi.getTerms(selectedCategory || undefined),
    enabled: !debouncedSearch,
    placeholderData: (prev) => prev, // 이전 데이터 유지
  });

  // 검색 결과
  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ['glossarySearch', debouncedSearch],
    queryFn: () => glossaryApi.search(debouncedSearch),
    enabled: debouncedSearch.length >= 1,
    placeholderData: (prev) => prev, // 이전 데이터 유지
  });

  // 오늘의 용어
  const { data: randomTerm } = useQuery({
    queryKey: ['glossaryRandom'],
    queryFn: () => glossaryApi.getRandom(),
    staleTime: 1000 * 60 * 60, // 1시간
  });

  const categories = categoryData?.categories || [];
  const terms = debouncedSearch.length >= 1
    ? searchData?.results || []
    : termsData?.terms || [];

  const isLoading = debouncedSearch.length >= 1 ? isSearching : isLoadingTerms;

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory(prev => prev === category ? null : category);
    setSearchQuery('');
  }, []);

  const handleTermPress = useCallback((term: GlossaryTerm) => {
    setSelectedTerm(term);
  }, []);

  const renderListHeader = useCallback(() => (
    <View style={styles.listHeaderContainer}>
      {/* 오늘의 용어 */}
      {randomTerm && !debouncedSearch && !selectedCategory && (
        <TouchableOpacity
          style={[styles.todayCard, { backgroundColor: colors.accent.primary + '15' }]}
          onPress={() => handleTermPress(randomTerm)}
          activeOpacity={0.7}
        >
          <View style={styles.todayHeader}>
            <Icon name="bulb" size={18} color={colors.accent.primary} style={styles.todayIcon} />
            <Text style={[styles.todayLabel, { color: colors.accent.primary }]}>
              오늘의 용어
            </Text>
          </View>
          <Text style={[styles.todayTerm, { color: colors.text.primary }]}>
            {randomTerm.term}
          </Text>
          <Text
            style={[styles.todayDefinition, { color: colors.text.secondary }]}
            numberOfLines={2}
          >
            {randomTerm.definition}
          </Text>
        </TouchableOpacity>
      )}

      {/* 카테고리 */}
      {!debouncedSearch && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((item) => (
            <CategoryChip
              key={item.category}
              category={item}
              isSelected={selectedCategory === item.category}
              onPress={() => handleCategoryPress(item.category)}
            />
          ))}
        </ScrollView>
      )}

      {/* 결과 수 */}
      <View style={styles.resultHeader}>
        <Text style={[styles.resultCount, { color: colors.text.secondary }]}>
          {debouncedSearch.length >= 1
            ? `"${debouncedSearch}" 검색 결과 ${terms.length}건`
            : selectedCategory
            ? `${categories.find(c => c.category === selectedCategory)?.name} ${terms.length}개`
            : `전체 용어 ${terms.length}개`}
        </Text>
      </View>
    </View>
  ), [randomTerm, debouncedSearch, selectedCategory, categories, terms.length, colors, handleTermPress, handleCategoryPress]);

  return (
    <ScreenContainer>
      {/* 검색 - FlatList 밖에 배치 */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchContainer, { backgroundColor: colors.background.secondary }]}>
          <Icon name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="용어 검색..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Icon name="close-circle" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={terms}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TermCard term={item} onPress={() => handleTermPress(item)} />
        )}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent.primary}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              <TermCardSkeleton />
              <TermCardSkeleton />
              <TermCardSkeleton />
              <TermCardSkeleton />
              <TermCardSkeleton />
            </View>
          ) : (
            <View style={styles.empty}>
              <Icon name="search" size={48} color={colors.text.tertiary} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                {debouncedSearch.length >= 1
                  ? '검색 결과가 없습니다'
                  : '용어가 없습니다'}
              </Text>
            </View>
          )
        }
      />

      {/* 용어 상세 모달 */}
      {selectedTerm && (
        <TermDetail
          termId={selectedTerm.id}
          visible={!!selectedTerm}
          onClose={() => setSelectedTerm(null)}
          onTermPress={handleTermPress}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  listHeaderContainer: {
    paddingHorizontal: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    paddingVertical: spacing.xs,
  },
  todayCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  todayIcon: {
    marginRight: spacing.xs,
  },
  todayLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  todayTerm: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  todayDefinition: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  categoriesContainer: {
    paddingVertical: spacing.sm,
  },
  resultHeader: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  resultCount: {
    fontSize: fontSize.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
  },
});

export default Glossary;
