import React from "react";

const WeatherCard = ({ data }) => {
  const { name, main, weather, wind } = data;

  return (
    <div className="card weather-card">
      <div className="city">{name}</div>
      <div className="temp">{main.temp}°C</div>
      <div className="desc">{weather[0].description}</div>
      <div className="info">💧 Humidity: {main.humidity}%</div>
      <div className="info">💨 Wind: {wind.speed} m/s</div>
    </div>
  );
};

export default WeatherCard;
