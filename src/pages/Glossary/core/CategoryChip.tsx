import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, fontSize, radius } from '../../../global/theme';
import type { GlossaryCategory } from '../../../global/types';

interface CategoryChipProps {
  category: GlossaryCategory;
  isSelected: boolean;
  onPress: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  beginner: '📚',
  trading: '📈',
  analysis: '📊',
  news: '📰',
  slang: '💬',
};

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: isSelected
            ? colors.accent.primary
            : colors.background.secondary,
          borderColor: isSelected
            ? colors.accent.primary
            : colors.border.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>
        {CATEGORY_ICONS[category.category] || '📖'}
      </Text>
      <Text
        style={[
          styles.name,
          {
            color: isSelected ? '#FFFFFF' : colors.text.primary,
          },
        ]}
      >
        {category.name}
      </Text>
      <Text
        style={[
          styles.count,
          {
            color: isSelected ? 'rgba(255,255,255,0.8)' : colors.text.tertiary,
          },
        ]}
      >
        {category.count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: fontSize.sm,
    marginRight: spacing.xs,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginRight: spacing.xs,
  },
  count: {
    fontSize: fontSize.xs,
  },
});
