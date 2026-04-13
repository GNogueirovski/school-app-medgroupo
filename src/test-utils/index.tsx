import React from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { SchoolsProvider } from '@/features/schools/context/SchoolsContext';
import { ClassesProvider } from '@/features/classes/context/ClassesContext';

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <GluestackUIProvider config={config}>
      <SchoolsProvider>
        <ClassesProvider>{children}</ClassesProvider>
      </SchoolsProvider>
    </GluestackUIProvider>
  );
}

function customRender(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react-native';
export { customRender as render, AllProviders };
