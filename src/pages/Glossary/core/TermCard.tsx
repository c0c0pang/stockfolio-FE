import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, fontSize, radius } from '../../../global/theme';
import type { GlossaryTerm } from '../../../global/types';

interface TermCardProps {
  term: GlossaryTerm;
  onPress: () => void;
}

export const TermCard: React.FC<TermCardProps> = ({ term, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.termContainer}>
          <Text style={[styles.term, { color: colors.text.primary }]}>
            {term.term}
          </Text>
          {term.termEn && (
            <Text style={[styles.termEn, { color: colors.text.tertiary }]}>
              {term.termEn}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: colors.accent.primary + '20' },
          ]}
        >
          <Text style={[styles.categoryText, { color: colors.accent.primary }]}>
            {term.categoryName}
          </Text>
        </View>
      </View>
      <Text
        style={[styles.definition, { color: colors.text.secondary }]}
        numberOfLines={2}
      >
        {term.definition}
      </Text>
      <View style={styles.footer}>
        <Icon name="chevron-forward" size={16} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  termContainer: {
    flex: 1,
  },
  term: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  termEn: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginLeft: spacing.sm,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  definition: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
});
