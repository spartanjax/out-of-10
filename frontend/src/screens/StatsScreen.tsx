import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRatings } from '../services/api';
import { Category } from '../types';
import CategoryLineChart from '../components/stats/CategoryLineChart';

type Period = 'week' | 'month' | 'year';
type DataPoint = { rated_date: string; score: number };

const PERIODS: { label: string; value: Period; days: number }[] = [
  { label: 'Week', value: 'week', days: 7 },
  { label: 'Month', value: 'month', days: 30 },
  { label: 'Year', value: 'year', days: 365 },
];

function generateMockData(categoryIndex: number, days: number): DataPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const score = Math.max(
      1,
      Math.min(10, Math.round(Math.sin(i * 0.35 + categoryIndex * 1.9) * 2.5 + 6.5))
    );
    return { rated_date: d.toISOString().split('T')[0], score };
  });
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center gap-0.5">
      <Text className="text-content-tertiary text-[11px]">{label}</Text>
      <Text className="text-content text-sm font-semibold">{value}</Text>
    </View>
  );
}

function CategoryCard({
  category,
  categoryIndex,
  period,
  chartWidth,
  token,
}: {
  category: Category;
  categoryIndex: number;
  period: Period;
  chartWidth: number;
  token: string | null;
}) {
  const days = PERIODS.find((p) => p.value === period)!.days;
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    setLoading(true);
    const tryFetch = token
      ? getRatings(token, { categoryId: category.id, days })
      : Promise.reject(new Error('no token'));

    tryFetch
      .then((records) => {
        if (records.length > 0) {
          setData(records);
          setUsingMock(false);
        } else {
          setData(generateMockData(categoryIndex, days));
          setUsingMock(true);
        }
      })
      .catch(() => {
        setData(generateMockData(categoryIndex, days));
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, [category.id, days, categoryIndex, token]);

  const avg =
    data.length > 0
      ? (data.reduce((s, d) => s + d.score, 0) / data.length).toFixed(1)
      : '—';
  const min = data.length > 0 ? Math.min(...data.map((d) => d.score)) : '—';
  const max = data.length > 0 ? Math.max(...data.map((d) => d.score)) : '—';

  return (
    <View className="bg-surface rounded-2xl overflow-hidden">
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-3">
        <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
        <Text style={{ fontSize: 18 }}>{category.emoji}</Text>
        <Text className="text-content text-[17px] font-semibold flex-1">{category.name}</Text>
        {usingMock && <Text className="text-content-tertiary text-[11px]">sample</Text>}
      </View>

      {loading ? (
        <View className="h-[130px] items-center justify-center">
          <ActivityIndicator color={category.color} />
        </View>
      ) : (
        <CategoryLineChart category={category} data={data} width={chartWidth} />
      )}

      <View className="flex-row justify-around px-4 py-3 border-t border-divider">
        <StatPill label="MIN" value={String(min)} />
        <StatPill label="AVG" value={String(avg)} />
        <StatPill label="MAX" value={String(max)} />
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { categories } = useApp();
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [period, setPeriod] = useState<Period>('week');
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const chartWidth = screenWidth - 32;
  const activePillBg = isDark ? '#252530' : '#EBEBEB';

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 40,
        paddingTop: insets.top + 16,
      }}
    >
      <Text className="text-content text-[34px] font-bold">Stats</Text>

      {/* Period selector */}
      <View className="flex-row bg-surface rounded-2xl p-1 gap-1">
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.value}
            onPress={() => setPeriod(p.value)}
            className="flex-1 py-2 rounded-xl items-center"
            style={period === p.value ? { backgroundColor: activePillBg } : undefined}
          >
            <Text
              className={`text-sm font-semibold ${
                period === p.value ? 'text-content' : 'text-content-tertiary'
              }`}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {categories.length === 0 ? (
        <View className="bg-surface rounded-2xl p-8 items-center gap-2">
          <Text style={{ fontSize: 36 }}>📊</Text>
          <Text className="text-content text-base font-semibold">No categories yet</Text>
          <Text className="text-content-secondary text-sm text-center">
            Add categories in Settings to start tracking your stats.
          </Text>
        </View>
      ) : (
        categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            categoryIndex={i}
            period={period}
            chartWidth={chartWidth}
            token={token}
          />
        ))
      )}
    </ScrollView>
  );
}
