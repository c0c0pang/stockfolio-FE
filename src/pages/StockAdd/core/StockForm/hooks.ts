import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStock } from '../../api';
import type { CreateStockDto } from '../../../../global/types';
import { handleApiError } from '../../../../global/utils';

export const useAddStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateStockDto) => createStock(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
    onError: (error) => {
      handleApiError(error, { title: '종목 추가 실패' });
    },
  });
};
