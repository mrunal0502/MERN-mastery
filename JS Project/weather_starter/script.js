document.addEventListener("DOMContentLoaded", () => {
  let cityInput = document.getElementById("city-input");
  let weatherBtn = document.getElementById("get-weather-btn");
  let weatherInfo = document.getElementById("weather-info");
  let cityNameDisplay = document.getElementById("city-name");
  let temperature = document.getElementById("temperature");
  let description = document.getElementById("description");
  let err = document.getElementById("error-message");

  weatherBtn.addEventListener("click", async () => {
    let city = cityInput.value.trim();
    if (city === "" || city == null) return;

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric `
    );
    if (!response.ok) {
      throw new Error("City not found");
    }

    const jsonData = await response.json();

    return jsonData;
  }

  function displayWeatherData(data) {
    console.log(data);
    const { name, main, weather } = data;

    weatherInfo.classList.remove("hidden");
    err.classList.add("hidden");
    T;
  }

  function showError() {
    weatherInfo.classList.add("hidden");
    err.classList.remove("hidden");
  }
});
