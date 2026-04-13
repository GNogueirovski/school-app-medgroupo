import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { makeServer } from '@/mocks/server';
import { SchoolsProvider } from '@/features/schools/context/SchoolsContext';
import { ClassesProvider } from '@/features/classes/context/ClassesContext';

export default function RootLayout() {
  useEffect(() => {
    if (__DEV__) {
      makeServer();
    }
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <GluestackUIProvider config={config} colorMode="dark">
        <SchoolsProvider>
          <ClassesProvider>
            <Stack />
          </ClassesProvider>
        </SchoolsProvider>
      </GluestackUIProvider>
    </ThemeProvider>
  );
}
