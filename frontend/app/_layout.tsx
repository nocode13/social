import { Stack } from 'expo-router';

import userModel from '@/entities/user';
import { useGate, useUnit } from 'effector-react';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
  const [sessionStatus] = useUnit([userModel.$sessionStatus]);
  useGate(userModel.Gate);

  const isLoading = sessionStatus === 'initial' || sessionStatus === 'pending';
  const isLoggedIn = sessionStatus === 'authorized';

  return (
    <GluestackUIProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isLoading}>
          <Stack.Screen name="splash" />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn && !isLoading}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn && !isLoading}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  );
}
