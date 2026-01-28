import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../../global/navigation';
import type { StockCategory } from '../../global/types';
import { ScreenContainer, StockCardSkeleton } from '../../global/components';
import { useTheme, spacing, fontSize, radius } from '../../global/theme';
import { useAuthStore } from '../../global/stores';
import { CategoryTab } from './core/CategoryTab';
import { StockList } from './core/StockList';
import { useStocks } from './core/StockList/hooks';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Portfolio = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] =
    useState<StockCategory | null>(null);
  const { investmentProfile, openOnboarding } = useAuthStore();

  const {
    data: stocks = [],
    isLoading,
    refetch,
    isRefetching,
  } = useStocks(selectedCategory);

  const handleStockPress = (stockId: number) => {
    navigation.navigate('StockDetail', { stockId });
  };

  const handleAddPress = () => {
    navigation.navigate('StockAdd');
  };

  const renderRecommendationBanner = () => {
    // 투자 프로필이 없는 경우 진단 유도 배너
    if (!investmentProfile) {
      return (
        <TouchableOpacity
          style={[
            styles.banner,
            { backgroundColor: colors.accent.primary + '15' },
          ]}
          onPress={openOnboarding}
          activeOpacity={0.7}
        >
          <View style={styles.bannerContent}>
            <View
              style={[
                styles.bannerIconContainer,
                { backgroundColor: colors.accent.primary + '20' },
              ]}
            >
              <Icon name="bulb" size={24} color={colors.accent.primary} />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text
                style={[styles.bannerTitle, { color: colors.text.primary }]}
              >
                투자 성향을 진단해보세요
              </Text>
              <Text
                style={[
                  styles.bannerSubtitle,
                  { color: colors.text.secondary },
                ]}
              >
                맞춤형 포트폴리오 추천을 받을 수 있어요
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={20}
              color={colors.text.tertiary}
            />
          </View>
        </TouchableOpacity>
      );
    }

    // 추천 상품이 있는 경우
    const { recommendedProducts, gradeName } = investmentProfile;

    return (
      <View
        style={[
          styles.recommendBanner,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        <View style={styles.recommendHeader}>
          <View style={styles.recommendTitleRow}>
            <Icon
              name="sparkles"
              size={18}
              color={colors.accent.primary}
              style={styles.recommendIcon}
            />
            <Text
              style={[styles.recommendTitle, { color: colors.text.primary }]}
            >
              {gradeName} 추천 상품
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendList}
        >
          {recommendedProducts.map((product, index) => (
            <View
              key={index}
              style={[
                styles.recommendCard,
                { backgroundColor: colors.background.primary },
              ]}
            >
              <View style={styles.recommendCardHeader}>
                <Text
                  style={[
                    styles.recommendCategory,
                    { color: colors.text.primary },
                  ]}
                >
                  {product.category}
                </Text>
                <View
                  style={[
                    styles.ratioTag,
                    { backgroundColor: colors.accent.primary + '20' },
                  ]}
                >
                  <Text
                    style={[styles.ratioText, { color: colors.accent.primary }]}
                  >
                    {product.ratio}%
                  </Text>
                </View>
              </View>
              <View style={styles.examplesContainer}>
                {product.examples.slice(0, 2).map((example, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.exampleText,
                      { color: colors.text.secondary },
                    ]}
                    numberOfLines={1}
                  >
                    • {example}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View
        style={[styles.container, { backgroundColor: colors.background.primary }]}
      >
        <View style={styles.content}>
          {renderRecommendationBanner()}
          <CategoryTab
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <StockCardSkeleton />
              <StockCardSkeleton />
              <StockCardSkeleton />
              <StockCardSkeleton />
            </View>
          ) : (
            <StockList
              stocks={stocks}
              onStockPress={handleStockPress}
              refreshing={isRefetching}
              onRefresh={refetch}
            />
          )}
        </View>
      <TouchableOpacity
        onPress={handleAddPress}
        activeOpacity={0.8}
        style={[styles.fabContainer, { shadowColor: colors.accent.secondary }]}
      >
        <LinearGradient
          colors={Array.from(colors.gradient.primary)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <Icon name="add" size={28} color={colors.text.inverse} />
        </LinearGradient>
      </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  // 투자성향 진단 유도 배너
  banner: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: fontSize.sm,
  },
  // 추천 상품 배너
  recommendBanner: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  recommendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recommendTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendIcon: {
    marginRight: spacing.xs,
  },
  recommendTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  recommendList: {
    paddingRight: spacing.md,
  },
  recommendCard: {
    width: 140,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  recommendCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  recommendCategory: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  ratioTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  ratioText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  examplesContainer: {
    marginTop: spacing.xs,
  },
  exampleText: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
  },
});

export default Portfolio;
