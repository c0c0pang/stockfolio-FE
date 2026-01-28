import { api } from '../../global/api';
import type {
  StockResponseDto,
  UpdateStockDto,
  YahooQuoteDto,
} from '../../global/types';

export const getStock = async (id: number): Promise<StockResponseDto> => {
  const { data } = await api.get<StockResponseDto>(`/stocks/${id}`);
  return data;
};

export const updateStock = async (id: number, dto: UpdateStockDto): Promise<StockResponseDto> => {
  const { data } = await api.put<StockResponseDto>(`/stocks/${id}`, dto);
  return data;
};

export const deleteStock = async (id: number): Promise<void> => {
  await api.delete(`/stocks/${id}`);
};

export const getQuote = async (symbol: string): Promise<YahooQuoteDto> => {
  const { data } = await api.get<YahooQuoteDto>('/yahoo/quote', {
    params: { symbol },
  });
  return data;
};
