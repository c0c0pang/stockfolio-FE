import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { StockCategory } from '../../../../global/types';
import { useTheme, spacing, fontSize, radius } from '../../../../global/theme';

type TabValue = StockCategory | null;

interface Tab {
  label: string;
  value: TabValue;
}

const TABS: Tab[] = [
  { label: '전체', value: null },
  { label: '국내', value: 'domestic' },
  { label: '해외', value: 'overseas' },
];

interface CategoryTabProps {
  selected: TabValue;
  onChange: (value: TabValue) => void;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  selected,
  onChange,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          style={[
            styles.tab,
            selected === tab.value && { backgroundColor: colors.background.tertiary },
          ]}
          onPress={() => onChange(tab.value)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.tabText,
              { color: colors.text.tertiary },
              selected === tab.value && { color: colors.accent.primary },
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
