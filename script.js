let isCelsius = true;
let isDarkMode = false;
const history = [];

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return;

    addToHistory(city);

    // Fetching weather data from wttr.in (without API key)
    const url = `https://wttr.in/${city}?format=j1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateWeather(data);
            getForecast(data.nearest_area[0].latitude, data.nearest_area[0].longitude);
        })
        .catch(err => alert("Unable to fetch weather data"));
}

function updateWeather(data) {
    const city = data.nearest_area[0].areaName[0].value;
    const temperatureC = data.current_condition[0].temp_C;
    const description = data.current_condition[0].weatherDesc[0].value;
    const weatherIcon = description.toLowerCase().includes("sunny") ? "sunny-icon.svg" : "rainy-icon.svg";




    document.getElementById("cityName").innerText = city;
    document.getElementById("temperature").innerText = isCelsius ? `${temperatureC}°C` : `${convertToFahrenheit(temperatureC)}°F`;
    document.getElementById("description").innerText = description;
    document.getElementById("weatherIcon").src = weatherIcon;
}

function getForecast(lat, lon) {
    const forecastUrl = `https://wttr.in/${lat},${lon}?format=j1`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecast = data.weather;
            let forecastHTML = '';
            forecast.forEach(day => {
                forecastHTML += `
                    <div>
                        <p>${day.date}</p>
                        <p>${day.maxtempC}°C / ${day.mintempC}°C</p>
                        <p>${day.weatherDesc[0].value}</p>
                    </div>
                `;
            });
            document.getElementById("forecast").innerHTML = forecastHTML;
        });
}

function toggleUnit() {
    isCelsius = !isCelsius;
    const temperature = parseInt(document.getElementById("temperature").innerText);
    document.getElementById("temperature").innerText = isCelsius ? `${temperature}°C` : `${convertToFahrenheit(temperature)}°F`;
    document.getElementById("unitToggle").innerText = isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius";
}

function convertToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function addToHistory(city) {
    history.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    updateHistoryUI();
}

function updateHistoryUI() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    history.forEach(city => {
        const listItem = document.createElement("li");
        listItem.innerText = city;
        listItem.onclick = () => getWeatherForHistory(city);
        historyList.appendChild(listItem);
    });
}

function getWeatherForHistory(city) {
    document.getElementById("cityInput").value = city;
    getWeather();
}

function toggleMode() {
    if (isDarkMode) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
    }
    isDarkMode = !isDarkMode;
}

function shareWeather() {
    const weatherInfo = `Current weather in ${document.getElementById("cityName").innerText}: ${document.getElementById("temperature").innerText}, ${document.getElementById("description").innerText}`;
    if (navigator.share) {
        navigator.share({
            title: 'Weather Info',
            text: weatherInfo,
            url: window.location.href,
        }).catch(err => console.error("Share failed:", err));
    } else {
        alert("Share not supported in this browser.");
    }
}

// On page load, load search history
document.addEventListener("DOMContentLoaded", () => {
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    savedHistory.forEach(city => {
        history.push(city);
    });
    updateHistoryUI();
});
