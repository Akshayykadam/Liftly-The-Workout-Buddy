import { Tabs } from "expo-router";
import { Dumbbell, Calendar, Heart, Brain } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  black: '#000000',
  accent: '#CCFF00',
  textSecondary: '#A0A0A0'
} as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.black,
          borderTopWidth: 0,
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
          letterSpacing: 0.5
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} strokeWidth={2} />
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} strokeWidth={2} />
        }}
      />
      <Tabs.Screen
        name="mindfulness"
        options={{
          title: "Mind & Body",
          tabBarIcon: ({ color }) => <Brain size={24} color={color} strokeWidth={2} />
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: "Health",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} strokeWidth={2} />
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          href: null  // Hide from tab bar, accessible via home screen button
        }}
      />

    </Tabs>
  );
}
