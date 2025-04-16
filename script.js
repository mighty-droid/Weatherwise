const apiKey = '10f25963b6261194e2f66ac8252d8b2f';

document.getElementById('weatherForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const city = document.getElementById('cityInput').value;
  const resultDiv = document.getElementById('weatherResult');
  resultDiv.innerHTML = 'Loading...';

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    resultDiv.innerHTML = `
      <h2>${data.name}</h2>
      <p><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}"></p>
      <p>${temp}°C - ${description}</p>
    `;

    setWeatherBackground(description.toLowerCase());

    // Get the 5-day forecast
    await getFiveDayForecast(city);
  } catch (err) {
    resultDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});

function setWeatherBackground(condition) {
  const videoElement = document.getElementById('backgroundVideo');
  let videoUrl = '';

  if (condition.includes("cloud")) {
    videoUrl = "videos/cloud.mp4";
  } else if (condition.includes("rain")) {
    videoUrl = "videos/rain.mp4";
  } else if (condition.includes("clear")) {
    videoUrl = "videos/clear.mp4";
  } else if (condition.includes("snow")) {
    videoUrl = "videos/snow.mp4";
  } else if (condition.includes("storm")) {
    videoUrl = "videos/storm.mp4";
  } else {
    videoUrl = "videos/clear.mp4"; // fallback
  }

  videoElement.src = videoUrl;
  videoElement.load();
  videoElement.play();
}

async function getFiveDayForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) throw new Error('Unable to fetch 5-day forecast');

  const data = await response.json();
  const forecastDiv = document.createElement('div');
  forecastDiv.classList.add('forecast-container');

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(item => {
    const date = new Date(item.dt_txt);
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    const icon = item.weather[0].icon;
    const temp = Math.round(item.main.temp);
    const desc = item.weather[0].description;

    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <p>${day}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
      <p>${temp}°C</p>
      <p class="desc">${desc}</p>
    `;
    forecastDiv.appendChild(card);
  });

  document.getElementById('weatherResult').appendChild(forecastDiv);
}
