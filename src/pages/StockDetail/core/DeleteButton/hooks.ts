import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStock } from '../../api';
import { handleApiError } from '../../../../global/utils';

export const useDeleteStock = (stockId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteStock(stockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
    onError: (error) => {
      handleApiError(error, { title: '종목 삭제 실패' });
    },
  });
};
