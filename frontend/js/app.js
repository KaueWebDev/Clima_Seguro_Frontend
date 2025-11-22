const weatherBox = document.getElementById("weather");

async function loadWeather(lat, lon, name, country) {
    const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
    const data = await res.json();

    weatherBox.style.display = "block";
    document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
    document.getElementById("flag").src = data.flag || "";
    document.getElementById("desc").innerText = data.description || "";
    document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
    document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
    document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;
}
