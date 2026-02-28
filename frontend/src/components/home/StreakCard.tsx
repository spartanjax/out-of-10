import { Text, View } from 'react-native';
import { StreakInfo } from '../../types';

type Props = {
  streak: StreakInfo;
};

export default function StreakCard({ streak }: Props) {
  return (
    <View className="bg-surface rounded-2xl p-6 flex-row items-center gap-4">
      <Text style={{ fontSize: 40 }}>🔥</Text>
      <View className="flex-1">
        <View className="flex-row items-baseline gap-2">
          <Text className="text-secondary text-[34px] font-bold">{streak.currentStreak}</Text>
          <Text className="text-content text-[17px] font-semibold">day streak</Text>
        </View>
        <Text className="text-content-secondary text-[13px] mt-1">
          Longest: {streak.longestStreak} days
        </Text>
      </View>
    </View>
  );
}
