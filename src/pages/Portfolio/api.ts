import { api } from '../../global/api';
import type { StockResponseDto, StockCategory } from '../../global/types';

export const getStocks = async (category?: StockCategory): Promise<StockResponseDto[]> => {
  const params = category ? { category } : {};
  const { data } = await api.get<StockResponseDto[]>('/stocks', { params });
  return data;
};
