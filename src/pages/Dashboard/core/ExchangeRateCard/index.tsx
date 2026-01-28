import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, fontSize, radius } from '../../../../global/theme';
import { formatNumber } from '../../../../global/utils';

interface ExchangeRateCardProps {
  usdToKrw: number;
  lastUpdated?: string;
  isLoading?: boolean;
}

export const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({
  usdToKrw,
  lastUpdated,
  isLoading,
}) => {
  const { colors, isDark } = useTheme();

  // 업데이트 시간 포맷
  const formatUpdateTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const iconBgColor = isDark ? 'rgba(139, 92, 246, 0.2)' : colors.accent.primary + '15';
  const iconColor = isDark ? '#A78BFA' : colors.accent.primary;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text style={[styles.loadingText, { color: colors.text.tertiary }]}>
            환율 정보 로딩 중...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Icon name="swap-horizontal" size={18} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              USD/KRW 환율
            </Text>
            <Text style={[styles.rate, { color: colors.text.primary }]}>
              1$ = {formatNumber(Math.round(usdToKrw))}원
            </Text>
          </View>
        </View>
        {lastUpdated && (
          <Text style={[styles.updated, { color: colors.text.tertiary }]}>
            {formatUpdateTime(lastUpdated)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  textContainer: {
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  rate: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  updated: {
    fontSize: fontSize.xs,
  },
  loadingText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
