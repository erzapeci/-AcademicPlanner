import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './app/context/ThemeContext';
import { LanguageProvider } from './app/context/LanguageContext';
import AppNavigator from './app/navigation/AppNavigator.js';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
}
