async function loadWeather(lat, lon) {
    const res = await fetch(`https://clima-seguro-backend.onrender.com/api/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    document.getElementById("weather-box").classList.remove("hidden");

    document.getElementById("city-name").innerText = data.city;

    document.getElementById("weather-icon").src =
        `https://raw.githubusercontent.com/open-meteo/open-meteo/main/icons/${data.icon}.png`;

    document.getElementById("temp").innerText =
        `🌡 Temperatura: ${Math.round(data.temp)}°C`;

    document.getElementById("desc").innerText =
        data.description;

    document.getElementById("humidity").innerText =
        `💧 Umidade: ${data.humidity}%`;

    document.getElementById("wind").innerText =
        `🌬 Vento: ${data.wind} km/h`;
}
