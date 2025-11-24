// Importa as estruturas de dados personalizadas e o histórico
import { Queue, Stack, LinkedList, HashTable } from './structure.js';
import { addToHistory } from './history.js';

// URL base da API do backend
const API_BASE="https://clima-seguro-backend.onrender.com";

// Instanciando as estruturas de dados
const fila=new Queue();  // Guarda cidades pesquisadas
const pilha=new Stack(); // Guarda histórico reverso
const lista=new LinkedList(); // Armazena objetos completos de clima
const cache=new HashTable(); // Cache para evitar requisições repetidas

let map,marker;

// EXPORTANDO loadWeather para o autocomplete.js
export async function loadWeather(lat,lon,name,country){
   
    // Chave única para cache baseada em coordenadas
    const key=`${lat},${lon}`;
    let cached=cache.get(key);
    
    if(cached){ 
        renderWeather(cached); 
        centerMap(lat,lon); 
        addToHistory(name,null,country); 
        return;
    }
    
    try{
       // Faz requisição ao backend
        const res=await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
        const data=await res.json();
        
        cache.set(key,data);
        
        fila.enqueue(name);
        pilha.push(name);
        lista.add(data);
        renderWeather(data);
        centerMap(lat,lon);
        addToHistory(name,null,country);
        loadForecast(lat,lon);
    }catch(err){console.error(err);}
}

//  Exibe os dados meteorológicos na tela
function renderWeather(data){
    document.getElementById("weather").classList.remove("hidden");
    document.getElementById("city-name").textContent=`${data.city} (${data.country})`;
    const flag=document.getElementById("flag");
    flag.src=data.flag||"";
    flag.style.display=data.flag?"block":"none";
    document.getElementById("desc").textContent=data.description||"";
    document.getElementById("temp").textContent=`🌡 Temperatura: ${Math.round(data.temp)}°C`;
    document.getElementById("humidity").textContent=`💧 Umidade: ${data.humidity}%`;
    document.getElementById("wind").textContent=`🌬 Vento: ${data.wind} km/h`;
}

//  Carrega a previsão estendida (vários dias)
async function loadForecast(lat,lon){
    try{
        const res=await fetch(`${API_BASE}/api/forecast?lat=${lat}&lon=${lon}`);
        const data=await res.json();
        renderForecast(data);
    }catch(err){console.error(err);}
}

//  Renderiza a previsão futura na tela
function renderForecast(data){
    const container=document.getElementById("forecast-container");
    container.innerHTML="";
    if(!data||!data.time) return;
    for(let i=0;i<data.time.length;i++){
        const card=document.createElement("div");
        card.className="forecast-card";
        card.innerHTML=`
            <p class="f-date">${data.time[i]}</p>
            <p>Máx: ${Math.round(data.tmax[i])}°C</p>
            <p>Mín: ${Math.round(data.tmin[i])}°C</p>
            <p>${mapWeatherCode(data.wcode[i])}</p>
        `;
        container.appendChild(card);
    }
}

//  Tradução dos códigos meteorológicos para emojis e texto
function mapWeatherCode(code){
    const map={0:"☀ Limpo",1:"🌤 Poucas nuvens",2:"⛅ Parcialmente nublado",3:"☁ Nublado",
               45:"🌫 Nevoeiro",48:"🌫 Nevoeiro",
               51:"🌦 Chuvisco leve",61:"🌧 Chuva fraca",63:"🌧 Chuva moderada",65:"🌧🌧 Chuva forte",
               80:"🌦 Pancadas leves",81:"🌧 Pancadas moderadas",82:"🌧🌧 Pancadas fortes"};
    return map[code]||"Indefinido";
}

//  Inicializa o mapa
export function initMap(){
    map=L.map('map').setView([0,0],2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'&copy; OpenStreetMap contributors'
    }).addTo(map);
}

function centerMap(lat,lon){
    if(!map) return;
    if(marker) map.removeLayer(marker);
    map.setView([lat,lon],10);
    marker=L.marker([lat,lon]).addTo(map);
}

// Inicializa o mapa automaticamente quando a página carrega
document.addEventListener("DOMContentLoaded",initMap);
