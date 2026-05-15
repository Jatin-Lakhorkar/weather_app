//WEATHER APP

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const spinner = document.querySelector(".spinner");
const clearBtn = document.querySelector(".clearBtn");
const unitToggle = document.querySelector(".unitToggle");

let isCelsius = true;
let currentWeatherData = null;

// Toggle between Celsius and Fahrenheit - refreshes display with new unit
unitToggle.addEventListener("click", () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? "°C | °F" : "°F | °C";
    if (currentWeatherData) {
        displayWeatherInfo(currentWeatherData);
    }
});


// Handle weather search - fetch data and display results or error
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            showSpinner();
            const weatherData = await getWeatherData(city);
            currentWeatherData = weatherData;
            displayWeatherInfo(weatherData);
            cityInput.value = "";
        } catch (error) {
            console.error(error);
            displayError(error.message || "Could not fetch weather data");
        }
    }
    else {
        displayError("Please enter a city");
    }
});

clearBtn.addEventListener("click", () => {
    card.style.display = "none";
    cityInput.value = "";
    spinner.style.display = "none";
    currentWeatherData = null;
});


function showSpinner() {
    spinner.style.display = "block";
    card.style.display = "none";
}

function hideSpinner() {
    spinner.style.display = "none";
}

async function getWeatherData(city) {
    const apiUrl = `/api/weather?city=${encodeURIComponent(city)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not Fetch weather data")
    }
    return await response.json();
}
// Parse weather data, convert temperatures from Kelvin, and render weather card
function displayWeatherInfo(data) {
    const { name: city,
        main: { temp, feels_like, humidity, pressure },
        weather: [{ description, main, icon }],
        wind: { speed } } = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    cityDisplay.textContent = city;

    const weatherEmoji = document.createElement("img");
    weatherEmoji.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherEmoji.classList.add("weatherEmoji");

    // Convert API temperature from Kelvin to Celsius and Fahrenheit
    const tempC = (temp - 273.15).toFixed(1);
    const feelsLikeC = (feels_like - 273.15).toFixed(1);
    const windSpeedKmh = (speed * 3.6).toFixed(1);

    const tempF = (tempC * 9 / 5 + 32).toFixed(1);
    const feelsLikeF = (feelsLikeC * 9 / 5 + 32).toFixed(1);

    // Display temperature in selected unit
    const tempDisplay = document.createElement("p");
    tempDisplay.textContent = isCelsius ? `${tempC}°C` : `${tempF}°F`;
    tempDisplay.classList.add("tempDisplay");

    const descDisplay = document.createElement("p");
    descDisplay.textContent = description;
    descDisplay.classList.add("descDisplay");

    const weatherInfo = document.createElement("div");
    weatherInfo.classList.add("weatherInfo");

    // Build weather details box (feels like, humidity, wind, pressure)
    const feelsLikeTemp = isCelsius ? feelsLikeC : feelsLikeF;
    const feelsLikeBox = createInfoBox("Feels Like", `${feelsLikeTemp}${isCelsius ? "°C" : "°F"}`);
    const humidityBox = createInfoBox("Humidity", `${humidity}%`);
    const windBox = createInfoBox("Wind Speed", `${windSpeedKmh} km/h`);
    const pressureBox = createInfoBox("Pressure", `${pressure} hPa`);

    weatherInfo.appendChild(feelsLikeBox);
    weatherInfo.appendChild(humidityBox);
    weatherInfo.appendChild(windBox);
    weatherInfo.appendChild(pressureBox);

    card.appendChild(cityDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(tempDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherInfo);

    // Apply background style based on weather condition
    setCardBackground(main);
    hideSpinner();
}

function createInfoBox(label, value) {
    const box = document.createElement("div");
    box.classList.add("infoBox");

    const labelEl = document.createElement("div");
    labelEl.classList.add("infoLabel");
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.classList.add("infoValue");
    valueEl.textContent = value;

    box.appendChild(labelEl);
    box.appendChild(valueEl);
    return box;
}

// Apply dynamic background styling based on weather condition
function setCardBackground(weatherMain) {
    card.classList.remove("sunny", "cloudy", "rainy", "snowy");

    if (weatherMain.includes("Clear") || weatherMain.includes("Sunny")) {
        card.classList.add("sunny");
    } else if (weatherMain.includes("Cloud")) {
        card.classList.add("cloudy");
    } else if (weatherMain.includes("Rain") || weatherMain.includes("Drizzle")) {
        card.classList.add("rainy");
    } else if (weatherMain.includes("Snow")) {
        card.classList.add("snowy");
    }
}

// Display error message to user
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
    hideSpinner();
}