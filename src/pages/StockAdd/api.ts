import { api } from '../../global/api';
import type {
  StockResponseDto,
  CreateStockDto,
  YahooSearchResultDto,
} from '../../global/types';

export const searchStocks = async (query: string): Promise<YahooSearchResultDto[]> => {
  const { data } = await api.get<YahooSearchResultDto[]>('/yahoo/search', {
    params: { query },
  });
  return data;
};

export const createStock = async (dto: CreateStockDto): Promise<StockResponseDto> => {
  const { data } = await api.post<StockResponseDto>('/stocks', dto);
  return data;
};
