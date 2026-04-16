import { useEffect, useState } from "react";
import WeatherBackground from "./components/WeatherBackground";
import MainCard from "./components/MainCard";
import "./App.css";
import SearchBar from "./components/SearchBar";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const DEFAULT_CITY = "Caracas";

function App() {
  const [weather, setWeather] = useState(null);
  // Dentro de tu componente principal App.jsx

  // --- FUNCIONES DE LLAMADA A API (FETCH) ---

  async function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
    const res = await fetch(url);

    const data = await res.json();
    if (data && data.cod === 200) {
      setWeather(data);
    }
  }
  async function fetchWeatherByName(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
    const res = await fetch(url);

    const data = await res.json();
    if (data && data.cod === 200) {
      setWeather(data);
    }
  }

  useEffect(() => {
    const initApp = async () => {
      // 1. Geolocation -> 2. IP -> 3. Default
      // NIVEL 1: Intentar Geolocalización del Navegador
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Nivel 1: Ubicación por GPS detectada.");
            fetchWeatherByCoords(latitude, longitude);
          },
          async (error) => {
            console.warn(
              "Nivel 1 falló (Permiso denegado o error). Pasando a Nivel 2...",
              error,
            );
            await startLevel2();
          },
        );
      } else {
        await startLevel2();
      }

      //NIVEL 2: Intentar Geolocalización por IP
      async function startLevel2() {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          if (data.latitude && data.longitude) {
            console.log(`Nivel 2: Ubicación por IP detectada en ${data.city}.`);
            fetchWeatherByCoords(data.latitude, data.longitude);
          } else {
            throw new Error("Datos de IP incompletos");
          }
        } catch (err) {
          console.warn("Nivel 2 falló. Pasando a Nivel 3 (Default)...", err);
          startLevel3();
        }
      }

      //NIVEL 3: Ciudad por defecto
      async function startLevel3() {
        console.log(`Nivel 3: Cargando ciudad por defecto (${DEFAULT_CITY}).`);
        fetchWeatherByName(DEFAULT_CITY);
      }


      
    };

    initApp();
  }, [])

  const handleSearch = async (cityName) => {
    try {
      fetchWeatherByName(cityName);
      console.log('Buscando clima para:', cityName)
    } catch (error) {
      console.error('Error en la busqueda', error)
    }
  };



  console.log("Estado actual del clima:", weather);
      return (
        <div className="app-container">
          <WeatherBackground condition={weather?.weather[0].main} />

          <div className="ui-wrapper">
            <SearchBar onSearch={handleSearch}/>

            <MainCard data={weather} />

            <footer className="popular-cities-tray">
              {/* Próximamente: tarjetas de ciudades populares */}
            </footer>

          </div>
        </div>
      );
};

export default App;
