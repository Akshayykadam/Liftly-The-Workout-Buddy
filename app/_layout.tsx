import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { StepProvider } from "@/contexts/StepContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function NavigationController() {
  const { isOnboarded, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = (segments[0] as string) === 'onboarding';

    if (!isOnboarded && !inOnboarding) {
      // User hasn't completed onboarding, redirect to onboarding
      router.replace('/onboarding' as any);
    } else if (isOnboarded && inOnboarding) {
      // User has completed onboarding but is on onboarding screen, redirect to tabs
      router.replace('/(tabs)' as any);
    }
  }, [isOnboarded, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="meditation/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="yoga/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="health" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#000000');
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
        <UserProvider>
          <StepProvider>
            <WorkoutProvider>
              <NavigationController />
            </WorkoutProvider>
          </StepProvider>
        </UserProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
