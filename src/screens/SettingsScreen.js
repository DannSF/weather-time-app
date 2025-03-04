import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../hooks/SettingsContext";
import CustomText from "../components/TextComponent";
import Icon from "react-native-vector-icons/Feather";
import Slider from "@react-native-community/slider";
import * as Brightness from "expo-brightness";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [currentBrightness, setCurrentBrightness] = useState(1);

  const {
    temperatureUnit,
    textSize,
    soundEffects,
    brightness,
    changeTemperatureUnit,
    changeTextSize,
    toggleSoundEffects,
    changeBrightness,
  } = useSettings();

  const getTextSize = () => {
    switch (textSize) {
      case "Large":
        return 18;
      case "Extra Large":
        return 20;
      default:
        return 16;
    }
  };

  const resetSettings = () => {
    changeTemperatureUnit("Celsius");
    changeTextSize("Normal");
    // setSoundEffects(true);
    // setBrightness(0.5);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            resetSettings();
          }}
          style={{ marginRight: 15 }}
        >
          <Icon name="refresh-cw" size={24} color="black" />
        </TouchableOpacity>
      ),
    });

    const getInitialBrightness = async () => {
      const initialBrightness = await Brightness.getSystemBrightnessAsync();
      setCurrentBrightness(initialBrightness);
    };

    getInitialBrightness();
  }, [navigation]);

  const textStyle = {
    fontSize: getTextSize(),
  };

  const handleBrightnessChange = async (value) => {
    await Brightness.setSystemBrightnessAsync(value);
    setCurrentBrightness(value);
    changeBrightness(value);
  };

  return (
    <View style={[styles.container, { fontSize: getTextSize() }]}>
      <View style={styles.settingItem}>
        <CustomText style={[styles.settingLabel, styles.boldText, textStyle]}>
          Temperature Unit
        </CustomText>
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[
              styles.selectionButton,
              temperatureUnit === "Celsius" && styles.selectedButton,
            ]}
            onPress={() => changeTemperatureUnit("Celsius")}
          >
            <CustomText
              style={[
                styles.settingValue,
                temperatureUnit === "Celsius" && styles.selectedButtonText,
                textStyle,
              ]}
            >
              Celsius
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectionButton,
              temperatureUnit === "Fahrenheit" && styles.selectedButton,
            ]}
            onPress={() => changeTemperatureUnit("Fahrenheit")}
          >
            <CustomText
              style={[
                styles.settingValue,
                temperatureUnit === "Fahrenheit" && styles.selectedButtonText,
                textStyle,
              ]}
            >
              Fahrenheit
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingItem}>
        <CustomText style={[styles.settingLabel, styles.boldText, textStyle]}>
          Text Size
        </CustomText>
        <View style={styles.selectionContainer}>
          {["Normal", "Large", "Extra Large"].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.selectionButton,
                textSize === size && styles.selectedButton,
              ]}
              onPress={() => changeTextSize(size)}
            >
              <CustomText
                style={[
                  styles.settingValue,
                  textSize === size && styles.selectedButtonText,
                  textStyle,
                ]}
              >
                {size}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingItem}>
        <CustomText style={[styles.settingLabel, styles.boldText, textStyle]}>
          Sound Effects
        </CustomText>
        <Switch
          style={styles.switch}
          value={soundEffects}
          onValueChange={toggleSoundEffects}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={soundEffects ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <View style={styles.settingItem}>
        <CustomText style={[styles.settingLabel, styles.boldText, textStyle]}>
          Brightness
        </CustomText>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={currentBrightness}
          onValueChange={handleBrightnessChange}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#4CAF50"
        />
      </View>

      <View style={styles.settingItem}>
        <CustomText style={[styles.settingLabel, styles.boldText, textStyle]}>
          Weather Time
        </CustomText>
        <CustomText style={[styles.settingValue, textStyle]}></CustomText>
        <CustomText style={[styles.settingValue, textStyle]}>
          (c) 2025 ABC Solutions Pty Ltd
        </CustomText>
        <CustomText style={[styles.settingValue, textStyle]}>
          Version 1.0
        </CustomText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  settingItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  settingLabel: {
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: "#D1E7FF",
  },
  settingValue: {
    color: "#333",
  },
  selectedButtonText: {
    color: "#007BFF",
  },
  switch: {
    marginTop: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
