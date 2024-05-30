const axios = require("axios");
require("dotenv").config();

const { db } = require("./db");

async function fetchCurrentWeatherData(city) {
  const [existingWeather] = await db.query(
    "SELECT * FROM weather_data WHERE city =? ORDER BY data_recorded DESC LIMIT 1",
    [city],
  );
  
  if (existingWeather.length > 0) {
    return  {
      current: {
        temp_c: existingWeather[0].temperature_c,
        temp_h: existingWeather[0].temperature_h,
        feelslike_c: existingWeather[0].feelslike_c,
        feelslike_f: existingWeather[0].feelslike_f,
        condition: {
          text: existingWeather[0].condition_text,
          icon: existingWeather[0].condition_icon,
          code: existingWeather[0].condition_code,
        },
        wind_mph: existingWeather[0].wind_mph,
        wind_kph: existingWeather[0].wind_kph,
        wind_degree: existingWeather[0].wind_degree,
        pressure_mb: existingWeather[0].pressure_mb,
        pressure_in: existingWeather[0].pressure_in,
        precip_mm: existingWeather[0].precip_mm,
        precip_in: existingWeather[0].precip_in,
        humidity: existingWeather[0].humidity,
        cloud: existingWeather[0].cloud,
        is_day: existingWeather[0].is_day,
        uv: existingWeather[0].uv,
        gust_mph: existingWeather[0].gust_mph,
        gust_kph: existingWeather[0].gust_kph,
        last_updated: existingWeather[0].last_updated,
        last_updated_epoch: existingWeather[0].last_updated_epoch,
      },
      location: { name: city },
    };
  }
  

  try {
    const response = await axios.get(
      `${process.env.API_URL}/current.json?key=${process.env.API_KEY}&q=${city}`,
    );
    const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    await db.query(
      "INSERT INTO weather_data (city, temperature_c, temperature_h, feelslike_c, feelslike_f, condition_text, condition_icon, condition_code, wind_mph, wind_kph, wind_degree, pressure_mb, pressure_in, precip_mm, precip_in, humidity, cloud, is_day, uv, gust_mph, gust_kph, last_updated, data_recorded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        city,
        response.data.current.temp_c,
        response.data.current.temp_h,
        response.data.current.feelslike_c,
        response.data.current.feelslike_f,
        response.data.current.condition.text,
        response.data.current.condition.icon,
        response.data.current.condition.code,
        response.data.current.wind_mph,
        response.data.current.wind_kph,
        response.data.current.wind_degree,
        response.data.current.pressure_mb,
        response.data.current.pressure_in,
        response.data.current.precip_mm,
        response.data.current.precip_in,
        response.data.current.humidity,
        response.data.current.cloud,
        response.data.current.is_day,
        response.data.current.uv,
        response.data.current.gust_mph,
        response.data.current.gust_kph,
        response.data.current.last_updated,
        currentTime,
      ],
    );   

    return response.data;
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    return {};
  }
}

module.exports = { fetchCurrentWeatherData };