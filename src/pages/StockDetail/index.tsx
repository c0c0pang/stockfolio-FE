import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Button, StockDetailSkeleton } from '../../global/components';
import { useTheme, spacing, fontSize } from '../../global/theme';
import { getStock, getQuote } from './api';
import type { RootStackParamList } from '../../global/navigation';
import type { UpdateStockDto } from '../../global/types';
import { PriceInfo } from './core/PriceInfo';
import { ProfitInfo } from './core/ProfitInfo';
import { EditForm } from './core/EditForm';
import { DeleteButton } from './core/DeleteButton';
import { useUpdateStock } from './core/EditForm/hooks';
import { useDeleteStock } from './core/DeleteButton/hooks';

type StockDetailRouteProp = RouteProp<RootStackParamList, 'StockDetail'>;

const StockDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<StockDetailRouteProp>();
  const { colors } = useTheme();
  const { stockId } = route.params;

  const [isEditing, setIsEditing] = useState(false);

  const {
    data: stock,
    isLoading: isStockLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['stock', stockId],
    queryFn: () => getStock(stockId),
  });

  const { data: quote, isLoading: isQuoteLoading } = useQuery({
    queryKey: ['quote', stock?.symbol],
    queryFn: () => getQuote(stock!.symbol),
    enabled: !!stock?.symbol,
  });

  const { mutate: updateStock, isPending: isUpdating } = useUpdateStock(stockId);
  const { mutate: deleteStock, isPending: isDeleting } = useDeleteStock(stockId);

  const handleUpdate = (dto: UpdateStockDto) => {
    updateStock(dto, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleDelete = () => {
    deleteStock(undefined, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  if (!stock && !isStockLoading) {
    return (
      <View style={[styles.error, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.text.secondary }]}>종목을 찾을 수 없습니다</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.accent.primary}
        />
      }>
      {isStockLoading ? (
        <StockDetailSkeleton />
      ) : stock ? (
        <>
          <View style={styles.header}>
            <View style={[
              styles.categoryBadge,
              stock.category === 'domestic'
                ? { backgroundColor: 'rgba(124, 58, 237, 0.2)' }
                : { backgroundColor: 'rgba(0, 208, 156, 0.2)' },
            ]}>
              <Text style={[
                styles.categoryText,
                { color: stock.category === 'domestic' ? colors.accent.secondary : colors.accent.primary },
              ]}>
                {stock.category === 'domestic' ? '국내' : '해외'}
              </Text>
            </View>
            <Text style={[styles.name, { color: colors.text.primary }]}>{stock.name}</Text>
            <Text style={[styles.symbol, { color: colors.text.secondary }]}>{stock.symbol}</Text>
          </View>

          {quote && !isQuoteLoading && <PriceInfo quote={quote} />}

          {isEditing ? (
            <EditForm
              stock={stock}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isLoading={isUpdating}
            />
          ) : (
            <>
              <ProfitInfo stock={stock} />
              <Button
                title="수정하기"
                variant="secondary"
                onPress={() => setIsEditing(true)}
              />
            </>
          )}

          <DeleteButton
            stockName={stock.name}
            onDelete={handleDelete}
            isLoading={isDeleting}
          />
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    marginBottom: spacing.sm,
  },
  domesticBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  overseasBadge: {
    backgroundColor: 'rgba(0, 208, 156, 0.2)',
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  symbol: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fontSize.md,
  },
});

export default StockDetail;
