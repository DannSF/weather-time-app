import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SettingsProvider } from "./src/hooks/SettingsContext"; // Importa tu contexto
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
