// ForecastCard.jsx
import React from "react";
import "./App.css";

function ForecastCard({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="forecast-empty">
        <p>No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="forecast-container">
      {forecast.map((day, index) => (
        <div key={index} className="forecast-card">
          <h3 className="forecast-date">{day.date}</h3>
          {day.items.map((item, i) => (
            <div key={i} className="forecast-detail">
              <p>🌡 Temp: {item.main.temp}°C</p>
              <p>💧 Humidity: {item.main.humidity}%</p>
              <p>💨 Wind: {item.wind.speed} m/s</p>
              <p>☁️ {item.weather[0].description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ForecastCard;
