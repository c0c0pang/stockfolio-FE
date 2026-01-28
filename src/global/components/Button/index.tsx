import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, spacing, radius, fontSize, fontWeight } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getButtonColor = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.button.primary };
      case 'secondary':
        return {
          backgroundColor: colors.button.secondary,
          borderWidth: 1,
          borderColor: colors.border.primary,
        };
      case 'danger':
        return { backgroundColor: colors.button.danger };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: colors.button.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.text.inverse;
      case 'secondary':
      case 'danger':
        return colors.text.primary;
      case 'ghost':
        return colors.accent.primary;
      default:
        return colors.text.primary;
    }
  };

  const getLoaderColor = () => {
    switch (variant) {
      case 'primary':
        return colors.text.inverse;
      case 'secondary':
      case 'ghost':
        return colors.accent.primary;
      case 'danger':
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  const buttonStyles = [
    styles.button,
    getButtonColor(),
    styles[size],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    { color: getTextColor() },
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: fontWeight.semibold,
  },
  smallText: {
    fontSize: fontSize.sm,
  },
  mediumText: {
    fontSize: fontSize.md,
  },
  largeText: {
    fontSize: fontSize.lg,
  },
});
