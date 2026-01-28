import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../global/hooks';
import { searchStocks } from './api';
import { Loading } from '../../global/components';
import { useTheme, spacing, fontSize } from '../../global/theme';
import type { YahooSearchResultDto, CreateStockDto } from '../../global/types';
import { SearchInput } from './core/SearchInput';
import { SearchResultItem } from './core/SearchResultItem';
import { StockForm } from './core/StockForm';
import { useAddStock } from './core/StockForm/hooks';

const StockAdd = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<YahooSearchResultDto | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['yahooSearch', debouncedQuery],
    queryFn: () => searchStocks(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const { mutate: addStock, isPending } = useAddStock();

  const handleSelectStock = (stock: YahooSearchResultDto) => {
    setSelectedStock(stock);
    setQuery('');
  };

  const handleSubmit = (dto: CreateStockDto) => {
    addStock(dto, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  const handleCancel = () => {
    setSelectedStock(null);
  };

  if (selectedStock) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background.primary }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StockForm
          selectedStock={selectedStock}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isPending}
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.background.secondary }]}>
        <SearchInput value={query} onChangeText={setQuery} />
      </View>

      {isSearching && <Loading message="검색 중..." />}

      {!isSearching && debouncedQuery.length >= 2 && searchResults.length === 0 && (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>검색 결과가 없습니다</Text>
        </View>
      )}

      {!isSearching && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <SearchResultItem item={item} onPress={() => handleSelectStock(item)} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {!isSearching && debouncedQuery.length < 2 && (
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>종목 검색</Text>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>종목명 또는 심볼을 입력해주세요</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: spacing.lg,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.sm,
  },
});

export default StockAdd;
