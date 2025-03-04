// CustomText.js
import React from "react";
import { Text, StyleSheet } from "react-native";
import { useSettings } from "../hooks/SettingsContext"; // Importa el contexto

const CustomText = ({ style, children, ...props }) => {
  const { textSize } = useSettings(); // Obtén el tamaño de texto desde el contexto

  const textSizeStyles = {
    Normal: 16,
    Large: 18,
    "Extra Large": 20,
  };

  return (
    <Text
      style={[{ fontSize: textSizeStyles[textSize] || 16 }, style]} // Aplica el tamaño de texto
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
