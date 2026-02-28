import { Text, View } from 'react-native';
import { StreakInfo } from '../../types';

type Props = {
  streak: StreakInfo;
};

export default function StreakCard({ streak }: Props) {
  return (
    <View className="bg-surface rounded-2xl p-4 items-center justify-center flex-1">
      <Text style={{ fontSize: 34 }}>🔥</Text>
      <Text className="text-secondary text-[30px] font-bold leading-tight">{streak.currentStreak}</Text>
      <Text className="text-content text-[12px] font-semibold text-center">day streak</Text>
      <Text className="text-content-secondary text-[11px] mt-1 text-center">
        Best: {streak.longestStreak}
      </Text>
    </View>
  );
}
