let map = L.map('map').setView([-15.7801, -47.9292], 4); // Brasil inicial
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

async function loadWeather(lat, lon, name, country) {
    try {
        const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        document.getElementById("weather").classList.remove("hidden");
        document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
        document.getElementById("flag").src = data.flag || "";
        document.getElementById("flag").style.display = data.flag ? "block" : "none";
        document.getElementById("desc").innerText = data.description || "";
        document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
        document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
        document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;

        // Atualiza mapa
        if(marker) map.removeLayer(marker);
        marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 10);

        // Forecast
        loadForecast(lat, lon);

        // Histórico
        addToHistory({
            name: data.city,
            state: "",
            country: data.country
        });

    } catch(err){
        console.error(err);
    }
}

// Forecast
async function loadForecast(lat, lon){
    try {
        const res = await fetch(`${API_BASE}/api/forecast?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        renderForecast(data);
    } catch(err){
        console.error(err);
    }
}

function renderForecast(data){
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    if(!data || !data.time) return;

    data.time.forEach((t, i)=>{
        const div = document.createElement("div");
        div.className = "forecast-card";
        div.innerHTML = `
            <span>${t}</span>
            <span>Max: ${Math.round(data.tmax[i])}°C</span>
            <span>Min: ${Math.round(data.tmin[i])}°C</span>
            <span>${mapWeatherCode(data.wcode[i])}</span>
        `;
        container.appendChild(div);
    });
}

function mapWeatherCode(code){
    const map = {
        0: "☀ Limpo",1:"🌤 Poucas nuvens",2:"⛅ Parcialmente nublado",3:"☁ Nublado",
        45:"🌫 Nevoeiro",48:"🌫 Nevoeiro",
        51:"🌦 Chuvisco leve",
        61:"🌧 Chuva fraca",63:"🌧 Chuva moderada",65:"🌧🌧 Chuva forte",
        80:"🌦 Pancadas leves",81:"🌧 Pancadas moderadas",82:"🌧🌧 Pancadas fortes"
    };
    return map[code] || "Indefinido";
}

// ================= HISTÓRICO =================
class Node {
    constructor(data) { this.data = data; this.next = null; }
}
class LinkedList {
    constructor() { this.head = null; }
    add(data) { const node = new Node(data); node.next = this.head; this.head = node; }
    toList() { const result = []; let current = this.head; while(current){ result.push(current.data); current = current.next;} return result;}
}
class Queue { constructor(){ this.items = [];} enqueue(item){this.items.push(item);} dequeue(){return this.items.length>0?this.items.shift():null;} getAll(){return this.items;}}
class Stack { constructor(){this.items = [];} push(item){this.items.push(item);} pop(){return this.items.length>0?this.items.pop():null;} getAll(){return this.items;}}

const historyQueue = new Queue();
const historyStack = new Stack();
const historyList = new LinkedList();
const historyContainer = document.getElementById("history-container");

function addToHistory(cityObj){
    historyQueue.enqueue(cityObj);
    historyStack.push(cityObj);
    historyList.add(cityObj);
    renderHistory();
}

function renderHistory(){
    historyContainer.innerHTML = "";
    historyQueue.getAll().forEach((city,index)=>{
        const div = document.createElement("div");
        div.className = "history-card";
        div.innerHTML = `<span>${city.name}, ${city.state || ""}, ${city.country}</span>
        <button onclick="removeHistory(${index})">X</button>`;
        historyContainer.appendChild(div);
    });
}

function removeHistory(index){
    historyQueue.items.splice(index,1);
    historyStack.items.splice(index,1);
    let current = historyList.head, prev=null;
    for(let i=0;i<=index && current;i++){
        if(i===index){ if(prev) prev.next=current.next; else historyList.head=current.next; break;}
        prev=current; current=current.next;
    }
    renderHistory();
}

// Para integração com autocomplete
function selectCity(city){
    searchInput.value=city.name;
    clearAutocomplete();
    loadWeather(city.lat, city.lon, city.name, city.country_code);
}
