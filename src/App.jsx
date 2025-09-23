import React, { useState, useEffect, useCallback } from "react";
import WeatherCard from "./WeatherCard.jsx";
import ForecastCard from "./ForecastCard.jsx";
import "./App.css";

const apiKey = "391d07c922bdfeff1fe1a5651d758e50";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

const App = () => {
  const [inputCity, setInputCity] = useState("Delhi"); // controlled input
  const [city, setCity] = useState("Delhi");           // actual city used for API
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    try {
      setLoading(true);
      const res = await fetch(`${weatherUrl}?q=${cityName}&appid=${apiKey}&units=metric`);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);

      const forecastRes = await fetch(`${forecastUrl}?q=${cityName}&appid=${apiKey}&units=metric`);
      if (!forecastRes.ok) throw new Error("Forecast not found");
      const forecastData = await forecastRes.json();

      const daily = {};
      forecastData.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) daily[date] = [];
        daily[date].push(item);
      });

      const next6Days = Object.keys(daily).slice(1, 7).map(date => ({
        date,
        details: daily[date]
      }));
      setForecast(next6Days);

    } catch (err) {
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Correct debounce with useCallback
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((searchCity) => {
      if (searchCity) setCity(searchCity); // trigger fetchWeather
    }, 500),
    []
  );

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="container">
        <h1>🌦️ Weather App</h1>

        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name..."
            value={inputCity}
            onChange={(e) => {
              setInputCity(e.target.value);
              debouncedSearch(e.target.value.trim());
            }}
          />
        </div>

        {loading && <div className="loading">⏳ Loading weather...</div>}

        {weather && <WeatherCard data={weather} />}
        {forecast.length > 0 && <ForecastCard data={forecast} />}
      </div>
    </div>
  );
};

export default App;
