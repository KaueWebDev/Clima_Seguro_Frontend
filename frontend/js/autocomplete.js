import { loadWeather } from './app.js';

const API_BASE="https://clima-seguro-backend.onrender.com";
const searchInput=document.getElementById("search");
const autocompleteBox=document.getElementById("autocomplete-list");
const searchBtn=document.getElementById("search-btn");

async function fetchCities(query){
    const res=await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(query)}`);
    return await res.json();
}

searchInput.addEventListener("input",async ()=>{
    const query=searchInput.value.trim();
    if(query.length<2){autocompleteBox.innerHTML=""; return;}
    try{
        const data=await fetchCities(query);
        autocompleteBox.innerHTML="";
        data.slice(0,2).forEach(city=>{
            const div=document.createElement("div");
            div.className="option";
            div.textContent=`${city.name} (${city.country_code})`;
            div.addEventListener("click",()=>{
                searchInput.value=city.name;
                autocompleteBox.innerHTML="";
                loadWeather(city.lat,city.lon,city.name,city.country_code);
            });
            autocompleteBox.appendChild(div);
        });
    }catch(err){console.error(err); autocompleteBox.innerHTML="<div class='option'>Erro ao buscar cidades</div>";}
});

// Botão pesquisar
searchBtn.addEventListener("click",async ()=>{
    const query=searchInput.value.trim();
    if(!query) return;
    const data=await fetchCities(query);
    if(data.length>0){
        const city=data[0];
        loadWeather(city.lat,city.lon,city.name,city.country_code);
    }
});
