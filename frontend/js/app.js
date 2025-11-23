const API_BASE = "https://clima-seguro-backend.onrender.com";

// MAPA
let map = L.map('map').setView([-9.66599, -35.735], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
let marker = null;

function updateMap(lat, lon, cityName) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (marker) map.removeLayer(marker);
    marker = L.marker([latNum, lonNum]).addTo(map).bindPopup(cityName).openPopup();
    map.setView([latNum, lonNum], 10);
}

// ===================== WEATHER =====================
async function loadWeather(lat, lon, name, country) {
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data = await res.json();

        if (data.error) return;

        document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
        const flagEl = document.getElementById("flag");
        if (data.flag) {
            flagEl.src = data.flag;
            flagEl.style.display = "inline-block";
        } else flagEl.style.display = "none";

        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        document.getElementById("weather").classList.remove("hidden");

        loadForecast(lat, lon);
        updateMap(lat, lon, data.city);
    } catch (err) {
        console.error(err);
    }
}

// ===================== FORECAST =====================
async function loadForecast(lat, lon) {
    try {
        const res = await fetch(`${API_BASE}/api/forecast?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (data.error) return;
        renderForecast(data);
    } catch (err) {
        console.error(err);
    }
}

function renderForecast(data) {
    const container = document.getElementById("forecast-container");
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
        0:"☀ Limpo",1:"🌤 Poucas nuvens",2:"⛅ Parcialmente nublado",3:"☁ Nublado",
        45:"🌫 Nevoeiro",48:"🌫 Nevoeiro",51:"🌦 Chuvisco leve",
        61:"🌧 Chuva fraca",63:"🌧 Chuva moderada",65:"🌧🌧 Chuva forte",
        80:"🌦 Pancadas leves",81:"🌧 Pancadas moderadas",82:"🌧🌧 Pancadas fortes"
    };
    return map[code] || "Indefinido";
}
