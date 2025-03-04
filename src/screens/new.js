import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSettings } from "../hooks/SettingsContext";
import CustomText from "../components/TextComponent";

export default function MainScreen() {
  const navigation = useNavigation();
  const { temperatureUnit } = useSettings();

  useEffect(() => {
    navigation.setOptions({
      title: "Weather Time",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={{ marginLeft: 15 }}
        >
          <Icon name="settings" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddCity")}
          style={{ marginRight: 15 }}
        >
          <Icon name="add" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CustomText>Unidad de Temperatura: {temperatureUnit}</CustomText>
      <CustomText>Main Screen Content</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
