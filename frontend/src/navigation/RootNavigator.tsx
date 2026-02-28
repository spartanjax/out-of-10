import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AppStackParamList, AuthStackParamList } from '../types';
import TabNavigator from './TabNavigator';
import RatingFlowScreen from '../screens/RatingFlowScreen';
import AuthScreen from '../screens/AuthScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Brief splash while restoring session from SecureStore
    return <View className="flex-1 bg-background" />;
  }

  if (!user) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Auth" component={AuthScreen} />
      </AuthStack.Navigator>
    );
  }

  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Tabs" component={TabNavigator} />
      <AppStack.Screen
        name="RatingFlow"
        component={RatingFlowScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
    </AppStack.Navigator>
  );
}
