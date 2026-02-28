import { Text, View } from 'react-native';
import { DailyRating, Category } from '../../types';
import RatingBadge from './RatingBadge';

type Props = {
  daily: DailyRating;
  categories: Category[];
};

export default function TodayRatings({ daily, categories }: Props) {
  return (
    <View className="bg-surface rounded-2xl p-6 gap-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-content text-[17px] font-semibold">Today</Text>
        <Text className="text-accent text-[13px]">{daily.averageScore} avg</Text>
      </View>
      {daily.ratings.map((rating) => {
        const cat = categories.find((c) => c.id === rating.categoryId);
        if (!cat) return null;
        return (
          <View key={rating.id} className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            <Text style={{ fontSize: 20, width: 28 }}>{cat.emoji}</Text>
            <Text className="text-content text-[17px] flex-1">{cat.name}</Text>
            <RatingBadge score={rating.score} />
          </View>
        );
      })}
    </View>
  );
}
