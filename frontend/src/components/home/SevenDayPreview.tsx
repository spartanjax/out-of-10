import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getRatings } from '../../services/api';
import { Category } from '../../types';
import CategoryLineChart from '../stats/CategoryLineChart';

type DataPoint = { rated_date: string; score: number };

const LAST_CAT_KEY = 'last_selected_category';

function generateMockData(categoryIndex: number): DataPoint[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const score = Math.max(
      1,
      Math.min(10, Math.round(Math.sin(i * 0.5 + categoryIndex * 1.9) * 2.5 + 6.5))
    );
    return { rated_date: d.toISOString().split('T')[0], score };
  });
}

function CategoryPicker({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = categories.find((c) => c.id === selectedId);
  const selectedItemBg = isDark ? '#252530' : '#EBEBEB';

  if (!selected) return null;

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className="flex-row items-center gap-1.5 bg-surface-light rounded-full px-3 py-1.5"
      >
        <View className="w-2 h-2 rounded-full" style={{ backgroundColor: selected.color }} />
        <Text className="text-content text-sm font-medium">{selected.name}</Text>
        <Text className="text-content-tertiary text-xs">▾</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity
            className="absolute inset-0"
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />

          {/* Bottom sheet */}
          <View className="bg-surface rounded-t-3xl px-4 pt-3 pb-10">
            {/* Handle */}
            <View className="w-10 h-1 bg-divider rounded-full mx-auto mb-5" />
            <Text className="text-content-tertiary text-xs uppercase tracking-widest mb-2 px-1">
              Category
            </Text>
            {categories.map((cat) => {
              const isSelected = cat.id === selectedId;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    onSelect(cat.id);
                    setOpen(false);
                  }}
                  className="flex-row items-center gap-3 py-3 px-2 rounded-xl"
                  style={isSelected ? { backgroundColor: selectedItemBg } : undefined}
                  activeOpacity={0.7}
                >
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                  <Text className="text-content text-[17px] flex-1">{cat.name}</Text>
                  {isSelected && <Text className="text-accent font-semibold">✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function SevenDayPreview() {
  const { categories } = useApp();
  const { token } = useAuth();
  const { width: screenWidth } = useWindowDimensions();

  const [selectedId, setSelectedId] = useState<string | null>(categories[0]?.id ?? null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Restore last selected category from storage (once, on mount)
  useEffect(() => {
    SecureStore.getItemAsync(LAST_CAT_KEY).then((stored) => {
      if (stored && categories.find((c) => c.id === stored)) {
        setSelectedId(stored);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep selectedId valid when categories list changes
  useEffect(() => {
    if (categories.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !categories.find((c) => c.id === selectedId)) {
      setSelectedId(categories[0].id);
    }
  }, [categories, selectedId]);

  // Fetch data whenever selection or token changes
  useEffect(() => {
    if (!selectedId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const catIndex = categories.findIndex((c) => c.id === selectedId);

    const fetchData = token
      ? getRatings(token, { categoryId: selectedId, days: 7 })
      : Promise.reject(new Error('no token'));

    fetchData
      .then((records) =>
        setData(records.length > 0 ? records : generateMockData(catIndex < 0 ? 0 : catIndex))
      )
      .catch(() => setData(generateMockData(catIndex < 0 ? 0 : catIndex)))
      .finally(() => setLoading(false));
  }, [selectedId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (id: string) => {
    setSelectedId(id);
    SecureStore.setItemAsync(LAST_CAT_KEY, id);
  };

  const selectedCategory = categories.find((c) => c.id === selectedId);
  const chartWidth = screenWidth - 32;
  const chartHeight = 200;

  if (categories.length === 0) return null;

  return (
    <View className="bg-surface rounded-2xl overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text className="text-content text-[17px] font-semibold">Last 7 Days</Text>
        <CategoryPicker
          categories={categories}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </View>

      {/* Chart */}
      {loading ? (
        <View className="h-[200px] items-center justify-center">
          <ActivityIndicator color={selectedCategory?.color ?? '#00D4AA'} />
        </View>
      ) : selectedCategory ? (
        <CategoryLineChart
          category={selectedCategory}
          data={data}
          width={chartWidth}
          height={chartHeight}
          showAxes
        />
      ) : null}

      {/* Bottom padding */}
      <View className="h-3" />
    </View>
  );
}
