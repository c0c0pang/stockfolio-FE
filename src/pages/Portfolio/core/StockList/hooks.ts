import { useQuery } from '@tanstack/react-query';
import { getStocks } from '../../api';
import type { StockCategory } from '../../../../global/types';

export const useStocks = (category: StockCategory | null) => {
  return useQuery({
    queryKey: ['stocks', category],
    queryFn: () => getStocks(category ?? undefined),
  });
};
