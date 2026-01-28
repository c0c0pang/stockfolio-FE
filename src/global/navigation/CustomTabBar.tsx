import React, { useEffect, useCallback } from 'react';
import { View, Pressable, StyleSheet, Platform, Vibration } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme, spacing } from '../theme';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Glossary: { active: 'book', inactive: 'book-outline' },
  Portfolio: { active: 'briefcase', inactive: 'briefcase-outline' },
  Dashboard: { active: 'home', inactive: 'home-outline' },
  News: { active: 'newspaper', inactive: 'newspaper-outline' },
  MyPage: { active: 'person', inactive: 'person-outline' },
};

const triggerHaptic = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(1);
  } else {
    Vibration.vibrate(5);
  }
};

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface TabButtonProps {
  route: { key: string; name: string };
  isFocused: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  colors: ReturnType<typeof useTheme>['colors'];
}

const TabButton: React.FC<TabButtonProps> = ({
  route,
  isFocused,
  onPress,
  accessibilityLabel,
  colors,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, {
      damping: 12,
      stiffness: 400,
    });
    translateY.value = withSpring(isFocused ? -4 : 0, {
      damping: 12,
      stiffness: 400,
    });
  }, [isFocused, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const iconConfig = TAB_ICONS[route.name] || { active: 'help', inactive: 'help-outline' };
  const iconName = isFocused ? iconConfig.active : iconConfig.inactive;

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 12, stiffness: 500 });
    triggerHaptic();
  };

  const handlePressOut = () => {
    scale.value = withSpring(isFocused ? 1.15 : 1, { damping: 12, stiffness: 400 });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
    >
      <Animated.View style={animatedStyle}>
        <Icon
          name={iconName}
          size={24}
          color={isFocused ? colors.accent.secondary : colors.text.tertiary}
        />
      </Animated.View>
    </Pressable>
  );
};

interface CenterButtonProps {
  isFocused: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  colors: ReturnType<typeof useTheme>['colors'];
}

const CenterButton: React.FC<CenterButtonProps> = ({
  isFocused,
  onPress,
  accessibilityLabel,
  colors,
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      rotation.value = withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 40 }),
      );
    }
  }, [isFocused, rotation]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 12, stiffness: 500 });
    triggerHaptic();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 400 });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.centerButtonContainer}
    >
      <Animated.View
        style={[
          styles.centerButton,
          { backgroundColor: colors.accent.secondary },
          animatedButtonStyle,
        ]}
      >
        <Animated.View style={animatedIconStyle}>
          <Icon name={isFocused ? 'home' : 'home-outline'} size={28} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.tabBar, { backgroundColor: colors.background.card }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isDashboard = route.name === 'Dashboard';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isDashboard) {
            return (
              <CenterButton
                key={route.key}
                isFocused={isFocused}
                onPress={onPress}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                colors={colors}
              />
            );
          }

          return (
            <TabButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              colors={colors}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
