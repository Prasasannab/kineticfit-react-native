import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet, View, LogBox, StatusBar as RNStatusBar } from 'react-native';
import { ThemeProvider, useTheme } from '@/theme';

// Suppress non-critical dev environment logs from covering simulator UI
LogBox.ignoreLogs([
  '[KineticFit Storage]',
  'react-native-mmkv',
  'TurboModules',
]);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutContent() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.base }]}>
      <BottomSheetModalProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background.base} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background.base },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'KineticFit',
              headerShown: false,
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
