import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button } from '../../../../global/components';
import { spacing } from '../../../../global/theme';

interface DeleteButtonProps {
  stockName: string;
  onDelete: () => void;
  isLoading?: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  stockName,
  onDelete,
  isLoading = false,
}) => {
  const handlePress = () => {
    Alert.alert(
      '종목 삭제',
      `${stockName}을(를) 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Button
      title="종목 삭제"
      variant="danger"
      onPress={handlePress}
      loading={isLoading}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.sm,
  },
});
