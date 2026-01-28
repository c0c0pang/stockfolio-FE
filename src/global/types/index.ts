import type { components } from '../../types/api';

// API 타입 re-export (api.ts에서 생성된 타입들)
export type StockResponseDto = components['schemas']['StockResponseDto'];
export type CreateStockDto = components['schemas']['CreateStockDto'];
export type UpdateStockDto = components['schemas']['UpdateStockDto'];
export type YahooQuoteDto = components['schemas']['YahooQuoteDto'];
export type YahooSearchResultDto = components['schemas']['YahooSearchResultDto'];
export type ErrorResponseDto = components['schemas']['ErrorResponseDto'];
export type LoginDto = components['schemas']['LoginDto'];
export type RegisterDto = components['schemas']['RegisterDto'];
export type VerifyEmailDto = components['schemas']['VerifyEmailDto'];
export type SendVerificationDto = components['schemas']['SendVerificationDto'];
export type TokenResponseDto = components['schemas']['TokenResponseDto'];
export type UserResponseDto = components['schemas']['UserResponseDto'];
export type UpdateNicknameDto = components['schemas']['UpdateNicknameDto'];
export type ForgotPasswordDto = components['schemas']['ForgotPasswordDto'];
export type VerifyPasswordResetDto = components['schemas']['VerifyPasswordResetDto'];
export type ResetPasswordDto = components['schemas']['ResetPasswordDto'];
export type GlossaryTermDto = components['schemas']['GlossaryTermDto'];
export type GlossaryListResponseDto = components['schemas']['GlossaryListResponseDto'];
export type GlossaryCategoriesResponseDto = components['schemas']['GlossaryCategoriesResponseDto'];
export type GlossarySearchResponseDto = components['schemas']['GlossarySearchResponseDto'];
export type GlossaryCategoryDto = components['schemas']['GlossaryCategoryDto'];
export type SurveyQuestionDto = components['schemas']['SurveyQuestionDto'];
export type SurveyOptionDto = components['schemas']['SurveyOptionDto'];
export type SurveyQuestionsResponseDto = components['schemas']['SurveyQuestionsResponseDto'];
export type SubmitSurveyDto = components['schemas']['SubmitSurveyDto'];
export type InvestmentProfileResponseDto = components['schemas']['InvestmentProfileResponseDto'];
export type RecommendedProductDto = components['schemas']['RecommendedProductDto'];
export type NewsItemDto = components['schemas']['NewsItemDto'];
export type NewsListResponseDto = components['schemas']['NewsListResponseDto'];

// 카테고리 타입
export type StockCategory = 'domestic' | 'overseas';
export type NewsSource = 'finnhub' | 'naver';
export type NewsCategory = 'general' | 'stock' | 'economy' | 'world';
export type MarketPreference =
  | 'domestic_only'
  | 'domestic_preferred'
  | 'balanced'
  | 'us_preferred'
  | 'us_only';

// 호환성을 위한 alias
export type AuthTokens = TokenResponseDto;
export type User = UserResponseDto;
export type GlossaryTerm = GlossaryTermDto;
export type GlossaryCategory = GlossaryCategoryDto;
export type GlossaryListResponse = GlossaryListResponseDto;
export type GlossaryCategoryResponse = GlossaryCategoriesResponseDto;
export type GlossarySearchResponse = GlossarySearchResponseDto;
export type SurveyQuestion = SurveyQuestionDto;
export type SurveyOption = SurveyOptionDto;
export type SurveyQuestionsResponse = SurveyQuestionsResponseDto;
export type InvestmentProfileResult = InvestmentProfileResponseDto;
export type RecommendedProduct = RecommendedProductDto;

export interface MessageResponse {
  message: string;
}

// Exchange Rate 타입 (외부 API용)
export interface ExchangeRateData {
  usdToKrw: number;
  lastUpdated: string;
}

// NewsListResponseDto 확장 (무한스크롤 지원)
export interface NewsListResponseWithPagination extends NewsListResponseDto {
  page?: number;
  hasMore?: boolean;
}
