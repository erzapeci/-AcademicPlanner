import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './app/context/ThemeContext';
import { LanguageProvider } from './app/context/LanguageContext';
import AppNavigator from './app/navigation/AppNavigator'; // Pa ".js"
import { AuthProvider, useAuth } from './app/context/AuthContext';
import Login from './app/screens/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AuthProvider>
            {isAuthenticated ? (
              <AppNavigator />
            ) : (
              <Login setAuthenticated={setIsAuthenticated} />
            )}
          </AuthProvider>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
}
