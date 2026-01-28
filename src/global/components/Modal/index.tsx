import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal as RNModal,
  Keyboard,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Backdrop } from '../Backdrop';
import { useTheme, spacing, radius } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  animationType?: 'fade' | 'scale' | 'slide';
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
  animationType = 'scale',
  containerStyle,
  contentStyle,
}) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      progress.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      progress.value = withTiming(0, { duration: 150 });
    }
  }, [visible, progress]);

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'fade':
        return useAnimatedStyle(() => ({
          opacity: progress.value,
        }));
      case 'slide':
        return useAnimatedStyle(() => ({
          opacity: progress.value,
          transform: [
            { translateY: (1 - progress.value) * 50 },
          ],
        }));
      case 'scale':
      default:
        return useAnimatedStyle(() => ({
          opacity: progress.value,
          transform: [
            { scale: 0.9 + progress.value * 0.1 },
          ],
        }));
    }
  };

  const animatedStyle = getAnimatedStyle();

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.container, containerStyle]}>
        <Backdrop
          visible={visible}
          onPress={handleBackdropPress}
          opacity={0.5}
        />
        <Animated.View
          style={[
            styles.content,
            { backgroundColor: colors.background.primary },
            animatedStyle,
            contentStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
});
