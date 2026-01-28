import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { YahooSearchResultDto } from '../../../../global/types';
import { useTheme, spacing, fontSize } from '../../../../global/theme';

interface SearchResultItemProps {
  item: YahooSearchResultDto;
  onPress: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  onPress,
}) => {
  const { colors } = useTheme();
  const isKorean = item.symbol.endsWith('.KS') || item.symbol.endsWith('.KQ');

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary, borderBottomColor: colors.border.secondary },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.main}>
          <Text style={[styles.symbol, { color: colors.accent.primary }]}>{item.symbol}</Text>
          <Text style={[styles.name, { color: colors.text.primary }]} numberOfLines={1}>
            {item.shortname || item.longname}
          </Text>
        </View>
        <View style={styles.sub}>
          <View style={[styles.badge, isKorean ? styles.domesticBadge : styles.overseasBadge]}>
            <Text
              style={[
                styles.badgeText,
                { color: isKorean ? colors.accent.secondary : colors.accent.primary },
              ]}>
              {isKorean ? '국내' : '해외'}
            </Text>
          </View>
          <Text style={[styles.exchange, { color: colors.text.tertiary }]}>{item.exchDisp}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  symbol: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginRight: spacing.md,
    minWidth: 80,
  },
  name: {
    flex: 1,
    fontSize: fontSize.sm,
  },
  sub: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.xs,
    marginRight: spacing.sm,
  },
  domesticBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  overseasBadge: {
    backgroundColor: 'rgba(0, 208, 156, 0.2)',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  exchange: {
    fontSize: fontSize.xs,
  },
});
