const API_BASE = "https://clima-seguro-backend.onrender.com"; 

const searchInput = document.getElementById("search");
const autocompleteBox = document.getElementById("autocomplete-list");
const weatherBox = document.getElementById("weather");

// =========================
// FUNÇÃO PRINCIPAL: CARREGA O CLIMA
// =========================
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
        const flagEl = document.getElementById("flag");
        if (data.flag) {
            flagEl.src = data.flag;
            flagEl.style.display = "inline-block";
        } else {
            flagEl.style.display = "none";
        }
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // Carregar previsão dos próximos dias
        loadForecast(lat, lon);

        // Atualizar mapa
        updateMap(lat, lon, data.city);

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
        weatherBox.classList.remove("hidden");
        weatherBox.innerHTML = "<p>Erro ao carregar o clima</p>";
    }
}

// =========================
// FUNÇÃO: BUSCAR PREVISÃO OPEN-METEO
// =========================
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

// =========================
// FUNÇÃO: RENDERIZA PREVISÃO
// =========================
function renderForecast(data) {
    const container = document.getElementById("forecast-container");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < data.time.length; i++) {
        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <h3 class="f-date">${data.time[i]}</h3>
            <p>Máx: ${Math.round(data.tmax[i])}°C</p>
            <p>Mín: ${Math.round(data.tmin[i])}°C</p>
            <p>${mapWeatherCode(data.wcode[i])}</p>
        `;

        container.appendChild(card);
    }
}

// =========================
// FUNÇÃO: MAPEAR WEATHER CODES
// =========================
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

// =========================
// AUTOCOMPLETE
// =========================
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length < 2) {
        autocompleteBox.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        autocompleteBox.innerHTML = "";
        data.forEach(city => {
            const div = document.createElement("div");
            div.className = "option";
            div.textContent = `${city.name} (${city.country_code})`;

            div.addEventListener("click", () => {
                searchInput.value = city.name;
                autocompleteBox.innerHTML = "";
                loadWeather(city.lat, city.lon, city.name, city.country_code);
            });

            autocompleteBox.appendChild(div);
        });
    } catch (err) {
        console.error("Erro no autocomplete:", err);
        autocompleteBox.innerHTML = "<div class='option'>Erro ao buscar cidades</div>";
    }
});

// =========================
// MAPA LEAFLET
// =========================
let map = L.map('map').setView([-9.66599, -35.735], 5); // Posição inicial
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let marker = null;

function updateMap(lat, lon, cityName) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([latNum, lonNum]).addTo(map)
        .bindPopup(cityName)
        .openPopup();

    map.setView([latNum, lonNum], 10);
}
