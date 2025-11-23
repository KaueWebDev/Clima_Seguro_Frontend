const API_BASE = "https://clima-seguro-backend.onrender.com"; 

// Mapeamento weather codes (descrição curta)
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
        // busca dados atuais
        const res = await fetch(`${API_BASE}/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(countryCode)}`);
        const data = await res.json();

        if (data.error) {
            weatherBox.classList.remove("hidden");
            weatherBox.innerHTML = `<p>Erro: ${data.error}</p>`;
            return;
        }

        weatherBox.classList.remove("hidden");

        // City already formatted by backend? if name param is formatted, show it; else show backend city
        const displayCity = name && name.trim() ? name : (data.city || "Local Desconhecido");
        document.getElementById("city-name").textContent = displayCity;

        // Flag: backend may provide 'flag' (via utils.flags), else use flagcdn fallback when countryCode available
        const flagEl = document.getElementById("flag");
        if (data.flag && data.flag.startsWith("http")) {
            flagEl.src = data.flag;
        } else if (countryCode && countryCode.length === 2) {
            // flagcdn uses lower-case country code paths or two-letter codes: https://flagcdn.com/w40/br.png
            flagEl.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
        } else {
            flagEl.src = ""; // remove src if unknown
            flagEl.alt = "";
        }

        document.getElementById("desc").textContent = data.description || "";
        document.getElementById("temp").textContent = `🌡 Temperatura: ${Math.round(data.temp ?? 0)}°C`;
        document.getElementById("humidity").textContent = `💧 Umidade: ${data.humidity ?? "--"}%`;
        document.getElementById("wind").textContent = `🌬 Vento: ${data.wind ?? "--"} km/h`;

        // Carregar a previsão separada
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

function renderForecast(data) {
    const container = document.getElementById("forecast-container");
    if (!container) return;

    container.innerHTML = "";

    // Exibir próximos 6 dias, pulando o índice 0 (hoje) para não duplicar o current
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

function formatDateShort(dateString) {
    try {
        const d = new Date(dateString);
        return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
    } catch {
        return dateString;
    }
}
