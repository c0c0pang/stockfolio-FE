import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Keyboard,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme, spacing, fontSize, radius } from '../../theme';
import { investmentProfileApi } from '../../api';
import { handleApiError } from '../../utils';
import type {
  SubmitSurveyDto,
  MarketPreference,
  InvestmentProfileResult,
} from '../../types';
import { Button } from '../Button';
import { Loading } from '../Loading';
import { Backdrop } from '../Backdrop';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingProps {
  visible: boolean;
  onComplete: (result: InvestmentProfileResult) => void;
  onSkip?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  visible,
  onComplete,
  onSkip,
}) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // 결과 화면 애니메이션
  const resultIconScale = useRef(new Animated.Value(0)).current;
  const resultTextOpacity = useRef(new Animated.Value(0)).current;
  const resultCardsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [result, setResult] = useState<InvestmentProfileResult | null>(null);

  // 결과 화면 진입 시 성취감 애니메이션
  useEffect(() => {
    if (currentStep === -1 && result) {
      // 애니메이션 초기화
      resultIconScale.setValue(0);
      resultTextOpacity.setValue(0);
      resultCardsOpacity.setValue(0);

      // 순차적 애니메이션
      Animated.sequence([
        // 1. 이미지 바운스
        Animated.spring(resultIconScale, {
          toValue: 1,
          friction: 3,
          tension: 80,
          useNativeDriver: true,
        }),
        // 2. 텍스트 페이드인
        Animated.timing(resultTextOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // 3. 카드들 페이드인
        Animated.timing(resultCardsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    currentStep,
    result,
    resultIconScale,
    resultTextOpacity,
    resultCardsOpacity,
  ]);

  const { data: surveyData, isLoading } = useQuery({
    queryKey: ['surveyQuestions'],
    queryFn: () => investmentProfileApi.getSurveyQuestions(),
    enabled: visible,
  });

  const submitMutation = useMutation({
    mutationFn: (dto: SubmitSurveyDto) =>
      investmentProfileApi.submitSurvey(dto),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['investmentProfile'] });
      setResult(data);
      animateTransition(() => setCurrentStep(-1)); // -1 = 결과 화면
    },
    onError: error => {
      handleApiError(error, { title: '설문 제출 실패' });
    },
  });

  const questions = surveyData?.questions || [];
  const totalSteps = questions.length + 1; // questions + intro

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 100);
  };

  const handleSelectOption = (questionId: number, value: number | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      animateTransition(() => setCurrentStep(1));
      return;
    }

    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion || answers[currentQuestion.id] === undefined) {
      return;
    }

    if (currentStep < questions.length) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const dto: SubmitSurveyDto = {
      q1Age: answers[1] as number,
      q2Experience: answers[2] as number,
      q3Knowledge: answers[3] as number,
      q4RiskTolerance: answers[4] as number,
      q5Period: answers[5] as number,
      q6AssetRatio: answers[6] as number,
      q7Income: answers[7] as number,
      marketPreference: answers[8] as MarketPreference,
    };
    submitMutation.mutate(dto);
  };

  const handleFinish = () => {
    if (result) {
      onComplete(result);
      // 상태 초기화
      setCurrentStep(0);
      setAnswers({});
      setResult(null);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    const currentQuestion = questions[currentStep - 1];
    return currentQuestion && answers[currentQuestion.id] !== undefined;
  };

  // 등급별 이미지 - grade 1이 가장 공격적, grade 5가 가장 안정적
  const gradeImages: Record<number, ImageSourcePropType> = {
    1: require('../../../assets/images/grade_1_aggressive.png'),
    2: require('../../../assets/images/grade_2_active.png'),
    3: require('../../../assets/images/grade_3_neutral.png'),
    4: require('../../../assets/images/grade_4_stable.png'),
    5: require('../../../assets/images/grade_5_conservative.png'),
  };

  const getGradeImage = (grade: number): ImageSourcePropType => {
    return gradeImages[grade] || gradeImages[3];
  };

  const getGradeColor = (grade: number): string => {
    // 테마 colors.status와 일치 - grade 1이 가장 공격적(빨강), grade 5가 가장 안정적(초록)
    const gradeColors: Record<number, string> = {
      1: colors.status.error, // 공격투자형 - 빨강
      2: '#F97316', // 적극투자형 - 주황
      3: colors.status.warning, // 위험중립형 - 노랑
      4: '#34D399', // 안정추구형 - 연초록
      5: colors.status.success, // 안정형 - 초록
    };
    return gradeColors[grade] || colors.accent.primary;
  };

  // 질문 카테고리 정보 (아이콘 + 라벨)
  const getQuestionCategory = (
    questionIndex: number,
  ): { icon: string; label: string } => {
    const categories: Record<number, { icon: string; label: string }> = {
      1: { icon: 'calendar', label: '연령대' },
      2: { icon: 'trending-up', label: '투자 경험' },
      3: { icon: 'book', label: '금융 지식' },
      4: { icon: 'shield', label: '위험 감수' },
      5: { icon: 'time', label: '투자 기간' },
      6: { icon: 'pie-chart', label: '자산 비중' },
      7: { icon: 'cash', label: '소득 수준' },
      8: { icon: 'globe', label: '시장 선호' },
    };
    return categories[questionIndex] || { icon: 'help-circle', label: '질문' };
  };

  if (isLoading) {
    return (
      <RNModal
        visible={visible}
        animationType="none"
        transparent
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Backdrop visible={visible} opacity={0.5} />
          <View
            style={[
              styles.loadingContainer,
              { backgroundColor: colors.background.primary },
            ]}
          >
            <Loading message="설문 불러오는 중..." />
          </View>
        </View>
      </RNModal>
    );
  }

  const isResultScreen = currentStep === -1;

  // 인트로 화면: 백드롭 위에 요소들만 띄움 (모달 컨테이너 없음)
  if (currentStep === 0) {
    return (
      <RNModal
        visible={visible}
        animationType="none"
        transparent
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Backdrop visible={visible} opacity={0.5} />
          <Animated.View
            style={[
              styles.introFloatingContent,
              {
                backgroundColor: colors.background.primary,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* 아바타 */}
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: colors.accent.primary + '20' },
              ]}
            >
              <Icon name="person" size={60} color={colors.accent.primary} />
            </View>
            {/* 인사말 */}
            <Text
              style={[styles.introGreeting, { color: colors.text.primary }]}
            >
              안녕하세요
            </Text>
            <Text
              style={[styles.introSubtitle, { color: colors.text.secondary }]}
            >
              투자성향을 진단해볼까요?
            </Text>
            {/* 버튼 */}
            <View style={styles.introButtonContainer}>
              <Button title="다음" onPress={handleNext} />
              {onSkip && (
                <TouchableOpacity
                  onPress={onSkip}
                  style={styles.skipTextButton}
                >
                  <Text
                    style={[styles.skipText, { color: colors.text.tertiary }]}
                  >
                    건너뛰기
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </RNModal>
    );
  }

  return (
    <RNModal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Backdrop visible={visible} opacity={0.5} />
        <Animated.View
          style={[
            styles.questionFloatingContent,
            {
              backgroundColor: colors.background.primary,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* 결과 화면 타이틀 */}
          {isResultScreen && (
            <Text style={[styles.resultTitle, { color: colors.text.primary }]}>
              진단 결과
            </Text>
          )}

          {/* 프로그레스 바 */}
          {!isResultScreen && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: colors.border.primary },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.accent.primary,
                      width: `${(currentStep / (totalSteps - 1)) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.progressText, { color: colors.text.tertiary }]}
              >
                {currentStep}/{totalSteps - 1}
              </Text>
            </View>
          )}

          {/* 질문 */}
          {!isResultScreen && questions[currentStep - 1] && (
            <>
              {/* 카테고리 배지 */}
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: colors.accent.primary + '15' },
                ]}
              >
                <Icon
                  name={getQuestionCategory(currentStep).icon}
                  size={16}
                  color={colors.accent.primary}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    { color: colors.accent.primary },
                  ]}
                >
                  {getQuestionCategory(currentStep).label}
                </Text>
              </View>
              <Text
                style={[
                  styles.floatingQuestionText,
                  { color: colors.text.primary },
                ]}
              >
                {questions[currentStep - 1].question}
              </Text>
            </>
          )}

          {/* 선택지 */}
          {!isResultScreen && questions[currentStep - 1] && (
            <View style={styles.floatingOptionsContainer}>
              {questions[currentStep - 1].options.map((option, index) => {
                const isSelected =
                  answers[questions[currentStep - 1].id] === option.value;
                return (
                  <TouchableOpacity
                    key={String(option.value)}
                    style={[
                      styles.floatingOptionButton,
                      {
                        backgroundColor: isSelected
                          ? colors.accent.primary
                          : colors.background.secondary,
                        borderColor: isSelected
                          ? colors.accent.primary
                          : colors.border.primary,
                      },
                    ]}
                    onPress={() =>
                      handleSelectOption(
                        questions[currentStep - 1].id,
                        option.value,
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.floatingOptionText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text.primary,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Icon name="checkmark" size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* 결과 내용 */}
          {isResultScreen && result && (
            <ScrollView
              style={styles.resultScrollView}
              contentContainerStyle={styles.resultScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 등급 이미지 - 바운스 애니메이션 */}
              <Animated.View
                style={[
                  styles.resultIconContainer,
                  { backgroundColor: getGradeColor(result.grade) + '20' },
                  {
                    transform: [{ scale: resultIconScale }],
                  },
                ]}
              >
                <Image
                  source={getGradeImage(result.grade)}
                  style={styles.resultImage}
                />
              </Animated.View>

              {/* 등급 이름 및 점수 - 페이드인 */}
              <Animated.View
                style={{ opacity: resultTextOpacity, alignItems: 'center' }}
              >
                <Text
                  style={[
                    styles.resultGradeName,
                    { color: getGradeColor(result.grade) },
                  ]}
                >
                  {result.gradeName}
                </Text>
                <Text
                  style={[styles.resultScore, { color: colors.text.secondary }]}
                >
                  점수: {result.totalScore}점
                </Text>
              </Animated.View>

              {/* 카드들 - 페이드인 */}
              <Animated.View
                style={{ opacity: resultCardsOpacity, width: '100%' }}
              >
                {/* 등급 설명 */}
                <View
                  style={[
                    styles.resultCard,
                    { backgroundColor: colors.background.secondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultDescription,
                      { color: colors.text.primary },
                    ]}
                  >
                    {result.gradeDescription}
                  </Text>
                </View>

                {/* 시장 선호도 */}
                <View
                  style={[
                    styles.resultCard,
                    { backgroundColor: colors.background.secondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultCardTitle,
                      { color: colors.text.primary },
                    ]}
                  >
                    시장 선호도
                  </Text>
                  <View
                    style={[
                      styles.marketBadge,
                      { backgroundColor: colors.accent.primary + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.marketBadgeText,
                        { color: colors.accent.primary },
                      ]}
                    >
                      {result.marketPreferenceName}
                    </Text>
                  </View>
                </View>

                {/* 추천 투자 상품 */}
                {result.recommendedProducts &&
                  result.recommendedProducts.length > 0 && (
                    <View
                      style={[
                        styles.resultCard,
                        { backgroundColor: colors.background.secondary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.resultCardTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        추천 투자 상품
                      </Text>
                      {result.recommendedProducts.map((product, index) => (
                        <View key={index} style={styles.productItem}>
                          <View style={styles.productHeader}>
                            <Text
                              style={[
                                styles.productCategory,
                                { color: colors.text.primary },
                              ]}
                            >
                              {product.category}
                            </Text>
                            <Text
                              style={[
                                styles.productRatio,
                                { color: colors.accent.primary },
                              ]}
                            >
                              {product.ratio}%
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.productExamples,
                              { color: colors.text.tertiary },
                            ]}
                          >
                            {product.examples.join(', ')}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
              </Animated.View>
            </ScrollView>
          )}

          {/* 버튼 */}
          <View style={styles.floatingButtonContainer}>
            {isResultScreen ? (
              <Button title="완료" onPress={handleFinish} />
            ) : (
              <>
                <Button
                  title={
                    currentStep === questions.length ? '결과 보기' : '다음'
                  }
                  onPress={handleNext}
                  disabled={!canProceed()}
                  loading={submitMutation.isPending}
                />
                {onSkip && (
                  <TouchableOpacity
                    onPress={onSkip}
                    style={styles.skipTextButton}
                  >
                    <Text
                      style={[styles.skipText, { color: colors.text.tertiary }]}
                    >
                      설문 그만하기
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  introFloatingContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    borderRadius: radius.xl,
    width: '90%',
  },
  introButtonContainer: {
    width: '100%',
    marginTop: spacing.xxl,
  },
  questionFloatingContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderRadius: radius.xl,
    width: '90%',
  },
  floatingQuestionText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  floatingOptionsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  floatingOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  floatingOptionText: {
    fontSize: fontSize.md,
    flex: 1,
  },
  floatingButtonContainer: {
    width: '100%',
    marginTop: spacing.md,
  },
  resultScrollView: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  resultScrollContent: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  resultTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xl,
  },
  resultGradeName: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  skipTextButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.sm,
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  loadingContainer: {
    width: '80%',
    padding: spacing.xxl,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  introGreeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  introSubtitle: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    color: '#888',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  categoryIcon: {
    marginRight: spacing.xs,
  },
  categoryLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  resultIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  resultImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  resultScore: {
    fontSize: fontSize.md,
    marginBottom: spacing.xl,
  },
  resultCard: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  resultDescription: {
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  resultCardTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  marketBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  marketBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  productItem: {
    marginBottom: spacing.md,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  productCategory: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  productRatio: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  productExamples: {
    fontSize: fontSize.sm,
  },
});
