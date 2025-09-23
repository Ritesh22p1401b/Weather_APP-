import React from "react";

const ForecastCard = ({ data }) => {
  return (
    <div className="forecast-container">
      <h2>Next 6 Days Forecast</h2>
      <div className="forecast-grid">
        {data.map((day, index) => (
          <div key={index} className="forecast-day-card">
            <div className="date">{day.date}</div>
            {day.details.map((item, i) => (
              <div key={i} className="sub-card">
                <div className="time">{item.dt_txt.split(" ")[1]}</div>
                <div className="temp-desc">{item.main.temp}°C - {item.weather[0].description}</div>
                <div className="info">💧 Humidity: {item.main.humidity}%</div>
                <div className="info">💨 Wind: {item.wind.speed} m/s</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
