import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface BackdropProps {
  visible: boolean;
  onPress?: () => void;
  opacity?: number;
  color?: string;
  style?: ViewStyle;
  dismissKeyboard?: boolean;
  /** 페이드인 애니메이션 시간 (ms) */
  fadeInDuration?: number;
  /** 페이드아웃 애니메이션 시간 (ms) */
  fadeOutDuration?: number;
}

export const Backdrop: React.FC<BackdropProps> = ({
  visible,
  onPress,
  opacity = 0.5,
  color = '#000000',
  style,
  dismissKeyboard = true,
  fadeInDuration = 150,
  fadeOutDuration = 200,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // 열릴 때 키보드 닫기
      if (dismissKeyboard) {
        Keyboard.dismiss();
      }
      progress.value = withTiming(1, { duration: fadeInDuration });
    } else {
      progress.value = withTiming(0, { duration: fadeOutDuration });
    }
  }, [visible, dismissKeyboard, fadeInDuration, fadeOutDuration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 1],
      [0, opacity],
      Extrapolation.CLAMP,
    ),
    pointerEvents: progress.value > 0 ? 'auto' : 'none',
  }));

  const handlePress = () => {
    if (dismissKeyboard) {
      Keyboard.dismiss();
    }
    onPress?.();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: color },
          animatedStyle,
          style,
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
