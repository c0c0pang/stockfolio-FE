import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dashboard from '../../pages/Dashboard';
import Portfolio from '../../pages/Portfolio';
import News from '../../pages/News';
import Glossary from '../../pages/Glossary';
import MyPage from '../../pages/MyPage';
import StockAdd from '../../pages/StockAdd';
import StockDetail from '../../pages/StockDetail';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import ForgotPassword from '../../pages/ForgotPassword';
import { NewsWebView } from '../../pages/News/core/NewsWebView';
import { useTheme } from '../theme';
import { useAuthStore } from '../stores';
import { Loading, Onboarding } from '../components';
import { CustomTabBar } from './CustomTabBar';

// 타입 정의
export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  // App screens
  MainTabs: undefined;
  StockAdd: undefined;
  StockDetail: { stockId: number };
  NewsWebView: { url: string; title?: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Portfolio: undefined;
  News: undefined;
  Glossary: undefined;
  MyPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Glossary"
        component={Glossary}
        options={{ title: '용어사전' }}
      />
      <Tab.Screen
        name="Portfolio"
        component={Portfolio}
        options={{ title: '포트폴리오' }}
      />
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: '대시보드' }}
      />
      <Tab.Screen
        name="News"
        component={News}
        options={{ title: '뉴스' }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{ title: '내 정보' }}
      />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitle: '뒤로',
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StockAdd"
        component={StockAdd}
        options={{ title: '종목 추가' }}
      />
      <Stack.Screen
        name="StockDetail"
        component={StockDetail}
        options={{ title: '종목 상세' }}
      />
      <Stack.Screen
        name="NewsWebView"
        component={NewsWebView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const {
    isAuthenticated,
    isLoading,
    checkAuth,
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <Loading message="로딩 중..." />;
  }

  return (
    <>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
      <Onboarding
        visible={isAuthenticated && showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
    </>
  );
};

export const Navigation = () => {
  const { colors, isDark } = useTheme();

  const theme = {
    ...(isDark ? NavDarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? NavDarkTheme.colors : DefaultTheme.colors),
      primary: colors.accent.primary,
      background: colors.background.primary,
      card: colors.background.primary,
      text: colors.text.primary,
      border: colors.border.primary,
      notification: colors.accent.tertiary,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <AppNavigator />
    </NavigationContainer>
  );
};
