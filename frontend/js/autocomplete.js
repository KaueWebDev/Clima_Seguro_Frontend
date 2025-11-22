const API_BASE = "http://127.0.0.1:5000";


const searchInput = document.getElementById("search");
const autocompleteBox = document.getElementById("autocomplete-list");
const weatherBox = document.getElementById("weather");


searchInput.addEventListener("input", async () => {
const query = searchInput.value.trim();
if (query.length < 2) {
autocompleteBox.innerHTML = "";
return;
}


const res = await fetch(`${API_BASE}/api/autocomplete?q=${query}`);
const data = await res.json();


autocompleteBox.innerHTML = "";
data.forEach(city => {
const div = document.createElement("div");
div.className = "option";
div.textContent = city.name;


div.addEventListener("click", () => {
searchInput.value = city.name;
autocompleteBox.innerHTML = "";
loadWeather(city.lat, city.lon);
});


autocompleteBox.appendChild(div);
});
});


async function loadWeather(lat, lon) {
const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}`);
const data = await res.json();


weatherBox.style.display = "block";
weatherBox.innerHTML = `
<h2>${data.city}</h2>
<h3>${data.description}</h3>
<p><strong>Temperatura:</strong> ${data.temp}°C</p>
<p><strong>Umidade:</strong> ${data.humidity}%</p>
<p><strong>Vento:</strong> ${data.wind} km/h</p>
`;
}
