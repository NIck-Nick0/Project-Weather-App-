const API_KEY = 'XJBP6FZ4DHJJZMQAP9B9QFKVH'; // ضع مفتاحك هنا

// -------------------------------------------------------------
// 1. Weather API Function (Hits API and fetches raw data)
// -------------------------------------------------------------
async function fetchWeatherData(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=${API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Location not found or API error.');
  }
  return await response.json();
}

// -------------------------------------------------------------
// 2. Data Processing Function (Extracts only required properties)
// -------------------------------------------------------------
function processWeatherData(rawData) {
  const today = rawData.days[0];
  
  return {
    city: rawData.resolvedAddress,
    condition: today.conditions,
    tempF: today.temp,
    tempC: parseFloat((((today.temp - 32) * 5) / 9).toFixed(1)),
    maxF: today.tempmax,
    maxC: parseFloat((((today.tempmax - 32) * 5) / 9).toFixed(1)),
    minF: today.tempmin,
    minC: parseFloat((((today.tempmin - 32) * 5) / 9).toFixed(1)),
    humidity: today.humidity,
  };
}

// -------------------------------------------------------------
// 3. UI Controller & DOM Manipulation
// -------------------------------------------------------------
let currentProcessedData = null;
let currentUnit = 'C'; // 'C' or 'F'

const form = document.querySelector('#search-form');
const input = document.querySelector('#location-input');
const loadingDiv = document.querySelector('#loading');
const weatherDisplay = document.querySelector('#weather-display');

const cityNameEl = document.querySelector('#city-name');
const conditionEl = document.querySelector('#condition');
const tempValueEl = document.querySelector('#temp-value');
const unitToggleBtn = document.querySelector('#unit-toggle');
const humidityEl = document.querySelector('#humidity');
const tempMaxEl = document.querySelector('#temp-max');
const tempMinEl = document.querySelector('#temp-min');

function renderWeather() {
  if (!currentProcessedData) return;

  const isCelsius = currentUnit === 'C';
  
  cityNameEl.textContent = currentProcessedData.city;
  conditionEl.textContent = currentProcessedData.condition;
  humidityEl.textContent = currentProcessedData.humidity;

  if (isCelsius) {
    tempValueEl.textContent = `${currentProcessedData.tempC}°`;
    tempMaxEl.textContent = `${currentProcessedData.maxC}°C`;
    tempMinEl.textContent = `${currentProcessedData.minC}°C`;
    unitToggleBtn.textContent = '°C (Switch to °F)';
  } else {
    tempValueEl.textContent = `${currentProcessedData.tempF}°`;
    tempMaxEl.textContent = `${currentProcessedData.maxF}°F`;
    tempMinEl.textContent = `${currentProcessedData.minF}°F`;
    unitToggleBtn.textContent = '°F (Switch to °C)';
  }

  weatherDisplay.classList.remove('hidden');
}

// -------------------------------------------------------------
// 4. Event Listeners & Flow Control
// -------------------------------------------------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = input.value.trim();
  if (!location) return;

  // Show Loading UI
  loadingDiv.classList.remove('hidden');
  weatherDisplay.classList.add('hidden');

  try {
    const rawData = await fetchWeatherData(location);
    currentProcessedData = processWeatherData(rawData);
    
    // Console log as requested by project requirement
    console.log('Processed Weather Object:', currentProcessedData);
    
    renderWeather();
  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  } finally {
    // Hide Loading UI
    loadingDiv.classList.add('hidden');
  }
});

unitToggleBtn.addEventListener('click', () => {
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  renderWeather();
});