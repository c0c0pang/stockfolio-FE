import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Input, Button } from '../../global/components';
import { useTheme, spacing, fontSize, radius } from '../../global/theme';
import { authApi } from '../../global/api';
import {
  handleApiError,
  isErrorCode,
  getErrorMessage,
} from '../../global/utils';
import type { RootStackParamList } from '../../global/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ResetStep = 1 | 2 | 3;
const CODE_LENGTH = 6;

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  // Step state
  const [step, setStep] = useState<ResetStep>(1);

  // Form state
  const [email, setEmail] = useState('');
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading states
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Error states
  const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Refs
  const codeInputRefs = useRef<(TextInput | null)[]>([]);

  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 150);
  };

  // Step 1: Send verification code
  const handleSendCode = async () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSendingCode(true);
    setErrors({});

    try {
      await authApi.forgotPassword({ email });
      setCountdown(60);
      animateTransition(() => setStep(2));
    } catch (error: any) {
      if (isErrorCode(error, 'AUTH_411')) {
        setErrors({ email: getErrorMessage('AUTH_411') });
      } else {
        handleApiError(error, { title: '인증번호 발송 실패' });
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 2: Verify code
  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      const pastedCode = value.slice(0, CODE_LENGTH).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < CODE_LENGTH) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, CODE_LENGTH - 1);
      codeInputRefs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < CODE_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== CODE_LENGTH) {
      setErrors({ code: '6자리 인증번호를 입력해주세요' });
      return;
    }

    setIsVerifying(true);
    setErrors({});

    try {
      await authApi.verifyPasswordReset({ email, code: verificationCode });
      animateTransition(() => setStep(3));
    } catch (error: any) {
      if (isErrorCode(error, 'AUTH_405') || isErrorCode(error, 'AUTH_406')) {
        setErrors({ code: getErrorMessage(error.response?.data?.code) });
      } else {
        handleApiError(error, { title: '인증 실패' });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsSendingCode(true);
    try {
      await authApi.forgotPassword({ email });
      setCountdown(60);
      setCode(Array(CODE_LENGTH).fill(''));
      codeInputRefs.current[0]?.focus();
      Alert.alert('알림', '인증번호가 재발송되었습니다.');
    } catch (error: any) {
      handleApiError(error, { title: '재발송 실패' });
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    const newErrors: typeof errors = {};

    if (!newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsResetting(true);
    setErrors({});

    try {
      await authApi.resetPassword({
        email,
        code: code.join(''),
        newPassword,
      });
      Alert.alert(
        '비밀번호 변경 완료',
        '비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.',
        [
          {
            text: '로그인하기',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error: any) {
      if (isErrorCode(error, 'AUTH_412')) {
        handleApiError(error, {
          title: '비밀번호 변경 실패',
          onDismiss: () => setStep(2),
        });
      } else {
        handleApiError(error, { title: '비밀번호 변경 실패' });
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      animateTransition(() => setStep((step - 1) as ResetStep));
    } else {
      navigation.goBack();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return '이메일 입력';
      case 2:
        return '인증번호 확인';
      case 3:
        return '새 비밀번호 설정';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return '가입한 이메일을 입력해주세요';
      case 2:
        return `${email}로 발송된\n인증번호를 입력해주세요`;
      case 3:
        return '새로운 비밀번호를 설정해주세요';
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={Array.from(colors.gradient.primary)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Icon name="key" size={40} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {getStepTitle()}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {getStepSubtitle()}
          </Text>

          {/* Step indicator */}
          <View style={styles.stepIndicator}>
            {[1, 2, 3].map(s => (
              <View
                key={s}
                style={[
                  styles.stepDot,
                  {
                    backgroundColor:
                      s <= step ? colors.accent.primary : colors.border.primary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Form */}
        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
          {/* Email input - Step 1 */}
          {step === 1 && (
            <Input
              label="이메일"
              value={email}
              onChangeText={setEmail}
              placeholder="가입한 이메일 입력"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              error={errors.email}
            />
          )}

          {/* Step 2: Verification code */}
          {step === 2 && (
            <>
              <View style={[styles.emailBadge, { backgroundColor: colors.background.secondary }]}>
                <Icon name="mail" size={16} color={colors.text.secondary} />
                <Text style={[styles.emailText, { color: colors.text.secondary }]}>
                  {email}
                </Text>
              </View>

              <Text
                style={[styles.inputLabel, { color: colors.text.secondary }]}
              >
                인증번호
              </Text>
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => {
                      codeInputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.codeInput,
                      {
                        borderColor: digit
                          ? colors.accent.primary
                          : errors.code
                          ? colors.status.error
                          : colors.border.primary,
                        backgroundColor: colors.background.secondary,
                        color: colors.text.primary,
                      },
                    ]}
                    value={digit}
                    onChangeText={value => handleCodeChange(value, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={index === 0 ? CODE_LENGTH : 1}
                    selectTextOnFocus
                    autoComplete="off"
                    textContentType="oneTimeCode"
                  />
                ))}
              </View>
              {errors.code && (
                <Text
                  style={[styles.errorText, { color: colors.status.error }]}
                >
                  {errors.code}
                </Text>
              )}
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={countdown > 0 || isSendingCode}
                style={styles.resendButton}
              >
                <Text
                  style={[
                    styles.resendText,
                    {
                      color:
                        countdown > 0
                          ? colors.text.tertiary
                          : colors.accent.primary,
                    },
                  ]}
                >
                  {countdown > 0
                    ? `인증번호 재발송 (${countdown}초)`
                    : isSendingCode
                    ? '발송 중...'
                    : '인증번호 재발송'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <View style={styles.verifiedBadge}>
                <Icon
                  name="checkmark-circle"
                  size={16}
                  color={colors.status.success}
                />
                <Text
                  style={[
                    styles.verifiedText,
                    { color: colors.status.success },
                  ]}
                >
                  이메일 인증 완료
                </Text>
              </View>

              <Input
                label="새 비밀번호"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="8자 이상 입력"
                secureTextEntry
                textContentType="oneTimeCode"
                autoComplete="off"
                error={errors.newPassword}
              />

              <Input
                label="새 비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="비밀번호 다시 입력"
                secureTextEntry
                textContentType="oneTimeCode"
                autoComplete="off"
                error={errors.confirmPassword}
              />
            </>
          )}

          {/* Action button */}
          {step === 1 && (
            <Button
              title="인증번호 받기"
              onPress={handleSendCode}
              loading={isSendingCode}
              style={styles.actionButton}
            />
          )}

          {step === 2 && (
            <Button
              title="인증하기"
              onPress={handleVerifyCode}
              loading={isVerifying}
              style={styles.actionButton}
            />
          )}

          {step === 3 && (
            <Button
              title="비밀번호 변경"
              onPress={handleResetPassword}
              loading={isResetting}
              style={styles.actionButton}
            />
          )}
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBack} style={styles.backLink}>
            <Icon name="chevron-back" size={20} color={colors.text.secondary} />
            <Text style={[styles.backText, { color: colors.text.secondary }]}>
              {step === 1 ? '로그인으로 돌아가기' : '이전 단계'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  form: {
    marginBottom: spacing.xl,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  emailText: {
    fontSize: fontSize.sm,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: radius.md,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  resendButton: {
    alignSelf: 'center',
    padding: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  resendText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  verifiedText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: spacing.md,
  },
  footer: {
    alignItems: 'center',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  backText: {
    fontSize: fontSize.sm,
  },
});

export default ForgotPassword;
