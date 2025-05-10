import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './config/theme';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { LogBox, StatusBar } from 'react-native';
import { FirebaseProvider } from './context/FirebaseContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'AsyncStorage has been extracted from react-native core',
]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <FirebaseProvider>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </FirebaseProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
