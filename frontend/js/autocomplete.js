const searchInput = document.getElementById("search");
const autocompleteBox = document.getElementById("autocomplete-list");
const searchBtn = document.getElementById("search-btn");

async function fetchCities(query) {
    const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(query)}`);
    return res.json();
}

// Limita a 2 opções
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    autocompleteBox.innerHTML = "";
    if (query.length < 2) return;

    try {
        const data = await fetchCities(query);
        data.slice(0,2).forEach(city => {
            const div = document.createElement("div");
            div.className = "option";
            div.textContent = `${city.name} (${city.country_code})`;

            div.addEventListener("click", () => {
                searchInput.value = city.name;
                autocompleteBox.innerHTML = "";
                window.loadWeatherWithData(city.lat, city.lon, city.name, city.country_code);
            });

            autocompleteBox.appendChild(div);
        });
    } catch (err) {
        console.error("Erro no autocomplete:", err);
    }
});

// Botão de pesquisa
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    const cities = await fetchCities(query);
    if (cities.length > 0) {
        const city = cities[0]; // pega a primeira cidade
        window.loadWeather(city.lat, city.lon, city.name, city.country_code);
        autocompleteBox.innerHTML = "";
    }
});
