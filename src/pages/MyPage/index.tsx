import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, fontSize } from '../../global/theme';
import { useAuthStore } from '../../global/stores';
import { Button, ScreenContainer } from '../../global/components';

const MyPage = () => {
  const { colors } = useTheme();
  const { user, investmentProfile, openOnboarding, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const handleRetakeOnboarding = () => {
    Alert.alert(
      '투자성향 다시 진단',
      '투자성향을 다시 진단하시겠습니까?\n기존 결과는 새로운 결과로 대체됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '진단하기',
          onPress: openOnboarding,
        },
      ],
    );
  };

  // 등급별 이미지 - grade 1이 가장 공격적, grade 5가 가장 안정적
  const gradeImages: Record<number, ImageSourcePropType> = {
    1: require('../../assets/images/grade_1_aggressive.png'),
    2: require('../../assets/images/grade_2_active.png'),
    3: require('../../assets/images/grade_3_neutral.png'),
    4: require('../../assets/images/grade_4_stable.png'),
    5: require('../../assets/images/grade_5_conservative.png'),
  };

  const getGradeImage = (grade: number): ImageSourcePropType => {
    return gradeImages[grade] || gradeImages[3];
  };

  // 등급별 색상 - grade 1이 가장 공격적(빨강), grade 5가 가장 안정적(초록)
  const getGradeColor = (grade: number): string => {
    const gradeColors: Record<number, string> = {
      1: colors.status.error,    // 공격투자형 - 빨강
      2: '#F97316',              // 적극투자형 - 주황
      3: colors.status.warning,  // 위험중립형 - 노랑
      4: '#34D399',              // 안정추구형 - 연초록
      5: colors.status.success,  // 안정형 - 초록
    };
    return gradeColors[grade] || colors.accent.primary;
  };

  const getMarketPreferenceLabel = (pref: string): string => {
    const labels: Record<string, string> = {
      domestic_only: '국내만',
      domestic_preferred: '국내 선호',
      balanced: '균형',
      us_preferred: '해외 선호',
      us_only: '해외만',
    };
    return labels[pref] || pref;
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 프로필 섹션 */}
        <View
          style={[
            styles.profileSection,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.accent.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {user?.nickname?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.nickname, { color: colors.text.primary }]}>
            {user?.nickname || '사용자'}
          </Text>
          <Text style={[styles.email, { color: colors.text.secondary }]}>
            {user?.email || ''}
          </Text>
        </View>

        {/* 투자성향 섹션 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            투자성향
          </Text>
          {investmentProfile ? (
            <View
              style={[
                styles.profileCard,
                { backgroundColor: colors.background.secondary },
              ]}
            >
              <View style={styles.profileHeader}>
                <View
                  style={[
                    styles.profileIconContainer,
                    { backgroundColor: getGradeColor(investmentProfile.grade) + '20' },
                  ]}
                >
                  <Image
                    source={getGradeImage(investmentProfile.grade)}
                    style={styles.gradeImage}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text
                    style={[styles.profileType, { color: getGradeColor(investmentProfile.grade) }]}
                  >
                    {investmentProfile.gradeName}
                  </Text>
                  <Text
                    style={[
                      styles.profileScore,
                      { color: colors.text.secondary },
                    ]}
                  >
                    점수: {investmentProfile.totalScore}점
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.profileDescription,
                  { color: colors.text.secondary },
                ]}
              >
                {investmentProfile.gradeDescription}
              </Text>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.primary },
                ]}
              />
              <View style={styles.preferredMarkets}>
                <Text
                  style={[
                    styles.preferredMarketsLabel,
                    { color: colors.text.tertiary },
                  ]}
                >
                  시장 선호도
                </Text>
                <View
                  style={[
                    styles.marketTag,
                    { backgroundColor: colors.accent.primary + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.marketTagText,
                      { color: colors.accent.primary },
                    ]}
                  >
                    {investmentProfile.marketPreferenceName ||
                      getMarketPreferenceLabel(
                        investmentProfile.marketPreference,
                      )}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.noProfileCard,
                { backgroundColor: colors.background.secondary },
              ]}
            >
              <Icon
                name="help-circle-outline"
                size={48}
                color={colors.text.tertiary}
              />
              <Text
                style={[styles.noProfileText, { color: colors.text.secondary }]}
              >
                투자성향 진단 결과가 없습니다
              </Text>
              <Text
                style={[
                  styles.noProfileSubtext,
                  { color: colors.text.tertiary },
                ]}
              >
                투자성향을 진단하면 맞춤 종목을 추천받을 수 있습니다
              </Text>
            </View>
          )}
          <Button
            title={
              investmentProfile ? '투자성향 다시 진단하기' : '투자성향 진단하기'
            }
            onPress={handleRetakeOnboarding}
            variant="secondary"
            style={styles.retakeButton}
          />
        </View>

        {/* 계정 섹션 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            계정
          </Text>
          <TouchableOpacity
            style={[
              styles.menuItem,
              { backgroundColor: colors.background.secondary },
            ]}
            onPress={handleLogout}
          >
            <Icon
              name="log-out-outline"
              size={24}
              color={colors.accent.tertiary}
            />
            <Text
              style={[styles.menuItemText, { color: colors.accent.tertiary }]}
            >
              로그아웃
            </Text>
            <Icon
              name="chevron-forward"
              size={20}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: colors.text.tertiary }]}>
            Stockfolio v1.0.0
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxxl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nickname: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.sm,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  profileCard: {
    borderRadius: 12,
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  gradeImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  profileInfo: {
    flex: 1,
  },
  profileType: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  profileScore: {
    fontSize: fontSize.sm,
  },
  profileDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    marginBottom: spacing.md,
  },
  preferredMarkets: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferredMarketsLabel: {
    fontSize: fontSize.sm,
  },
  marketTags: {
    flexDirection: 'row',
  },
  marketTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  marketTagText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  noProfileCard: {
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
  },
  noProfileText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  noProfileSubtext: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  retakeButton: {
    marginTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '500',
    marginLeft: spacing.md,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  appVersion: {
    fontSize: fontSize.xs,
  },
});

export default MyPage;
