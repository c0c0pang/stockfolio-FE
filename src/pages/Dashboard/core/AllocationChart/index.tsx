import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, fontSize, radius } from '../../../../global/theme';

interface AllocationData {
  label: string;
  value: number;
  color: string;
}

interface AllocationChartProps {
  data: AllocationData[];
}

const CHART_SIZE = 160;
const INNER_RADIUS = 45;

export const AllocationChart: React.FC<AllocationChartProps> = ({ data }) => {
  const { colors, isDark } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }]}>
        <View style={styles.titleRow}>
          <View style={[styles.titleIcon, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : colors.accent.primary + '15' }]}>
            <Icon name="pie-chart" size={16} color={isDark ? '#A78BFA' : colors.accent.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            자산 배분
          </Text>
        </View>
        <Text style={[styles.empty, { color: colors.text.tertiary }]}>
          등록된 종목이 없습니다
        </Text>
      </View>
    );
  }

  // victory-native용 데이터 변환
  const chartData = data
    .filter((item) => item.value > 0)
    .map((item) => ({
      label: item.label,
      value: item.value,
      color: item.color,
    }));

  return (
    <View style={[styles.card, { backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }]}>
      <View style={styles.titleRow}>
        <View style={[styles.titleIcon, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : colors.accent.primary + '15' }]}>
          <Icon name="pie-chart" size={16} color={isDark ? '#A78BFA' : colors.accent.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          자산 배분
        </Text>
      </View>

      <View style={styles.chartContainer}>
        {/* 도넛 차트 */}
        <View style={styles.chartWrapper}>
          <PolarChart
            data={chartData}
            labelKey="label"
            valueKey="value"
            colorKey="color"
          >
            <Pie.Chart innerRadius={INNER_RADIUS} />
          </PolarChart>

          {/* 중앙 총 자산 표시 */}
          <View style={styles.centerLabel}>
            <Text style={[styles.centerTitle, { color: colors.text.secondary }]}>
              총 자산
            </Text>
            <Text style={[styles.centerValue, { color: colors.text.primary }]}>
              {(total / 10000).toFixed(0)}만
            </Text>
          </View>
        </View>

        {/* 범례 */}
        <View style={styles.legend}>
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            if (item.value === 0) {
              return null;
            }
            return (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text
                  style={[styles.legendLabel, { color: colors.text.secondary }]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <Text
                  style={[styles.legendValue, { color: colors.text.primary }]}
                >
                  {percentage}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartWrapper: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    position: 'relative',
  },
  centerLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  centerValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  legend: {
    flex: 1,
    marginLeft: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  legendLabel: {
    flex: 1,
    fontSize: fontSize.xs,
  },
  legendValue: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  empty: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
