import { Text, View } from 'react-native';
import { getRatingColor } from '../../theme';

type Props = {
  score: number;
};

export default function RatingBadge({ score }: Props) {
  return (
    <View
      className="w-8 h-6 rounded-lg items-center justify-center"
      style={{ backgroundColor: getRatingColor(score) }}
    >
      <Text className="text-[13px] font-bold text-black">{score}</Text>
    </View>
  );
}
