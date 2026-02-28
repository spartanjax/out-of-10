import './global.css';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';
import { darkColors, lightColors } from './src/theme';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';

const darkVars = vars({
  '--color-background': '#0D0D0F',
  '--color-surface': '#1A1A1F',
  '--color-surface-light': '#252530',
  '--color-content': '#FFFFFF',
  '--color-content-secondary': '#8E8E93',
  '--color-content-tertiary': '#5A5A5E',
  '--color-divider': '#2C2C30',
});

const lightVars = vars({
  '--color-background': '#F2F2F7',
  '--color-surface': '#FFFFFF',
  '--color-surface-light': '#EBEBEB',
  '--color-content': '#000000',
  '--color-content-secondary': '#6C6C70',
  '--color-content-tertiary': '#8E8E93',
  '--color-divider': '#E5E5EA',
});

const darkNavTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: darkColors.accent,
    background: darkColors.background,
    card: darkColors.surface,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.accent,
  },
};

const lightNavTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.accent,
    background: lightColors.background,
    card: lightColors.surface,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.accent,
  },
};

function AppContent() {
  const { isDark } = useTheme();
  return (
    <View style={[{ flex: 1 }, isDark ? darkVars : lightVars]}>
      <NavigationContainer theme={isDark ? darkNavTheme : lightNavTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
