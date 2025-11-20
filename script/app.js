async function loadWeather(lat, lon) {
    const res = await fetch(`${API_BACKEND}/api/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    document.getElementById("weather-box").classList.remove("hidden");

    document.getElementById("city-name").innerText =
        `${data.city} (${data.country})`;

    document.getElementById("flag").src = data.flag;

    // AQUI ESTAVA O ERRO — agora usando URL do OpenWeather
    document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

    document.getElementById("temp").innerText =
        `🌡 Temperatura: ${Math.round(data.temp)}°C`;

    document.getElementById("desc").innerText = data.description;

    document.getElementById("humidity").innerText =
        `💧 Umidade: ${data.humidity}%`;

    document.getElementById("wind").innerText =
        `🌬 Vento: ${data.wind} km/h`;
}
