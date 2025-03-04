import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSettings } from "../hooks/SettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "../components/TextComponent";
import { fetchWeather } from "../services/weatherService";
import moment from "moment";
import { Swipeable } from "react-native-gesture-handler";

export default function MainScreen() {
  const navigation = useNavigation();
  const { temperatureUnit } = useSettings();
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const unit = temperatureUnit === "Celsius" ? "metric" : "imperial";

  useEffect(() => {
    const fetchCities = async () => {
      const storedCities = await AsyncStorage.getItem("cities");
      if (storedCities) {
        setCities(JSON.parse(storedCities));
      }
    };
    fetchCities();

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

  const deleteCity = async (index) => {
    const newCities = [...cities];
    newCities.splice(index, 1);
    setCities(newCities);
    await AsyncStorage.setItem("cities", JSON.stringify(newCities));
  };

  const getLocalTime = (timestamp, timezoneOffset) => {
    const localTime = moment.unix(timestamp).utcOffset(timezoneOffset);
    return localTime.format("dddd, hh:mm A");
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const fetchedWeather = [];

      for (let city of cities) {
        const data = await fetchWeather(city, unit);
        if (data) {
          const timezoneOffset = data.timezone / 3600;
          const localTime = getLocalTime(data.dt, timezoneOffset);

          fetchedWeather.push({
            name: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            weatherDescription: data.weather[0].description,
            weatherIcon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            currentTime: localTime,
            currentDate: moment.unix(data.dt).format("MMMM D, YYYY"),
          });
        }
      }

      setWeatherData(fetchedWeather);
    };

    if (cities.length > 0) {
      fetchWeatherData();
    }
  }, [cities, temperatureUnit]);

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>
        Unidad de Temperatura: {temperatureUnit}
      </CustomText>

      {cities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <CustomText style={styles.emptyMessageTittle}>
            Welcome to Weather Time!
          </CustomText>
          <CustomText style={styles.emptyMessage}>
            Press{" "}
            <Icon name="add" size={24} color="black" style={styles.icon} /> to
            add cities from around the world to view their date, time, and
            weather.
          </CustomText>
          <CustomText style={styles.emptyMessage}>
            Press{" "}
            <Icon name="settings" size={24} color="black" style={styles.icon} />{" "}
            for settings.
          </CustomText>
          <CustomText style={styles.emptyMessage}>
            Settings enables the user to select unit of temperature, text size,
            sound effects, and brightness.
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={weatherData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Swipeable
              renderRightActions={() => (
                <View style={styles.deleteContainer}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteCity(index)}
                  >
                    <CustomText style={styles.deleteText}>Eliminar</CustomText>
                  </TouchableOpacity>
                </View>
              )}
            >
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <CustomText style={styles.cityText}>
                    {item.name}, {item.country}
                  </CustomText>
                </View>
                <View style={styles.cardBody}>
                  <CustomText style={styles.time}>
                    {item.currentTime}
                  </CustomText>
                  <View style={styles.weatherInfo}>
                    <Image
                      source={{ uri: item.weatherIcon }}
                      style={styles.weatherIcon}
                    />
                    <CustomText style={styles.temperature}>
                      {Math.round(item.temperature)}°
                      {unit === "metric" ? "C" : "F"}
                    </CustomText>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <CustomText style={styles.date}>
                    {item.currentDate}
                  </CustomText>
                  <CustomText style={styles.weatherDescription}>
                    {item.weatherDescription}
                  </CustomText>
                </View>
              </View>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cityText: {
    fontWeight: "bold",
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  time: {
    color: "#888",
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  temperature: {
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    color: "#888",
  },
  weatherDescription: {
    fontStyle: "italic",
    color: "#555",
  },

  deleteContainer: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "90%",
    borderRadius: 8,
  },

  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 10,
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyMessageTittle: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center",
  },

  emptyMessage: {
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
});
