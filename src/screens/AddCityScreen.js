import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "../components/TextComponent";

import { cityData } from "../assets/cities";
import { fetchWeather } from "../services/weatherService";

export default function CityScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: "Add City",
      headerTitleAlign: "center",
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    const allCities = cityData
      .map((item) => item.cities.map((city) => `${city}, ${item.country}`))
      .flat();

    setFilteredCities(allCities);
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = cityData
      .map((item) => {
        return item.cities
          .filter(
            (city) =>
              city.toLowerCase().includes(text.toLowerCase()) ||
              item.country.toLowerCase().includes(text.toLowerCase())
          )
          .map((city) => `${city}, ${item.country}`);
      })
      .flat();

    setFilteredCities(filtered);
  };

  const searchCity = async () => {
    if (search.trim() === "") {
      Alert.alert("Error", "Please enter a city name.");
      return;
    }

    const foundCity = cityData
      .map((item) => item.cities)
      .flat()
      .find((city) => city.toLowerCase().includes(search.toLowerCase()));

    if (foundCity) {
      setFilteredCities([
        `${foundCity}, ${
          cityData.find((item) => item.cities.includes(foundCity)).country
        }`,
      ]);
    } else {
      const cityExistsInApi = await fetchWeatherData(search);
      if (!cityExistsInApi) {
        Alert.alert("City not found", "This city is not available.");
      } else {
        await AsyncStorage.setItem("searchedCity", JSON.stringify(search));
        navigation.navigate("Main");
      }
    }
  };

  const addCity = async (cityName) => {
    const existingCities = await AsyncStorage.getItem("cities");
    const citiesArray = existingCities ? JSON.parse(existingCities) : [];

    if (!citiesArray.includes(cityName)) {
      citiesArray.push(cityName);
      await AsyncStorage.setItem("cities", JSON.stringify(citiesArray));
      navigation.navigate("Main");
    } else {
      Alert.alert("Error", "City already added");
    }
  };

  const fetchWeatherData = async (cityName) => {
    try {
      const weather = await fetchWeather(cityName);
      if (weather && weather.cod === 200) {
        addCity(cityName);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search city or country..."
          value={search}
          onChangeText={handleSearch}
          returnKeyType="search"
          onSubmitEditing={() => searchCity()}
        />
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <CustomText style={styles.cancelText}>Cancel</CustomText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cityItem}
            onPress={() => addCity(item)}
          >
            <CustomText style={styles.cityText}>{item}</CustomText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingVertical: 5,
  },

  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    color: "blue",
  },
  cityItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 5,
  },
  cityText: {},
});
