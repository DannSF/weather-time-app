const API_KEY = "92d1009269b553a571a53903bb9f8975";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeather = async (city, units) => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&units=${units}&appid=${API_KEY}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
