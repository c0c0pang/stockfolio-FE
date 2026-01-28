import { Alert } from 'react-native';
import { colors } from '../theme';

// 에러 코드별 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  // Auth 에러
  AUTH_401: '인증이 필요합니다.',
  AUTH_402: '이메일 또는 비밀번호가 올바르지 않습니다.',
  AUTH_403: '접근 권한이 없습니다.',
  AUTH_404: '이메일 인증이 필요합니다.',
  AUTH_405: '인증번호가 올바르지 않습니다.',
  AUTH_406: '인증번호가 만료되었습니다. 재발송해주세요.',
  AUTH_409: '이미 존재하는 이메일입니다.',
  AUTH_410: '이미 인증된 이메일입니다.',
  AUTH_411: '가입되지 않은 이메일입니다.',
  AUTH_412: '비밀번호 재설정 인증이 완료되지 않았습니다.',

  // Stock 에러
  STOCK_404: '주식을 찾을 수 없습니다.',

  // Glossary 에러
  GLOSSARY_404: '해당 용어를 찾을 수 없습니다.',

  // Investment Profile 에러
  PROFILE_404: '투자성향 진단 결과가 없습니다.',

  // Common 에러
  COMMON_401: '입력값이 올바르지 않습니다.',
  COMMON_500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

// 에러 코드에서 사용자 친화적 메시지 가져오기
export const getErrorMessage = (code: string): string => {
  return ERROR_MESSAGES[code] || '오류가 발생했습니다. 다시 시도해주세요.';
};

// API 에러에서 코드 추출
export const getErrorCode = (error: any): string | null => {
  return error?.response?.data?.code || null;
};

// API 에러 핸들링 (Alert 표시)
export const handleApiError = (
  error: any,
  options?: {
    title?: string;
    fallbackMessage?: string;
    onDismiss?: () => void;
  },
): void => {
  const code = getErrorCode(error);
  const message = code
    ? getErrorMessage(code)
    : options?.fallbackMessage || '오류가 발생했습니다.';

  Alert.alert(options?.title || '오류', message, [
    { text: '확인', onPress: options?.onDismiss },
  ]);
};

// 특정 에러 코드인지 확인
export const isErrorCode = (error: any, code: string): boolean => {
  return getErrorCode(error) === code;
};

// 통화 포맷
export const formatCurrency = (
  value: number,
  currency: string = 'KRW',
): string => {
  const locale = currency === 'KRW' ? 'ko-KR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(value);
};

// 퍼센트 포맷
export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

// 숫자 포맷 (천 단위 콤마)
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ko-KR').format(value);
};

// 수익률 색상
export const getProfitColor = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return colors.profit.neutral;
  }
  if (value > 0) {
    return colors.profit.positive;
  }
  if (value < 0) {
    return colors.profit.negative;
  }
  return colors.profit.neutral;
};

// 총 자산 계산 (원화 기준, 해외주식은 환율 적용)
export const calculateTotalAsset = (
  stocks: Array<{
    quantity: number;
    currentPrice?: number;
    avgPrice: number;
    currency: string;
  }>,
  usdToKrw?: number,
): number => {
  return stocks.reduce((total, stock) => {
    const price = stock.currentPrice ?? stock.avgPrice;
    const value = stock.quantity * price;
    // USD인 경우 환율 적용하여 원화로 환산
    if (stock.currency === 'USD' && usdToKrw) {
      return total + value * usdToKrw;
    }
    return total + value;
  }, 0);
};

// 유니코드 이스케이프 시퀀스 디코딩 (\uXXXX -> 실제 문자)
export const decodeUnicode = (str: string): string => {
  if (!str) return str;
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16)),
  );
};

// 총 수익률 계산 (원화 기준)
export const calculateTotalProfitPercent = (
  stocks: Array<{
    quantity: number;
    currentPrice?: number;
    avgPrice: number;
    currency: string;
  }>,
  usdToKrw?: number,
): number => {
  const totalCurrent = stocks.reduce((sum, stock) => {
    const price = stock.currentPrice ?? stock.avgPrice;
    const value = stock.quantity * price;
    if (stock.currency === 'USD' && usdToKrw) {
      return sum + value * usdToKrw;
    }
    return sum + value;
  }, 0);

  const totalCost = stocks.reduce((sum, stock) => {
    const value = stock.quantity * stock.avgPrice;
    if (stock.currency === 'USD' && usdToKrw) {
      return sum + value * usdToKrw;
    }
    return sum + value;
  }, 0);

  if (totalCost === 0) {
    return 0;
  }

  return ((totalCurrent - totalCost) / totalCost) * 100;
};
