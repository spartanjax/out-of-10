import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function RateTodayButton({ onPress }: Props) {
  return (
    <View className="bg-surface rounded-2xl p-6 items-center gap-2">
      <Text className="text-content text-[22px] font-bold">How did you do today?</Text>
      <Text className="text-content-secondary text-[13px] text-center">
        Rate your categories to keep your streak alive
      </Text>
      <TouchableOpacity
        className="bg-accent px-8 py-3 rounded-full mt-2"
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text className="text-black text-[17px] font-semibold">Rate Today</Text>
      </TouchableOpacity>
    </View>
  );
}
