import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStock } from '../../api';
import type { UpdateStockDto } from '../../../../global/types';
import { handleApiError } from '../../../../global/utils';

export const useUpdateStock = (stockId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateStockDto) => updateStock(stockId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['stock', stockId] });
    },
    onError: (error) => {
      handleApiError(error, { title: '종목 수정 실패' });
    },
  });
};
