const weatherBox = document.getElementById("weather");

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
        document.getElementById("flag").src = data.flag || "";
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // 🔥 NOVO: Carregar previsão dos próximos dias
        loadForecast(lat, lon);

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
        weatherBox.classList.remove("hidden");
        weatherBox.innerHTML = "<p>Erro ao carregar o clima</p>";
    }
}


// 🔥 NOVA FUNÇÃO: BUSCAR PREVISÃO OPEN-METEO
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


// 🔥 NOVA FUNÇÃO: MOSTRAR PREVISÃO NA TELA
function renderForecast(data) {
    const container = document.getElementById("forecast-container");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < data.time.length; i++) {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <p class="f-date">${data.time[i]}</p>
            <p>Máx: ${Math.round(data.tmax[i])}°C</p>
            <p>Mín: ${Math.round(data.tmin[i])}°C</p>
            <p>${mapWeatherCode(data.wcode[i])}</p>
        `;

        container.appendChild(card);
    }
}


// 🔥 MAPEAMENTO DE WEATHER CODES
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
