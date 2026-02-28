import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useApp, PRESET_CATEGORIES } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemePreference } from '../context/ThemeContext';
import { Category } from '../types';

const COLOR_PALETTE = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759',
  '#00D4AA', '#007AFF', '#5856D6', '#AF52DE',
  '#FF2D55', '#FFB347', '#7B61FF', '#00B894',
];

function CategoryRow({ category, onRemove }: { category: Category; onRemove: () => void }) {
  return (
    <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 gap-3">
      <View className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
      <Text style={{ fontSize: 20 }}>{category.emoji}</Text>
      <Text className="text-content text-base flex-1">{category.name}</Text>
      <TouchableOpacity
        onPress={() =>
          Alert.alert('Remove Category', `Remove "${category.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: onRemove },
          ])
        }
        className="w-7 h-7 items-center justify-center"
      >
        <Text className="text-content-tertiary text-xl leading-7">×</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddCustomModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (cat: Omit<Category, 'id' | 'sortOrder'>) => void;
}) {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const placeholderColor = isDark ? '#5A5A5E' : '#8E8E93';

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), emoji: emoji.trim() || '📌', color });
    setName('');
    setEmoji('');
    setColor(COLOR_PALETTE[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-background px-6 pt-8">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-content-secondary text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-content text-[17px] font-semibold">New Category</Text>
          <TouchableOpacity onPress={handleAdd}>
            <Text className={`text-[17px] font-semibold ${name.trim() ? 'text-accent' : 'text-content-tertiary'}`}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-content-secondary text-xs uppercase tracking-widest mb-2">Name</Text>
        <TextInput
          className="bg-surface rounded-2xl px-4 py-3 text-content text-base mb-5"
          placeholder="e.g. Focus"
          placeholderTextColor={placeholderColor}
          value={name}
          onChangeText={setName}
          maxLength={24}
        />

        <Text className="text-content-secondary text-xs uppercase tracking-widest mb-2">Emoji</Text>
        <TextInput
          className="bg-surface rounded-2xl px-4 py-3 text-content text-base mb-5"
          placeholder="Tap to pick an emoji"
          placeholderTextColor={placeholderColor}
          value={emoji}
          onChangeText={(t) => setEmoji(t.slice(-2))}
        />

        <Text className="text-content-secondary text-xs uppercase tracking-widest mb-3">Color</Text>
        <View className="flex-row flex-wrap gap-3">
          {COLOR_PALETTE.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: c }}
            >
              {color === c && (
                <Text className="text-white text-lg font-bold">✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {name.trim() ? (
          <View className="mt-8 flex-row items-center bg-surface rounded-2xl px-4 py-4 gap-3">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <Text style={{ fontSize: 20 }}>{emoji || '📌'}</Text>
            <Text className="text-content text-base">{name.trim()}</Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const THEME_OPTIONS: { label: string; value: ThemePreference }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { categories, addCategory, removeCategory, setTodayRatings } = useApp();
  const { user, logout } = useAuth();
  const { preference, setPreference, isDark } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setTodayRatings(null);
          await logout();
        },
      },
    ]);
  };

  const availablePresets = PRESET_CATEGORIES.filter(
    (p) => !categories.some((c) => c.id === p.id)
  );

  const activePillBg = isDark ? '#252530' : '#EBEBEB';

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 40, paddingTop: insets.top + 16 }}
    >
      <Text className="text-content text-[34px] font-bold">Settings</Text>

      {/* Categories section */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-content text-[22px] font-bold">Categories</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-accent px-4 py-1.5 rounded-full"
          >
            <Text className="text-black text-sm font-semibold">+ Custom</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-content-secondary text-sm">
          These are the areas you rate each day. Tap a preset to add it, or create your own.
        </Text>
      </View>

      {/* Active categories */}
      {categories.length > 0 && (
        <View className="gap-3">
          <Text className="text-content-secondary text-xs uppercase tracking-widest">
            Your Categories
          </Text>
          <View className="gap-2">
            {categories.map((cat) => (
              <CategoryRow key={cat.id} category={cat} onRemove={() => removeCategory(cat.id)} />
            ))}
          </View>
        </View>
      )}

      {/* Presets */}
      {availablePresets.length > 0 && (
        <View className="gap-3">
          <Text className="text-content-secondary text-xs uppercase tracking-widest">
            Add from Presets
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {availablePresets.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                onPress={() => addCategory({ name: preset.name, emoji: preset.emoji, color: preset.color })}
                className="flex-row items-center gap-2 bg-surface rounded-full px-4 py-2"
              >
                <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.color }} />
                <Text style={{ fontSize: 15 }}>{preset.emoji}</Text>
                <Text className="text-content text-sm">{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {categories.length === 0 && (
        <View className="bg-surface rounded-2xl p-6 items-center gap-2">
          <Text style={{ fontSize: 40 }}>📋</Text>
          <Text className="text-content text-base font-semibold">No categories yet</Text>
          <Text className="text-content-secondary text-sm text-center">
            Add a preset above or create a custom category to start tracking your days.
          </Text>
        </View>
      )}

      <AddCustomModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(cat) => addCategory(cat)}
      />

      {/* Appearance */}
      <View className="gap-3">
        <Text className="text-content text-[22px] font-bold">Appearance</Text>
        <View className="flex-row bg-surface rounded-2xl p-1 gap-1">
          {THEME_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setPreference(opt.value)}
              className="flex-1 py-2 rounded-xl items-center"
              style={preference === opt.value ? { backgroundColor: activePillBg } : undefined}
            >
              <Text
                className={`text-sm font-semibold ${
                  preference === opt.value ? 'text-content' : 'text-content-tertiary'
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Account */}
      <View className="gap-3">
        <Text className="text-content text-[22px] font-bold">Account</Text>
        <View className="bg-surface rounded-2xl px-4 py-3 flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-surface-light items-center justify-center">
            <Text className="text-content-secondary text-sm font-semibold">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text className="text-content-secondary text-sm flex-1" numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-surface rounded-2xl py-4 items-center"
        >
          <Text className="text-red-400 text-[17px] font-semibold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
