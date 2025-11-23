const API_BASE = "https://clima-seguro-backend.onrender.com";

// Inicializa mapa
let map = L.map("map").setView([-15.78, -47.93], 4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
}).addTo(map);

let mapMarker = null;

// ===============================
// FUNÇÃO PARA CARREGAR O CLIMA
// ===============================

async function loadWeather(lat, lon, name, country) {
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

        // MOSTRA A BOX
        weather.classList.remove("hidden");

        // APLICA DADOS
        document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // BANDEIRA
        const flag = document.getElementById("flag");
        if (data.flag) {
            flag.src = data.flag;
            flag.style.display = "block";
        } else {
            flag.style.display = "none";
        }

        // ===============================
        // ATUALIZA O MAPA
        // ===============================
        if (mapMarker) {
            map.removeLayer(mapMarker);
        }

        mapMarker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 10);

        // ===============================
        // PREVISÃO DOS PRÓXIMOS DIAS
        // ===============================
        updateForecast(data.forecast || []);

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
    }
}

// ===============================
// FUNÇÃO PREVISÃO
// ===============================
function updateForecast(forecast) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    if (!forecast || forecast.length === 0) {
        container.innerHTML = "<p>Nenhuma previsão encontrada.</p>";
        return;
    }

    forecast.forEach(day => {
        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${day.date}</h3>
            <p>${day.description}</p>
            <p>🌡 ${day.temp_min}° / ${day.temp_max}°</p>
        `;

        container.appendChild(card);
    });
}
