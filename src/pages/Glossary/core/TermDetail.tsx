import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, fontSize, radius } from '../../../global/theme';
import { glossaryApi } from '../../../global/api';
import { Drawer, Loading } from '../../../global/components';
import type { GlossaryTerm } from '../../../global/types';

interface TermDetailProps {
  termId: number;
  visible: boolean;
  onClose: () => void;
  onTermPress: (term: GlossaryTerm) => void;
}

export const TermDetail: React.FC<TermDetailProps> = ({
  termId,
  visible,
  onClose,
  onTermPress,
}) => {
  const { colors } = useTheme();

  const { data: term, isLoading } = useQuery({
    queryKey: ['glossaryTerm', termId],
    queryFn: () => glossaryApi.getTerm(termId),
    enabled: visible,
  });

  const { data: relatedTerms } = useQuery({
    queryKey: ['glossaryRelated', termId],
    queryFn: () => glossaryApi.getRelatedTerms(termId),
    enabled: visible && !!term?.relatedTerms?.length,
  });

  const handleRelatedTermPress = (relatedTerm: GlossaryTerm) => {
    onTermPress(relatedTerm);
  };

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      title="용어 상세"
      height="80%"
    >
      {isLoading || !term ? (
        <Loading message="불러오는 중..." />
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 용어명 */}
          <View style={styles.termHeader}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.accent.primary + '20' },
              ]}
            >
              <Text
                style={[styles.categoryText, { color: colors.accent.primary }]}
              >
                {term.categoryName}
              </Text>
            </View>
            <Text style={[styles.term, { color: colors.text.primary }]}>
              {term.term}
            </Text>
            {term.termEn && (
              <Text style={[styles.termEn, { color: colors.text.tertiary }]}>
                {term.termEn}
              </Text>
            )}
          </View>

          {/* 정의 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              정의
            </Text>
            <Text style={[styles.definition, { color: colors.text.primary }]}>
              {term.definition}
            </Text>
          </View>

          {/* 예시 */}
          {term.example && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                예시
              </Text>
              <View
                style={[
                  styles.exampleBox,
                  { backgroundColor: colors.background.secondary },
                ]}
              >
                <Text style={[styles.example, { color: colors.text.primary }]}>
                  {term.example}
                </Text>
              </View>
            </View>
          )}

          {/* 연관 용어 */}
          {relatedTerms && relatedTerms.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                연관 용어
              </Text>
              <View style={styles.relatedContainer}>
                {relatedTerms.map((relatedTerm) => (
                  <TouchableOpacity
                    key={relatedTerm.id}
                    style={[
                      styles.relatedCard,
                      {
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.primary,
                      },
                    ]}
                    onPress={() => handleRelatedTermPress(relatedTerm)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.relatedTerm, { color: colors.text.primary }]}
                    >
                      {relatedTerm.term}
                    </Text>
                    <Text
                      style={[
                        styles.relatedDefinition,
                        { color: colors.text.secondary },
                      ]}
                      numberOfLines={2}
                    >
                      {relatedTerm.definition}
                    </Text>
                    <Icon
                      name="chevron-forward"
                      size={14}
                      color={colors.text.tertiary}
                      style={styles.relatedIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  termHeader: {
    marginBottom: spacing.xl,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  term: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  termEn: {
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  definition: {
    fontSize: fontSize.md,
    lineHeight: 26,
  },
  exampleBox: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  example: {
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  relatedContainer: {
    gap: spacing.sm,
  },
  relatedCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  relatedTerm: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  relatedDefinition: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  relatedIcon: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
});
