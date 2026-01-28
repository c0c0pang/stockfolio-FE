import { api } from '../../global/api';
import type { StockResponseDto } from '../../global/types';

export const getStocks = async (): Promise<StockResponseDto[]> => {
  const { data } = await api.get<StockResponseDto[]>('/stocks');
  return data;
};
