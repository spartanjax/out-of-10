import { useState } from 'react';
import { Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRatingColor } from '../theme';
import { postRating } from '../services/api';

export default function RatingFlowScreen() {
  const { categories, setTodayRatings } = useApp();
  const { token } = useAuth();
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const category = categories[step];
  const isLast = step === categories.length - 1;
  const progress = (step + 1) / categories.length;

  const finishRating = (finalScores: Record<string, number>) => {
    const today = new Date().toISOString().split('T')[0];
    const ratings = categories.map((cat) => ({
      id: `${today}-${cat.id}`,
      categoryId: cat.id,
      score: finalScores[cat.id] ?? 5,
      date: today,
    }));
    const averageScore =
      Math.round((ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length) * 10) / 10;

    setTodayRatings({ date: today, ratings, averageScore });
    navigation.goBack();

    // Fire-and-forget sync to API
    if (token) {
      ratings.forEach((r) => {
        postRating(token, { categoryId: r.categoryId, score: r.score, ratedDate: r.date }).catch(
          (err) => console.warn('Rating sync failed:', err)
        );
      });
    }
  };

  const handleScore = (score: number) => {
    const newScores = { ...scores, [category.id]: score };
    setScores(newScores);
    setTimeout(() => {
      if (isLast) {
        finishRating(newScores);
      } else {
        setStep((s) => s + 1);
      }
    }, 200);
  };

  const handleSkip = () => {
    if (isLast) {
      finishRating(scores);
    } else {
      setStep((s) => s + 1);
    }
  };

  if (!category) return null;

  const selected = scores[category.id];
  const unselectedTextColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-content-secondary text-base">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-content-secondary text-sm">
          {step + 1} of {categories.length}
        </Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-content-secondary text-base">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View className="mx-6 h-1 bg-surface-light rounded-full">
        <View
          className="h-1 rounded-full"
          style={{ backgroundColor: category.color, width: `${progress * 100}%` }}
        />
      </View>

      {/* Category */}
      <View className="flex-1 items-center justify-center px-6">
        <View
          className="w-24 h-24 rounded-3xl items-center justify-center mb-6"
          style={{ backgroundColor: category.color + '22' }}
        >
          <Text style={{ fontSize: 48 }}>{category.emoji}</Text>
        </View>
        <Text className="text-content text-[28px] font-bold mb-2">{category.name}</Text>
        <Text className="text-content-secondary text-base mb-12">How was today?</Text>

        {/* Rating grid 1–10 */}
        <View className="flex-row flex-wrap justify-center gap-3 w-full">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const isSelected = selected === n;
            return (
              <TouchableOpacity
                key={n}
                onPress={() => handleScore(n)}
                activeOpacity={0.7}
                className="w-[56px] h-[56px] rounded-2xl items-center justify-center bg-surface"
                style={isSelected ? { backgroundColor: getRatingColor(n) } : undefined}
              >
                <Text
                  className="text-xl font-bold"
                  style={{ color: isSelected ? '#000' : unselectedTextColor }}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="flex-row justify-between w-full mt-4 px-2">
          <Text className="text-content-tertiary text-xs">Terrible</Text>
          <Text className="text-content-tertiary text-xs">Amazing</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
