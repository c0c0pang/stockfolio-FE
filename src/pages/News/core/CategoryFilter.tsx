import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme, spacing, fontSize, radius } from '../../../global/theme';

type FilterType = 'all' | 'korea' | 'overseas';

interface CategoryFilterProps {
  selected: FilterType;
  onChange: (filter: FilterType) => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'korea', label: '국내' },
  { value: 'overseas', label: '해외' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onChange,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const isSelected = selected === filter.value;
        return (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? colors.accent.primary
                  : colors.background.tertiary,
              },
            ]}
            onPress={() => onChange(filter.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected
                    ? colors.text.inverse
                    : colors.text.secondary,
                },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});

export type { FilterType };
