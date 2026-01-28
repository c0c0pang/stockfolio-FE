// 라이트 테마 컬러 팔레트
export const lightColors = {
  // 배경 - 흰색 계열
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F3F5',
    card: '#FFFFFF',
  },

  // 텍스트
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // 브랜드 / 액센트 - 인디고/퍼플 계열 (탭바와 동일)
  accent: {
    primary: '#6366F1',      // 인디고
    secondary: '#8B5CF6',    // 퍼플
    tertiary: '#A78BFA',     // 라이트 퍼플
  },

  // 수익/손실 (파랑/빨강 팔레트)
  profit: {
    positive: '#3B82F6', // 파랑
    negative: '#EF4444', // 빨강
    neutral: '#9CA3AF',
  },

  // 그라데이션
  gradient: {
    primary: ['#6366F1', '#8B5CF6'] as const,  // 인디고 → 퍼플
    secondary: ['#8B5CF6', '#A78BFA'] as const, // 퍼플 계열
    card: ['#FFFFFF', '#F8F9FA'] as const,
  },

  // 보더 / 구분선
  border: {
    primary: '#E5E7EB',
    secondary: '#F1F3F5',
  },

  // 상태
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // 버튼
  button: {
    primary: '#6366F1',      // 인디고
    secondary: '#F1F3F5',
    danger: '#EF4444',
    disabled: '#E5E7EB',
  },
};

// 다크 테마 컬러 팔레트 (Purple Glassmorphism Theme)
export const darkColors = {
  // 배경 - 딥 네이비/다크 퍼플 계열
  background: {
    primary: '#0D0B1E',      // 딥 네이비 베이스
    secondary: '#161329',    // 약간 밝은 퍼플 다크
    tertiary: '#1E1A36',     // 카드/섹션 배경
    card: 'rgba(30, 26, 54, 0.8)', // 글래스모피즘 카드
  },

  // 텍스트
  text: {
    primary: '#FFFFFF',
    secondary: '#B4B0C7',    // 연한 퍼플 그레이
    tertiary: '#7A7590',     // 더 연한 퍼플 그레이
    inverse: '#0D0B1E',
  },

  // 브랜드 / 액센트 - 퍼플 계열
  accent: {
    primary: '#8B5CF6',      // 바이올렛 퍼플
    secondary: '#A78BFA',    // 라이트 퍼플
    tertiary: '#C4B5FD',     // 더 밝은 퍼플
  },

  // 수익/손실
  profit: {
    positive: '#4ADE80',     // 그린
    negative: '#F87171',     // 레드
    neutral: '#7A7590',
  },

  // 그라데이션
  gradient: {
    primary: ['#8B5CF6', '#6366F1'] as const,      // 퍼플 → 인디고
    secondary: ['#A78BFA', '#C084FC'] as const,    // 라이트 퍼플
    card: ['rgba(30, 26, 54, 0.9)', 'rgba(22, 19, 41, 0.9)'] as const,
    accent: ['#7C3AED', '#4F46E5'] as const,       // 진한 퍼플 그라데이션
    glow: ['rgba(139, 92, 246, 0.3)', 'rgba(99, 102, 241, 0.1)'] as const,
  },

  // 보더 / 구분선 - 글래스 효과
  border: {
    primary: 'rgba(139, 92, 246, 0.2)',   // 퍼플 글로우 보더
    secondary: 'rgba(255, 255, 255, 0.08)', // 은은한 화이트 보더
  },

  // 상태
  status: {
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
  },

  // 버튼
  button: {
    primary: '#8B5CF6',
    secondary: 'rgba(139, 92, 246, 0.2)',
    danger: '#F87171',
    disabled: '#3D3654',
  },

  // 글래스모피즘 전용
  glass: {
    background: 'rgba(30, 26, 54, 0.6)',
    border: 'rgba(139, 92, 246, 0.15)',
    highlight: 'rgba(255, 255, 255, 0.05)',
  },
};

// 타입 정의
export type ColorTheme = typeof lightColors;

// 기본 colors export (하위 호환성)
export let colors: ColorTheme = lightColors;

// 테마 변경 함수
export const setColors = (isDark: boolean) => {
  colors = isDark ? darkColors : lightColors;
};

// 수익률에 따른 색상 반환
export const getProfitColor = (value: number | null | undefined, theme: ColorTheme = colors): string => {
  if (value === null || value === undefined) {
    return theme.profit.neutral;
  }
  if (value > 0) {
    return theme.profit.positive;
  }
  if (value < 0) {
    return theme.profit.negative;
  }
  return theme.profit.neutral;
};
