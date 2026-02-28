import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

function getGreeting(): string {
  const hour = new Date().getHours();
  const timeBased =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const pool = [timeBased, timeBased, 'Kia ora', 'Bonjour', 'Ciao', 'Hola', "G'day", 'Namaste', 'Shalom'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function formatName(email: string): string {
  const prefix = email.split('@')[0];
  const cleaned = prefix.replace(/[._-]+/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function WelcomeHome() {
  const { user } = useAuth();
  const [greeting] = useState(getGreeting);

  const displayName = user ? formatName(user.email) : '';

  return (
    <View className="flex-1 bg-surface rounded-2xl p-4 justify-center">
      <Text className="text-content-secondary text-[13px]">{greeting},</Text>
      <Text className="text-content text-[26px] font-bold" numberOfLines={1} adjustsFontSizeToFit>
        {displayName}
      </Text>
    </View>
  );
}
