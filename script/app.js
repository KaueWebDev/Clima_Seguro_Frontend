async function loadWeather(lat, lon) {
    const res = await fetch(`${API_BACKEND}/api/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    document.getElementById("weather-box").classList.remove("hidden");
    document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
    document.getElementById("flag").src = data.flag;
    document.getElementById("weather-icon").src = data.icon;
    document.getElementById("temp").innerText = `🌡 Temperatura: ${data.temp}°C`;
    document.getElementById("desc").innerText = data.description;
    document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
    document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;
}
