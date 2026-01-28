import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { newsApi } from '../../global/api';
import { ScreenContainer, NewsCardSkeleton } from '../../global/components';
import { useTheme, spacing, fontSize } from '../../global/theme';
import type { NewsItemDto } from '../../global/types';
import { NewsCard } from './core/NewsCard';
import { CategoryFilter, FilterType } from './core/CategoryFilter';
import { SearchBar } from './core/SearchBar';

const PAGE_SIZE = 20;

const News = () => {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 검색어 디바운스 처리
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchText]);

  const isSearchMode = debouncedSearch.length > 0;

  // 무한스크롤을 위한 useInfiniteQuery
  // 참고: 국내/해외 탭은 API가 페이지네이션을 지원하지 않아 한 번에 50개 로드
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['news', filter, debouncedSearch],
    queryFn: async ({ pageParam }) => {
      // 검색 모드
      if (isSearchMode) {
        return newsApi.searchNews(debouncedSearch, PAGE_SIZE, pageParam);
      }

      switch (filter) {
        case 'korea':
          // 페이지네이션 미지원 - 한 번에 50개 로드
          return newsApi.getKoreanMarketNews(50);
        case 'overseas':
          // 페이지네이션 미지원 - 한 번에 50개 로드
          return newsApi.getMarketNews(undefined, 50);
        default:
          // 통합 뉴스는 무한스크롤 지원
          return newsApi.getCombinedNews(PAGE_SIZE, pageParam);
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // API 응답의 hasMore 필드 확인 (통합 뉴스, 검색 지원)
      const response = lastPage as { hasMore?: boolean };
      if (response.hasMore === true) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 모든 페이지의 뉴스를 하나로 합침
  const news = data?.pages.flatMap((page) => page.news) ?? [];

  const renderItem = useCallback(
    ({ item }: { item: NewsItemDto }) => <NewsCard item={item} />,
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearchText('');
    setDebouncedSearch('');
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        증시 뉴스
      </Text>
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        국내외 주요 증시 소식을 확인하세요
      </Text>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={handleClearSearch}
          placeholder="종목명, 키워드 검색..."
        />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View>
          <NewsCardSkeleton />
          <NewsCardSkeleton />
          <NewsCardSkeleton />
          <NewsCardSkeleton />
          <NewsCardSkeleton />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
          {error
            ? '뉴스를 불러올 수 없습니다'
            : isSearchMode
              ? `'${debouncedSearch}'에 대한 검색 결과가 없습니다`
              : '뉴스가 없습니다'}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <NewsCardSkeleton />
        </View>
      );
    }

    if (!hasNextPage && news.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
            모든 뉴스를 불러왔습니다
          </Text>
        </View>
      );
    }

    return null;
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ScreenContainer>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {!isSearchMode && (
              <CategoryFilter selected={filter} onChange={setFilter} />
            )}
          </>
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor={colors.accent.primary}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
  },
  searchContainer: {
    marginTop: spacing.md,
    marginHorizontal: -spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    padding: spacing.xl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
  },
});

export default News;
