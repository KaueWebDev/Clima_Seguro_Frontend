const API_BASE = "https://clima-seguro-backend.onrender.com";
const searchInput = document.getElementById("search");
const autocompleteBox = document.getElementById("autocomplete-list");
const searchBtn = document.getElementById("search-btn");

let selectedCity = null;

async function fetchAutocomplete(query) {
    try {
        const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.slice(0, 2); 
    } catch {
        return [];
    }
}

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    autocompleteBox.innerHTML = "";
    if (query.length < 2) return;

    const cities = await fetchAutocomplete(query);
    cities.forEach(city => {
        const div = document.createElement("div");
        div.className = "option";
        div.textContent = `${city.name} (${city.country_code})`;

        div.addEventListener("click", () => {
            selectedCity = city;
            searchInput.value = city.name;
            autocompleteBox.innerHTML = "";
            loadWeather(city.lat, city.lon, city.name, city.country_code);
        });

        autocompleteBox.appendChild(div);
    });
});

// Botão pesquisar
searchBtn.addEventListener("click", () => {
    if (selectedCity) {
        loadWeather(selectedCity.lat, selectedCity.lon, selectedCity.name, selectedCity.country_code);
        autocompleteBox.innerHTML = "";
    }
});
