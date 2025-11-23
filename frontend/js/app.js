let map = L.map('map').setView([-15.793889, -47.882778], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function loadWeather(lat, lon, name, country) {
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data = await res.json();
        if (data.error) return;

        document.getElementById("weather").classList.remove("hidden");
        document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
        const flagImg = document.getElementById("flag");
        if (data.flag) { flagImg.src = data.flag; flagImg.style.display = "inline-block"; }
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        loadForecast(lat, lon);

        // Atualiza mapa
        map.setView([lat, lon], 10);
        L.marker([lat, lon]).addTo(map);

        // Histórico
        addToHistory(data.city, "", data.country);
    } catch (err) {
        console.error(err);
    }
}

async function loadForecast(lat, lon) {
    try {
        const res = await fetch(`${API_BASE}/api/forecast?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        renderForecast(data);
    } catch (err) {
        console.error(err);
    }
}

function renderForecast(data) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    if (!data.time) return;

    for (let i = 0; i < data.time.length; i++) {
        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = `
            <p>${data.time[i]}</p>
            <p>Máx: ${Math.round(data.tmax[i])}°C</p>
            <p>Mín: ${Math.round(data.tmin[i])}°C</p>
            <p>${mapWeatherCode(data.wcode[i])}</p>
        `;
        container.appendChild(card);
    }
}

function mapWeatherCode(code) {
    const map = {
        0: "☀ Limpo",
        1: "🌤 Poucas nuvens",
        2: "⛅ Parcialmente nublado",
        3: "☁ Nublado",
        45: "🌫 Nevoeiro",
        48: "🌫 Nevoeiro",
        51: "🌦 Chuvisco leve",
        61: "🌧 Chuva fraca",
        63: "🌧 Chuva moderada",
        65: "🌧🌧 Chuva forte",
        80: "🌦 Pancadas leves",
        81: "🌧 Pancadas moderadas",
        82: "🌧🌧 Pancadas fortes"
    };
    return map[code] || "Indefinido";
}
