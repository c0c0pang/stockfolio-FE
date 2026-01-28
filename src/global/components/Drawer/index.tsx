import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  Keyboard,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Backdrop } from '../Backdrop';
import { useTheme, spacing, fontSize, radius } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CLOSE_THRESHOLD = 100; // 이 이상 내리면 닫힘

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  showHandle?: boolean;
  closeOnBackdropPress?: boolean;
  closeOnSwipeDown?: boolean;
  height?: number | string;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  showHandle = true,
  closeOnBackdropPress = true,
  closeOnSwipeDown = true,
  height = '80%',
  containerStyle,
  contentStyle,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // height를 숫자로 변환
  const drawerHeight = typeof height === 'string'
    ? (parseFloat(height) / 100) * SCREEN_HEIGHT
    : height;

  // 초기값은 화면 밖 (아래)
  const translateY = useSharedValue(drawerHeight);

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(drawerHeight, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible, drawerHeight, translateY]);

  const panGesture = Gesture.Pan()
    .enabled(closeOnSwipeDown)
    .onUpdate((event) => {
      // 아래로만 드래그 가능 (위로는 안됨)
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_THRESHOLD || event.velocityY > 500) {
        // 닫기
        translateY.value = withTiming(drawerHeight, {
          duration: 200,
          easing: Easing.in(Easing.cubic),
        });
        runOnJS(onClose)();
      } else {
        // 원위치
        translateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
      <GestureHandlerRootView style={styles.gestureRoot}>
        <View style={[styles.container, containerStyle]}>
          <Backdrop
            visible={visible}
            onPress={handleBackdropPress}
            opacity={0.5}
            fadeInDuration={100}
            fadeOutDuration={250}
          />
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.drawer,
                {
                  height: drawerHeight,
                  backgroundColor: colors.background.primary,
                  paddingBottom: insets.bottom,
                },
                animatedStyle,
              ]}
            >
              {/* Handle */}
              {showHandle && (
                <View style={styles.handleContainer}>
                  <View style={[styles.handle, { backgroundColor: colors.border.primary }]} />
                </View>
              )}

              {/* Header */}
              {(title || showCloseButton) && (
                <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
                  {showCloseButton ? (
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <Icon name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.closeButton} />
                  )}
                  {title && (
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                      {title}
                    </Text>
                  )}
                  <View style={styles.closeButton} />
                </View>
              )}

              {/* Content */}
              <View style={[styles.content, contentStyle]}>
                {children}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  drawer: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
});
