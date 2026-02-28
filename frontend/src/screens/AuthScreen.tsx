import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, signup } = useAuth();
  const { isDark } = useTheme();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && !loading;
  const placeholderColor = isDark ? '#5A5A5E' : '#8E8E93';

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim().toLowerCase(), password);
      } else {
        await signup(email.trim().toLowerCase(), password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center" style={{ minHeight: 500 }}>
          <View className="mb-12">
            <Text className="text-accent font-bold" style={{ fontSize: 52, lineHeight: 58 }}>
              Out of 10
            </Text>
            <Text className="text-content-secondary text-lg mt-2">
              Track what matters, daily.
            </Text>
          </View>

          {/* Mode toggle */}
          <View className="flex-row gap-8 mb-8">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <TouchableOpacity key={m} onPress={() => switchMode(m)}>
                <Text
                  className={`text-[17px] font-semibold ${
                    mode === m ? 'text-content' : 'text-content-tertiary'
                  }`}
                >
                  {m === 'login' ? 'Log In' : 'Sign Up'}
                </Text>
                {mode === m && <View className="h-0.5 bg-accent rounded-full mt-1" />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs */}
          <View className="gap-3">
            <TextInput
              className="bg-surface rounded-2xl px-4 py-4 text-content text-base"
              placeholder="Email"
              placeholderTextColor={placeholderColor}
              value={email}
              onChangeText={(t) => { setEmail(t); setError(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
            />
            <TextInput
              className="bg-surface rounded-2xl px-4 py-4 text-content text-base"
              placeholder={mode === 'signup' ? 'Password (min 6 characters)' : 'Password'}
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {/* Error */}
          {error ? (
            <View className="bg-red-500/10 rounded-xl px-4 py-3 mt-4">
              <Text className="text-red-400 text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            className="bg-accent rounded-2xl py-4 mt-5 items-center justify-center"
            style={{ opacity: canSubmit ? 1 : 0.4 }}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-black text-[17px] font-semibold">
                {mode === 'login' ? 'Log In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Hint for password length */}
          {mode === 'signup' && password.length > 0 && password.length < 6 && (
            <Text className="text-content-tertiary text-xs text-center mt-3">
              Password must be at least 6 characters
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
