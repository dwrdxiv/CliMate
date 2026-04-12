// CONFIGURACIÓN INICIAL
const API_KEY = '8b59c90d8c13b221e8735bd721a2cc72'; // Pega aquí tu clave entre las comillas
const DEFAULT_CITY = 'Caracas';

/**
 * Función Principal: Orquesta los 3 niveles de ubicación
 */
async function initApp() {
    console.log("Iniciando búsqueda de ubicación...");

    // NIVEL 1: Intentar Geolocalización del Navegador
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Nivel 1: Ubicación por GPS detectada.");
                const weatherData = await fetchWeatherByCoords(latitude, longitude);
                updateMainCard(weatherData);
            },
            async (error) => {
                console.warn("Nivel 1 falló (Permiso denegado o error). Pasando a Nivel 2...");
                await startLevel2();
            }
        );
    } else {
        await startLevel2();
    }
}

/**
 * NIVEL 2: Intentar Geolocalización por IP (Silencioso)
 */
async function startLevel2() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.latitude && data.longitude) {
            console.log(`Nivel 2: Ubicación por IP detectada en ${data.city}.`);
            const weatherData = await fetchWeatherByCoords(data.latitude, data.longitude);
            updateMainCard(weatherData);
        } else {
            throw new Error("Datos de IP incompletos");
        }
    } catch (err) {
        console.warn("Nivel 2 falló. Pasando a Nivel 3 (Default)...");
        startLevel3();
    }
}

/**
 * NIVEL 3: Ciudad por defecto
 */
async function startLevel3() {
    console.log(`Nivel 3: Cargando ciudad por defecto (${DEFAULT_CITY}).`);
    const weatherData = await fetchWeatherByName(DEFAULT_CITY);
    updateMainCard(weatherData);
}

// --- FUNCIONES DE LLAMADA A API (FETCH) ---

async function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
    const res = await fetch(url);
    return await res.json();
}

async function fetchWeatherByName(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
    const res = await fetch(url);
    return await res.json();
}

/**
 * ACTUALIZAR LA INTERFAZ (DOM)
 */
function updateMainCard(data) {
    if (!data || data.cod !== 200) return;

    // Seleccionamos los elementos que creamos en el HTML anterior
    const cityNameEl = document.querySelector('.city-name');
    const tempNumberEl = document.querySelector('.temp-number');
    
    // Actualizamos el texto
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    tempNumberEl.textContent = Math.round(data.main.temp);

    // Aquí podrías añadir lógica para cambiar los datos extra (Humedad, Viento)
    // Ejemplo:
    // document.querySelector('.info-box:nth-child(1)').textContent = `Humedad: ${data.main.humidity}%`;
    
    console.log("¡Interfaz actualizada con éxito!");
}

// Arrancar la app
initApp();