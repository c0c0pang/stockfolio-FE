import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';

interface ThemeToggleProps {
  size?: 'small' | 'medium';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'small' }) => {
  const { colors, isDark, toggleTheme } = useTheme();

  // 사이즈 설정
  const dimensions = size === 'small'
    ? { width: 52, height: 28, thumbSize: 22, iconSize: 12 }
    : { width: 64, height: 32, thumbSize: 26, iconSize: 14 };

  const translateX = useSharedValue(isDark ? dimensions.width - dimensions.thumbSize - 4 : 2);
  const progress = useSharedValue(isDark ? 1 : 0);

  React.useEffect(() => {
    translateX.value = withTiming(isDark ? dimensions.width - dimensions.thumbSize - 4 : 2, {
      duration: 200,
    });
    progress.value = withTiming(isDark ? 1 : 0, { duration: 200 });
  }, [isDark, dimensions.width, dimensions.thumbSize, translateX, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.border.primary, colors.accent.primary],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', colors.accent.secondary],
    ),
  }));

  const sunIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const moonIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <AnimatedPressable
      onPress={toggleTheme}
      style={[
        styles.track,
        trackStyle,
        {
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: dimensions.height / 2,
        },
      ]}
    >
      {/* 배경 아이콘들 */}
      <View style={[styles.iconContainer, { left: 6 }]}>
        <Animated.View style={sunIconStyle}>
          <Icon name="sunny" size={dimensions.iconSize} color="rgba(0,0,0,0.3)" />
        </Animated.View>
      </View>
      <View style={[styles.iconContainer, { right: 6 }]}>
        <Animated.View style={moonIconStyle}>
          <Icon name="moon" size={dimensions.iconSize} color="rgba(255,255,255,0.5)" />
        </Animated.View>
      </View>

      {/* Thumb */}
      <Animated.View
        style={[
          styles.thumb,
          thumbStyle,
          {
            width: dimensions.thumbSize,
            height: dimensions.thumbSize,
            borderRadius: dimensions.thumbSize / 2,
            top: (dimensions.height - dimensions.thumbSize) / 2,
          },
        ]}
      >
        <Icon
          name={isDark ? 'moon' : 'sunny'}
          size={dimensions.iconSize}
          color={isDark ? '#FFFFFF' : '#F59E0B'}
        />
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
