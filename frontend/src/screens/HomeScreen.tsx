import { useCallback, useRef } from 'react';
import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import { mockStreak } from '../data/mockData';
import { useApp } from '../context/AppContext';
import StreakCard from '../components/home/StreakCard';
import RateTodayButton from '../components/home/RateTodayButton';
import TodayRatings from '../components/home/TodayRatings';
import SevenDayPreview from '../components/home/SevenDayPreview';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { categories, todayRatings } = useApp();
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 32,
        paddingTop: insets.top + 16,
      }}
    >
      <Text className="text-content text-[34px] font-bold">Out of 10</Text>
      <StreakCard streak={mockStreak} />
      {todayRatings ? (
        <TodayRatings daily={todayRatings} categories={categories} />
      ) : (
        <RateTodayButton onPress={() => navigation.navigate('RatingFlow')} />
      )}
      <SevenDayPreview />
    </ScrollView>
  );
}
