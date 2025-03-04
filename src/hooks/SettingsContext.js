import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Crear el contexto
const SettingsContext = createContext();

// Proveedor del contexto
export const SettingsProvider = ({ children }) => {
  const [temperatureUnit, setTemperatureUnit] = useState("Celsius");
  const [textSize, setTextSize] = useState("Normal");
  const [soundEffects, setSoundEffects] = useState(true);

  // Cargar configuraciones almacenadas cuando la app se inicie
  useEffect(() => {
    const loadSettings = async () => {
      const savedTemperatureUnit = await AsyncStorage.getItem(
        "temperatureUnit"
      );
      const savedTextSize = await AsyncStorage.getItem("textSize");
      const savedSoundEffects = await AsyncStorage.getItem("soundEffects");

      if (savedTemperatureUnit) setTemperatureUnit(savedTemperatureUnit);
      if (savedTextSize) setTextSize(savedTextSize);
      if (savedSoundEffects) setSoundEffects(JSON.parse(savedSoundEffects));
    };
    loadSettings();
  }, []);

  // Funciones para actualizar las configuraciones
  const changeTemperatureUnit = async (unit) => {
    setTemperatureUnit(unit);
    await AsyncStorage.setItem("temperatureUnit", unit);
  };

  const changeTextSize = async (size) => {
    setTextSize(size);
    await AsyncStorage.setItem("textSize", size);
  };

  const toggleSoundEffects = async () => {
    const newValue = !soundEffects;
    setSoundEffects(newValue);
    await AsyncStorage.setItem("soundEffects", JSON.stringify(newValue));
  };

  return (
    <SettingsContext.Provider
      value={{
        temperatureUnit,
        textSize,
        soundEffects,
        changeTemperatureUnit,
        changeTextSize,
        toggleSoundEffects,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Hook para usar el contexto
export const useSettings = () => useContext(SettingsContext);
