import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Input, Button } from '../../../../global/components';
import type { StockResponseDto, UpdateStockDto } from '../../../../global/types';
import { spacing } from '../../../../global/theme';

interface EditFormProps {
  stock: StockResponseDto;
  onSubmit: (dto: UpdateStockDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EditForm: React.FC<EditFormProps> = ({
  stock,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [quantity, setQuantity] = useState(stock.quantity.toString());
  const [avgPrice, setAvgPrice] = useState(stock.avgPrice.toString());

  const handleSubmit = () => {
    const qty = parseInt(quantity, 10);
    const price = parseFloat(avgPrice);

    if (!qty || qty < 1) {
      Alert.alert('오류', '수량을 1개 이상 입력해주세요.');
      return;
    }

    if (!price || price <= 0) {
      Alert.alert('오류', '평균 매수가를 입력해주세요.');
      return;
    }

    onSubmit({
      quantity: qty,
      avgPrice: price,
    });
  };

  return (
    <Card style={styles.card}>
      <Input
        label="수량"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        placeholder="보유 수량"
      />

      <Input
        label={`평균 매수가 (${stock.currency})`}
        value={avgPrice}
        onChangeText={setAvgPrice}
        keyboardType="decimal-pad"
        placeholder="평균 매수가"
      />

      <View style={styles.buttons}>
        <Button
          title="취소"
          variant="secondary"
          onPress={onCancel}
          style={styles.button}
        />
        <Button
          title="수정"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
