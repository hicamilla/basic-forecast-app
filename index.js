const API_KEY = 'f787950325ae58fcbb27a7382f835047';

// Toggle dark/light mode
document.querySelector('.theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Handle search form submit
document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const city = document.getElementById('search-form-input').value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Fetch weather data from OpenWeatherMap
function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  axios.get(url)
    .then(response => {
      document.getElementById('error-message').textContent = ''; // Clear error
      displayCurrentWeather(response.data);
      displayWeeklyForecast(response.data);
    })
    .catch(error => {
      console.error(error);
      const errorEl = document.getElementById('error-message');
      errorEl.textContent = 'City not found. Please try again.';
      
      errorEl.hidden = false;
  // Auto-hide after 3 seconds
  setTimeout(() => {
    errorEl.hidden = true;
  }, 3000);
});
}

// Display current weather
function displayCurrentWeather(data) {
  const cityName = data.city.name;
  const weather = data.list[0];
  const icon = weather.weather[0].icon;
  const description = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const wind = Math.round(weather.wind.speed);
  const humidity = weather.main.humidity;
  const timestamp = weather.dt;
  const time = new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  document.querySelector('.forecast-city').textContent = cityName;
  document.querySelector('.temperature-now').textContent = temp;
  document.querySelector('#wind-speed').textContent = `${wind} km/h`;
  document.querySelector('#humidity').textContent = `${humidity}%`;
  document.querySelector('#description').textContent = description;
  document.querySelector('#time').textContent = time;
  document.querySelector('#icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />`;
}

// Display 5-day forecast
function displayWeeklyForecast(data) {
  const forecastContainer = document.getElementById('weekly-forecast');
  forecastContainer.innerHTML = '';

  const grouped = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!grouped[day]) {
      grouped[day] = {
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon
      };
    } else {
      grouped[day].min = Math.min(grouped[day].min, item.main.temp_min);
      grouped[day].max = Math.max(grouped[day].max, item.main.temp_max);
    }
  });

  Object.entries(grouped).slice(0, 5).forEach(([day, info]) => {
    forecastContainer.innerHTML += `
      <div class="forecast-day">
        <h3>${day}</h3>
        <img src="https://openweathermap.org/img/wn/${info.icon}@2x.png" alt="icon" />
        <p><strong>${Math.round(info.max)}°</strong> / ${Math.round(info.min)}°</p>
      </div>
    `;
  });
}

// Load default city when page loads
window.addEventListener('DOMContentLoaded', () => {
  const defaultCity = 'London';
  fetchWeather(defaultCity);
  document.getElementById('search-form-input').value = defaultCity;
});