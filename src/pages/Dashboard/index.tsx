import React from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  Text,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import {
  ScreenContainer,
  ThemeToggle,
  TotalAssetCardSkeleton,
  ExchangeRateCardSkeleton,
  ProfitRateCardSkeleton,
  AllocationChartSkeleton,
} from '../../global/components';
import { useTheme, spacing, fontSize } from '../../global/theme';
import { useAuthStore } from '../../global/stores';
import {
  calculateTotalAsset,
  calculateTotalProfitPercent,
} from '../../global/utils';
import { TotalAssetCard } from './core/TotalAssetCard';
import { ProfitRateCard } from './core/ProfitRateCard';
import { AllocationChart } from './core/AllocationChart';
import { ExchangeRateCard } from './core/ExchangeRateCard';
import { useAllocationData } from './core/AllocationChart/hooks';
import { getStocks } from './api';
import { exchangeRateApi } from '../../global/api';

const Dashboard = () => {
  const { colors } = useTheme();
  const { user } = useAuthStore();

  const {
    data: stocks = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: getStocks,
  });

  // 환율 조회
  const {
    data: exchangeRate,
    isLoading: isExchangeRateLoading,
  } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: exchangeRateApi.getUsdToKrw,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 24, // 24시간
  });

  const usdToKrw = exchangeRate?.usdToKrw;
  const totalAsset = calculateTotalAsset(stocks, usdToKrw);
  const profitPercent = calculateTotalProfitPercent(stocks, usdToKrw);
  const allocationData = useAllocationData(stocks, usdToKrw);

  // 총 매입가 계산 (환율 적용)
  const totalCost = stocks.reduce((sum, s) => {
    const cost = s.quantity * s.avgPrice;
    if (s.currency === 'USD' && usdToKrw) {
      return sum + cost * usdToKrw;
    }
    return sum + cost;
  }, 0);
  const profitAmount = totalAsset - totalCost;

  return (
    <ScreenContainer>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background.primary }]}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.greeting, { color: colors.text.primary }]}>
                안녕하세요, {user?.nickname ?? '사용자'}님 👋
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                오늘의 포트폴리오 현황입니다
              </Text>
            </View>
            <ThemeToggle size="small" />
          </View>
        </View>
        {isLoading ? (
          <>
            <TotalAssetCardSkeleton />
            <ExchangeRateCardSkeleton />
            <ProfitRateCardSkeleton />
            <AllocationChartSkeleton />
          </>
        ) : (
          <>
            <TotalAssetCard
              totalAsset={totalAsset}
              exchangeRate={exchangeRate?.usdToKrw}
            />
            <ExchangeRateCard
              usdToKrw={exchangeRate?.usdToKrw ?? 0}
              lastUpdated={exchangeRate?.lastUpdated}
              isLoading={isExchangeRateLoading}
            />
            <ProfitRateCard
              profitPercent={profitPercent}
              profitAmount={profitAmount}
              exchangeRate={usdToKrw}
            />
            <AllocationChart data={allocationData} />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
  },
});

export default Dashboard;
