import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StockCategory, User, InvestmentProfileResult } from '../types';
import { authApi, tokenStorage, investmentProfileApi } from '../api';
import { isErrorCode } from '../utils';

const ONBOARDING_SKIPPED_KEY = 'onboardingSkipped';

interface AppState {
  selectedCategory: StockCategory | null;
  setSelectedCategory: (category: StockCategory | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

// 테마 스토어
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  toggleTheme: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
  setTheme: (mode) => set({ mode }),
}));

// Auth 스토어
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showOnboarding: boolean;
  investmentProfile: InvestmentProfileResult | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  completeOnboarding: (profile: InvestmentProfileResult) => void;
  skipOnboarding: () => void;
  openOnboarding: () => void;
  refreshInvestmentProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  showOnboarding: false,
  investmentProfile: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (email, password) => {
    await authApi.login({ email, password });
    const user = await authApi.getMe();

    // 투자성향 진단 여부 확인
    let showOnboarding = false;
    let investmentProfile: InvestmentProfileResult | null = null;
    try {
      investmentProfile = await investmentProfileApi.getMyProfile();
    } catch (error) {
      if (isErrorCode(error, 'PROFILE_404')) {
        // 프로필이 없고 건너뛰기 기록도 없으면 온보딩 표시
        const skipped = await AsyncStorage.getItem(ONBOARDING_SKIPPED_KEY);
        showOnboarding = skipped !== 'true';
      }
    }

    set({ user, isAuthenticated: true, showOnboarding, investmentProfile });
  },

  register: async (email, password, nickname) => {
    await authApi.register({ email, password, nickname });
  },

  logout: async () => {
    await authApi.logout();
    // 로그아웃 시 건너뛰기 기록 초기화
    await AsyncStorage.removeItem(ONBOARDING_SKIPPED_KEY);
    set({ user: null, isAuthenticated: false, showOnboarding: false, investmentProfile: null });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await tokenStorage.getAccessToken();
      if (token) {
        const user = await authApi.getMe();

        // 투자성향 진단 여부 확인
        let showOnboarding = false;
        let investmentProfile: InvestmentProfileResult | null = null;
        try {
          investmentProfile = await investmentProfileApi.getMyProfile();
        } catch (error) {
          if (isErrorCode(error, 'PROFILE_404')) {
            // 프로필이 없고 건너뛰기 기록도 없으면 온보딩 표시
            const skipped = await AsyncStorage.getItem(ONBOARDING_SKIPPED_KEY);
            showOnboarding = skipped !== 'true';
          }
        }

        set({ user, isAuthenticated: true, showOnboarding, investmentProfile });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  completeOnboarding: (profile) => {
    // 완료 시 건너뛰기 기록 제거 (프로필이 생겼으므로)
    AsyncStorage.removeItem(ONBOARDING_SKIPPED_KEY);
    set({ showOnboarding: false, investmentProfile: profile });
  },

  skipOnboarding: () => {
    // 건너뛰기 시 기록 저장
    AsyncStorage.setItem(ONBOARDING_SKIPPED_KEY, 'true');
    set({ showOnboarding: false });
  },

  openOnboarding: () => {
    // 건너뛰기 기록 제거하고 온보딩 다시 열기
    AsyncStorage.removeItem(ONBOARDING_SKIPPED_KEY);
    set({ showOnboarding: true });
  },

  refreshInvestmentProfile: async () => {
    try {
      const investmentProfile = await investmentProfileApi.getMyProfile();
      set({ investmentProfile, showOnboarding: false });
    } catch (error) {
      if (isErrorCode(error, 'PROFILE_404')) {
        set({ investmentProfile: null });
      }
    }
  },
}));
