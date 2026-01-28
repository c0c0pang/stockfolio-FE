import React from 'react';
import { FlatList, Text, StyleSheet, View, RefreshControl } from 'react-native';
import type { StockResponseDto } from '../../../../global/types';
import { StockCard } from '../StockCard';
import { useTheme, spacing, fontSize } from '../../../../global/theme';

interface StockListProps {
  stocks: StockResponseDto[];
  onStockPress: (stockId: number) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  onStockPress,
  refreshing,
  onRefresh,
}) => {
  const { colors } = useTheme();

  if (stocks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: colors.text.secondary }]}>등록된 종목이 없습니다</Text>
        <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>+ 버튼을 눌러 종목을 추가해보세요</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={stocks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <StockCard stock={item} onPress={() => onStockPress(item.id)} />
      )}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing ?? false}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing.lg,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
  },
});
