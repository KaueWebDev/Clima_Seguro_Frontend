const API_BASE = "https://clima-seguro-backend.onrender.com";
let map = L.map('map').setView([-15, -55], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19
}).addTo(map);

let marker;

async function loadWeather(lat, lon, name, country) {
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data = await res.json();

        if(data.error){ alert(data.error); return; }

        document.getElementById("weather").classList.remove("hidden");
        document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
        document.getElementById("flag").src = data.flag || "";
        document.getElementById("flag").style.display = data.flag ? "block" : "none";
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // Atualizar mapa
        if(marker) map.removeLayer(marker);
        marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 10);

        loadForecast(lat, lon);
    } catch(err){ console.error(err); }
}

// Forecast
async function loadForecast(lat, lon){
    try {
        const res = await fetch(`${API_BASE}/api/forecast?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if(data.error){ console.error(data.error); return; }
        renderForecast(data);
    } catch(err){ console.error(err); }
}

function renderForecast(data){
    const container = document.getElementById("forecast-container");
    container.innerHTML="";
    for(let i=0;i<data.time.length;i++){
        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML=`
            <h3>${data.time[i]}</h3>
            <p>Máx: ${Math.round(data.tmax[i])}°C</p>
            <p>Mín: ${Math.round(data.tmin[i])}°C</p>
            <p>${mapWeatherCode(data.wcode[i])}</p>
        `;
        container.appendChild(card);
    }
}

function mapWeatherCode(code){
    const map = {0:"☀ Limpo",1:"🌤 Poucas nuvens",2:"⛅ Parcialmente nublado",3:"☁ Nublado",
        45:"🌫 Nevoeiro",48:"🌫 Nevoeiro",51:"🌦 Chuvisco leve",61:"🌧 Chuva fraca",63:"🌧 Chuva moderada",
        65:"🌧🌧 Chuva forte",80:"🌦 Pancadas leves",81:"🌧 Pancadas moderadas",82:"🌧🌧 Pancadas fortes"};
    return map[code]||"Indefinido";
}
async function updateDebugBoxes() {
    try {
        const [queueRes, stackRes, listRes] = await Promise.all([
            fetch(`${API_BASE}/api/debug/queue`),
            fetch(`${API_BASE}/api/debug/stack`),
            fetch(`${API_BASE}/api/debug/list`)
        ]);

        const queueData = await queueRes.json();
        const stackData = await stackRes.json();
        const listData = await listRes.json();

        // Queue
        const queueList = document.getElementById("queue-list");
        queueList.innerHTML = queueData.map(item => `<li>${item}</li>`).join("");

        // Stack
        const stackList = document.getElementById("stack-list");
        stackList.innerHTML = stackData.map(item => `<li>${item}</li>`).join("");

        // LinkedList
        const listBox = document.getElementById("list-items");
        listBox.innerHTML = listData.map(item => {
            return `<li>${item.city} - 🌡 ${item.temp}°C - 💧 ${item.humidity}% - 🌬 ${item.wind} km/h</li>`;
        }).join("");

    } catch (err) {
        console.error("Erro ao atualizar debug boxes:", err);
    }
}

// Chame sempre que carregar uma nova cidade
async function loadWeather(lat, lon, name, country) {
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data = await res.json();
        if (data.error) return;

        // Atualiza dados visíveis
        document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
        document.getElementById("flag").src = data.flag || "";
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // Atualiza próximos dias
        loadForecast(lat, lon);

        // Atualiza debug boxes
        updateDebugBoxes();

    } catch (err) {
        console.error("Erro ao carregar o clima:", err);
    }
}
