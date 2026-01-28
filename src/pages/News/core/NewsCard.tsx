import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NewsItemDto } from '../../../global/types';
import type { RootStackParamList } from '../../../global/navigation';
import { useTheme, spacing, fontSize, radius } from '../../../global/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NewsCardProps {
  item: NewsItemDto;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (item.url) {
      navigation.navigate('NewsWebView', {
        url: item.url,
        title: item.title,
      });
    }
  };

  // 시간 포맷
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    }
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    if (diffDays < 7) {
      return `${diffDays}일 전`;
    }
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  // 뉴스 소스 태그 색상
  const getSourceColor = () => {
    return item.newsSource === 'naver'
      ? colors.accent.primary
      : colors.accent.secondary;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.sourceTag,
              { backgroundColor: getSourceColor() + '20' },
            ]}
          >
            <Text style={[styles.sourceText, { color: getSourceColor() }]}>
              {item.newsSource === 'naver' ? '국내' : '해외'}
            </Text>
          </View>
          <Text style={[styles.time, { color: colors.text.tertiary }]}>
            {formatTime(item.publishedAt)}
          </Text>
        </View>

        <Text
          style={[styles.title, { color: colors.text.primary }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {item.summary && (
          <Text
            style={[styles.summary, { color: colors.text.secondary }]}
            numberOfLines={2}
          >
            {item.summary}
          </Text>
        )}

        <Text style={[styles.source, { color: colors.text.tertiary }]}>
          {item.source}
        </Text>
      </View>

      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sourceTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  sourceText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  time: {
    fontSize: fontSize.xs,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  summary: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  source: {
    fontSize: fontSize.xs,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    marginLeft: spacing.md,
  },
});
