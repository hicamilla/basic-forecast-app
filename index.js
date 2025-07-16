const API_KEY = 'f787950325ae58fcbb27a7382f835047';

// Toggle Theme
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Search Bar
const form = document.getElementById('search-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const city = document.getElementById('search-form-input').value.trim();
  if (city) {
    fetchWeather(city);
    form.reset();
  }
});

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  //Loading state
  document.getElementById('city').textContent = 'Loading...';

  axios.get(url)
    .then(response => {
      updateCurrentWeather(response.data);
      updateWeeklyForecast(response.data);
    })
    .catch(() => {
      alert('City not found. Try again!');
    });
}

function updateCurrentWeather(data) {
  const weather = data.list[0];

  document.getElementById('city').textContent = data.city.name;
  document.getElementById('description').textContent = weather.weather[0].description;
  document.getElementById('wind-speed').textContent = `${Math.round(weather.wind.speed)} km/h`;
  document.getElementById('humidity').textContent = `${weather.main.humidity}%`;
  document.getElementById('icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="weather icon">`;
  document.querySelector('.weather-now').textContent = Math.round(weather.main.temp);
}

function updateWeeklyForecast(data) {
  const forecastGrid = document.getElementById('weekly-temperature');
  forecastGrid.innerHTML = '';

  const dailyData = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-GB', {
      weekday: 'short'
    });

    if (!dailyData[day]) {
      dailyData[day] = {
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon
      };
    } else {
      dailyData[day].min = Math.min(dailyData[day].min, item.main.temp_min);
      dailyData[day].max = Math.max(dailyData[day].max, item.main.temp_max);
    }
  });

  Object.entries(dailyData).slice(0, 5).forEach(([day, info]) => {
    forecastGrid.innerHTML += `
      <div class="forecast-day">
        <h3>${day}</h3>
        <img src="https://openweathermap.org/img/wn/${info.icon}@2x.png" alt="">
        <p><strong>${Math.round(info.max)}°</strong> ${Math.round(info.min)}°</p>
      </div>
    `;
  });
}

//Load default weather for pre-defined city
window.addEventListener('DOMContentLoaded', () => {
  fetchWeather('Amsterdam'); 
})