import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background items-center justify-center" style={{ paddingTop: insets.top }}>
      <Text className="text-content text-[22px] font-bold mb-2">Review</Text>
      <Text className="text-content-secondary text-base">Coming soon</Text>
    </View>
  );
}
