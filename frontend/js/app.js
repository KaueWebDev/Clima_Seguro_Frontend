const API_BASE = "https://clima-seguro-backend.onrender.com";

const weatherBox = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast-container");

// Inicializa mapa
const map = L.map("map").setView([-14.2350, -51.9253], 4); // Brasil
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker = null;

// Torna a função global
window.loadWeather = async function(lat, lon, name, country) {
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data = await res.json();

        if (data.error) {
            weatherBox.classList.remove("hidden");
            weatherBox.innerHTML = `<p>Erro: ${data.error}</p>`;
            return;
        }

        weatherBox.classList.remove("hidden");
        document.getElementById("city-name").innerText = `${data.city} (${data.country || '??'})`;

        const flagEl = document.getElementById("flag");
        if (data.flag) {
            flagEl.src = data.flag;
            flagEl.style.display = "block";
        } else {
            flagEl.style.display = "none";
        }

        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // Atualiza mapa
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lon]).addTo(map).bindPopup(`${name}, ${country}`).openPopup();
        map.setView([lat, lon], 10);

        // Carrega previsão
        loadForecast(lat, lon);

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
        weatherBox.classList.remove("hidden");
        weatherBox.innerHTML = "<p>Erro ao carregar o clima</p>";
    }
};

async function loadForecast(lat, lon) {
    try {
        const res = await fetch(`${API_BASE}/api/forecast?lat=${lat}&lon=${lon}`);
        const data = await res.json();

        if (data.error) {
            forecastContainer.innerHTML = `<p>Erro ao obter previsão</p>`;
            return;
        }

        renderForecast(data);
    } catch (err) {
        forecastContainer.innerHTML = `<p>Erro ao obter previsão</p>`;
    }
}

function renderForecast(data) {
    forecastContainer.innerHTML = "";

    for (let i = 0; i < data.time.length; i++) {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <h3>${data.time[i]}</h3>
            <p>Máx: ${Math.round(data.tmax[i])}°C</p>
            <p>Mín: ${Math.round(data.tmin[i])}°C</p>
            <p>${mapWeatherCode(data.wcode[i])}</p>
        `;
        forecastContainer.appendChild(card);
    }
}

function mapWeatherCode(code) {
    const map = {
        0: "☀ Limpo", 1: "🌤 Poucas nuvens", 2: "⛅ Parcialmente nublado", 3: "☁ Nublado",
        45: "🌫 Nevoeiro", 48: "🌫 Nevoeiro", 51: "🌦 Chuvisco leve", 61: "🌧 Chuva fraca",
        63: "🌧 Chuva moderada", 65: "🌧🌧 Chuva forte", 80: "🌦 Pancadas leves",
        81: "🌧 Pancadas moderadas", 82: "🌧🌧 Pancadas fortes"
    };
    return map[code] || "Indefinido";
}
