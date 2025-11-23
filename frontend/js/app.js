const API_BASE = "https://clima-seguro-backend.onrender.com";

// Inicializa mapa Leaflet
let map = null;
let marker = null;

function initMap(defaultLat = -9.6658, defaultLon = -35.7353, zoom = 6, tile = "osm") {
    if (!document.getElementById("map")) return;

    if (map) {
        map.setView([defaultLat, defaultLon], zoom);
        return;
    }

    map = L.map("map", { zoomControl: true }).setView([defaultLat, defaultLon], zoom);

    // Tile layer OpenStreetMap padrão
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

function updateMap(lat, lon) {
    if (!map) return;
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) return;

    map.setView([latNum, lonNum], 11);

    if (marker) {
        marker.setLatLng([latNum, lonNum]);
    } else {
        marker = L.marker([latNum, lonNum]).addTo(map);
    }
}

// Map is initialized on DOMContentLoaded with default view (always visible)
document.addEventListener("DOMContentLoaded", () => {
    initMap();
});


// Weather functions
function mapWeatherCode(code) {
    const map = {
        0: "☀ Limpo",
        1: "🌤 Poucas nuvens",
        2: "⛅ Parcialmente nublado",
        3: "☁ Nublado",
        45: "🌫 Nevoeiro",
        48: "🌫 Nevoeiro",
        51: "🌦 Chuvisco leve",
        53: "🌦 Chuvisco moderado",
        55: "🌧 Chuvisco forte",
        61: "🌧 Chuva fraca",
        63: "🌧 Chuva moderada",
        65: "🌧🌧 Chuva forte",
        80: "🌦 Pancadas leves",
        81: "🌧 Pancadas moderadas",
        82: "🌧🌧 Pancadas fortes",
        95: "⛈ Tempestade"
    };
    return map[code] || "Indefinido";
}

async function loadWeather(lat, lon, name, countryCode) {
    const weatherBox = document.getElementById("weather");
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(countryCode)}`);
        const data = await res.json();

        if (data.error) {
            weatherBox.classList.remove("hidden");
            weatherBox.innerHTML = `<p>Erro: ${data.error}</p>`;
            return;
        }

        weatherBox.classList.remove("hidden");

        const displayCity = name && name.trim() ? name : (data.city || "Local Desconhecido");
        document.getElementById("city-name").textContent = displayCity;

        // Bandeira: preferência flag do backend, senão fallback flagcdn se countryCode válido
        const flagEl = document.getElementById("flag");
        if (data.flag && typeof data.flag === "string" && data.flag.startsWith("http")) {
            flagEl.src = data.flag;
            flagEl.style.display = "";
        } else if (countryCode && countryCode.length === 2) {
            flagEl.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
            flagEl.style.display = "";
        } else {
            flagEl.src = "";
            flagEl.style.display = "none";
        }

        document.getElementById("desc").textContent = data.description || "";
        document.getElementById("temp").textContent = `🌡 Temperatura: ${Math.round(data.temp ?? 0)}°C`;
        document.getElementById("humidity").textContent = `💧 Umidade: ${data.humidity ?? "--"}%`;
        document.getElementById("wind").textContent = `🌬 Vento: ${data.wind ?? "--"} km/h`;

        // Atualiza mapa
        updateMap(lat, lon);

        // Carrega forecast
        loadForecast(lat, lon);

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
        weatherBox.classList.remove("hidden");
        weatherBox.innerHTML = "<p>Erro ao carregar o clima</p>";
    }
}

async function loadForecast(lat, lon) {
    try {
        const res = await fetch(`${API_BASE}/api/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
        const data = await res.json();

        if (data.error) {
            console.error("Erro no forecast:", data.error);
            return;
        }

        renderForecast(data);
    } catch (err) {
        console.error("Erro ao obter previsão:", err);
    }
}

function formatDateShort(dateString) {
    try {
        const d = new Date(dateString);
        return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
    } catch {
        return dateString;
    }
}

function renderForecast(data) {
    const container = document.getElementById("forecast-container");
    if (!container) return;

    container.innerHTML = "";

    const startIndex = 1;
    const daysToShow = 6;
    const maxIndex = Math.min(data.time.length, startIndex + daysToShow);

    for (let i = startIndex; i < maxIndex; i++) {
        const dateStr = data.time[i];
        const tmax = data.tmax[i];
        const tmin = data.tmin[i];
        const wcode = data.wcode[i];

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${formatDateShort(dateStr)}</h3>
            <p>Máx: <strong>${Math.round(tmax)}°C</strong></p>
            <p>Mín: ${Math.round(tmin)}°C</p>
            <p>${mapWeatherCode(wcode)}</p>
        `;

        container.appendChild(card);
    }
}
