// App.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "./axiosConfig";
import ForecastCard from "./ForecastCard";
import "./App.css";

function App() {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  // Debounce helper
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch current weather
  const getWeather = useCallback(async (cityName) => {
    try {
      setError("");
      const res = await api.get("/weather", { params: { q: cityName } });
      setWeather(res.data);
      getForecast(cityName);
    } catch (err) {
      setError("City not found");
      setWeather(null);
      setForecast([]);
    }
  }, []);

  // Fetch forecast
  const getForecast = async (cityName) => {
    try {
      const res = await api.get("/forecast", { params: { q: cityName } });
      const grouped = {};

      res.data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      const dates = Object.keys(grouped).slice(1, 7);
      const formatted = dates.map((date) => ({
        date,
        items: grouped[date],
      }));

      setForecast(formatted);
    } catch (err) {
      setError("Forecast not available");
    }
  };

  // Debounced search
  const handleSearch = useCallback(
    debounce((value) => {
      if (value.trim()) {
        getWeather(value.trim());
      }
    }, 600),
    []
  );

  useEffect(() => {
    getWeather("Delhi");
  }, [getWeather]);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="app-card">
        <h1 className="app-title">🌦️ Weather App</h1>

        {/* Theme toggle */}
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city..."
            onChange={(e) => {
              setCity(e.target.value);
              handleSearch(e.target.value);
            }}
            value={city}
          />
        </div>

        {/* Error message */}
        {error && <p className="error">{error}</p>}

        {/* Current Weather */}
        {weather && (
          <div className="weather-card">
            <h2>{weather.name}</h2>
            <p className="temp">{weather.main.temp}°C</p>
            <p>{weather.weather[0].description}</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>💨 Wind: {weather.wind.speed} m/s</p>
          </div>
        )}

        {/* Forecast */}
        <ForecastCard forecast={forecast} />
      </div>
    </div>
  );
}

export default App;
