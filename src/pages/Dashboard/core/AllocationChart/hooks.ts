import { useMemo } from 'react';
import type { StockResponseDto } from '../../../../global/types';

interface AllocationData {
  label: string;
  value: number;
  color: string;
}

// 종목별 색상 팔레트
const STOCK_COLORS = [
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F43F5E', // rose
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#3B82F6', // blue
];

export const useAllocationData = (
  stocks: StockResponseDto[],
  usdToKrw?: number,
): AllocationData[] => {
  return useMemo(() => {
    // 종목별 현재 가치 계산 후 내림차순 정렬 (원화 기준)
    const stockValues = stocks
      .map((stock, index) => {
        const price = stock.currentPrice ?? stock.avgPrice;
        let value = stock.quantity * price;
        // USD인 경우 환율 적용
        if (stock.currency === 'USD' && usdToKrw) {
          value *= usdToKrw;
        }
        return {
          label: stock.name,
          value,
          color: STOCK_COLORS[index % STOCK_COLORS.length],
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // 상위 5개 + 나머지는 '기타'로 묶기
    if (stockValues.length <= 6) {
      return stockValues;
    }

    const top5 = stockValues.slice(0, 5);
    const others = stockValues.slice(5);
    const othersValue = others.reduce((sum, item) => sum + item.value, 0);

    return [
      ...top5,
      {
        label: '기타',
        value: othersValue,
        color: '#9CA3AF', // gray
      },
    ];
  }, [stocks, usdToKrw]);
};
