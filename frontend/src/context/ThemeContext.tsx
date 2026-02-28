import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextType = {
  preference: ThemePreference;
  isDark: boolean;
  setPreference: (p: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  preference: 'system',
  isDark: false,
  setPreference: () => {},
});

const THEME_KEY = 'theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const osScheme = useColorScheme();

  const isDark =
    preference === 'dark' || (preference === 'system' && osScheme === 'dark');

  useEffect(() => {
    SecureStore.getItemAsync(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
  }, []);

  const setPreference = (pref: ThemePreference) => {
    setPreferenceState(pref);
    SecureStore.setItemAsync(THEME_KEY, pref);
  };

  return (
    <ThemeContext.Provider value={{ preference, isDark, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
