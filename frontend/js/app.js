const API_BASE = "https://clima-seguro-backend.onrender.com"; 
const weatherBox = document.getElementById("weather");
let map;

// Inicializa o mapa
function initMap() {
    map = L.map('map').setView([-9.66599, -35.735], 10); // Maceió padrão
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

initMap();

async function loadWeather(lat, lon, name, country) {
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data = await res.json();

        if (data.error) {
            weatherBox.classList.remove("hidden");
            weatherBox.innerHTML = `<p>Erro: ${data.error}</p>`;
            return;
        }

        weatherBox.classList.remove("hidden");
        document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
        if(data.flag){
            const flagEl = document.getElementById("flag");
            flagEl.src = data.flag;
            flagEl.style.display = "block";
        }
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // Atualiza o mapa
        updateMap(lat, lon, data.city);

        // Carregar previsão
        loadForecast(lat, lon);

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
        weatherBox.classList.remove("hidden");
        weatherBox.innerHTML = "<p>Erro ao carregar o clima</p>";
    }
}

function updateMap(lat, lon, city) {
    map.setView([lat, lon], 12);
    L.marker([lat, lon]).addTo(map)
        .bindPopup(city)
        .openPopup();
}

async function loadForecast(lat, lon) {
    try {
        const res = await fetch(`${API_BASE}/api/forecast?lat=${lat}&lon=${lon}`);
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

function renderForecast(data) {
    const container = document.getElementById("forecast-container");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < data.time.length; i++) {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <h3>${data.time[i]}</h3>
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
