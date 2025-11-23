const API_BASE = "https://clima-seguro-backend.onrender.com";

async function loadWeather(lat, lon, name, country) {
    const weatherBox = document.getElementById("weather");

    try {
        const res = await fetch(
            `${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`
        );

        const data = await res.json();

        if (data.error) {
            weatherBox.classList.remove("hidden");
            weatherBox.innerHTML = `<p>Erro: ${data.error}</p>`;
            return;
        }

        weatherBox.classList.remove("hidden");

        document.getElementById("city-name").innerText = `${data.city}`;
        document.getElementById("flag").src = data.flag || "";
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
        weatherBox.innerHTML = `<p>Erro ao carregar clima</p>`;
    }
}
