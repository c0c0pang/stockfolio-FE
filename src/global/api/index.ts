import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
  SendVerificationDto,
  ForgotPasswordDto,
  VerifyPasswordResetDto,
  ResetPasswordDto,
  AuthTokens,
  User,
  MessageResponse,
  GlossaryTerm,
  GlossaryListResponse,
  GlossaryCategoryResponse,
  GlossarySearchResponse,
  SurveyQuestionsResponse,
  SubmitSurveyDto,
  InvestmentProfileResult,
  ExchangeRateData,
  NewsListResponseDto,
  NewsCategory,
} from '../types';

const BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Token storage helpers
export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  async setTokens(tokens: AuthTokens): Promise<void> {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },
  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
};

// Request interceptor - add access token
api.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Call refresh endpoint
        const response = await axios.post<AuthTokens>(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        // Save new tokens
        await tokenStorage.setTokens(response.data);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        await tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  async register(dto: RegisterDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/register', dto);
    return response.data;
  },

  async login(dto: LoginDto): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/login', dto);
    await tokenStorage.setTokens(response.data);
    return response.data;
  },

  async verifyEmail(dto: VerifyEmailDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/verify-email', dto);
    return response.data;
  },

  async sendVerification(dto: SendVerificationDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/send-verification', dto);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      await tokenStorage.clearTokens();
    }
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await axios.post<AuthTokens>(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    await tokenStorage.setTokens(response.data);
    return response.data;
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/forgot-password', dto);
    return response.data;
  },

  async verifyPasswordReset(dto: VerifyPasswordResetDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/verify-password-reset', dto);
    return response.data;
  },

  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/reset-password', dto);
    return response.data;
  },
};

// Glossary API
export const glossaryApi = {
  async getTerms(category?: string): Promise<GlossaryListResponse> {
    const params = category ? { category } : {};
    const response = await api.get<GlossaryListResponse>('/glossary', { params });
    return response.data;
  },

  async getCategories(): Promise<GlossaryCategoryResponse> {
    const response = await api.get<GlossaryCategoryResponse>('/glossary/categories');
    return response.data;
  },

  async search(q: string): Promise<GlossarySearchResponse> {
    const response = await api.get<GlossarySearchResponse>('/glossary/search', { params: { q } });
    return response.data;
  },

  async getRandom(): Promise<GlossaryTerm> {
    const response = await api.get<GlossaryTerm>('/glossary/random');
    return response.data;
  },

  async getTerm(id: number): Promise<GlossaryTerm> {
    const response = await api.get<GlossaryTerm>(`/glossary/${id}`);
    return response.data;
  },

  async getRelatedTerms(id: number): Promise<GlossaryTerm[]> {
    const response = await api.get<GlossaryTerm[]>(`/glossary/${id}/related`);
    return response.data;
  },
};

// Investment Profile API
export const investmentProfileApi = {
  async getSurveyQuestions(): Promise<SurveyQuestionsResponse> {
    const response = await api.get<SurveyQuestionsResponse>('/investment-profile/survey');
    return response.data;
  },

  async submitSurvey(dto: SubmitSurveyDto): Promise<InvestmentProfileResult> {
    const response = await api.post<InvestmentProfileResult>('/investment-profile/survey', dto);
    return response.data;
  },

  async getMyProfile(): Promise<InvestmentProfileResult> {
    const response = await api.get<InvestmentProfileResult>('/investment-profile/me');
    return response.data;
  },
};

// Exchange Rate API (ExchangeRate-API - 무료, API 키 불필요)
export const exchangeRateApi = {
  async getUsdToKrw(): Promise<ExchangeRateData> {
    const response = await axios.get(
      'https://open.er-api.com/v6/latest/USD',
    );
    const krwRate = response.data.rates.KRW;
    return {
      usdToKrw: krwRate,
      lastUpdated: response.data.time_last_update_utc,
    };
  },
};

// News API
export const newsApi = {
  // 통합 뉴스 조회 (한국 + 해외) - 무한스크롤 지원
  async getCombinedNews(
    limit: number = 20,
    page: number = 1,
  ): Promise<NewsListResponseDto> {
    const response = await api.get<NewsListResponseDto>('/news', {
      params: { limit, page },
    });
    return response.data;
  },

  // 뉴스 검색 - 무한스크롤 지원
  async searchNews(
    keyword: string,
    limit: number = 20,
    page: number = 1,
  ): Promise<NewsListResponseDto> {
    const response = await api.get<NewsListResponseDto>('/news/search', {
      params: { keyword, limit, page },
    });
    return response.data;
  },

  // 해외 시장 뉴스 조회
  async getMarketNews(
    category?: NewsCategory,
    limit: number = 20,
  ): Promise<NewsListResponseDto> {
    const response = await api.get<NewsListResponseDto>('/news/market', {
      params: { category, limit },
    });
    return response.data;
  },

  // 한국 시장 뉴스 조회
  async getKoreanMarketNews(limit: number = 20): Promise<NewsListResponseDto> {
    const response = await api.get<NewsListResponseDto>('/news/market/korea', {
      params: { limit },
    });
    return response.data;
  },

  // 해외 종목 뉴스 조회
  async getStockNews(
    symbol: string,
    limit: number = 20,
  ): Promise<NewsListResponseDto> {
    const response = await api.get<NewsListResponseDto>(`/news/stock/${symbol}`, {
      params: { limit },
    });
    return response.data;
  },

  // 한국 종목 뉴스 조회 - 무한스크롤 지원
  async getKoreanStockNews(
    code: string,
    limit: number = 20,
    page: number = 1,
  ): Promise<NewsListResponseDto> {
    const response = await api.get<NewsListResponseDto>(`/news/stock/korea/${code}`, {
      params: { limit, page },
    });
    return response.data;
  },
};
