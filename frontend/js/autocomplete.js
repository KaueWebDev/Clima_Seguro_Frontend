const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const autocompleteBox = document.getElementById("autocomplete-list");

// Função para carregar o clima (do app.js)
function loadWeather(lat, lon, name, country) {
    // Chama a função do app.js
    if (typeof window.loadWeatherOriginal === "function") {
        window.loadWeatherOriginal(lat, lon, name, country);
    }
}

// Função para criar autocomplete
async function fetchAutocomplete(query) {
    try {
        const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        // Limita a 2 opções
        return data.slice(0, 2);
    } catch (err) {
        console.error("Erro no autocomplete:", err);
        return [];
    }
}

// Exibir opções
function renderAutocomplete(cities) {
    autocompleteBox.innerHTML = "";
    autocompleteBox.style.display = "block";

    cities.forEach(city => {
        const div = document.createElement("div");
        div.className = "option";
        div.textContent = `${city.name} (${city.country_code || '??'})`;

        div.addEventListener("click", () => {
            searchInput.value = city.name;
            autocompleteBox.innerHTML = "";
            loadWeather(city.lat, city.lon, city.name, city.country_code);
        });

        autocompleteBox.appendChild(div);
    });

    // Se nenhuma cidade, esconder
    if (cities.length === 0) {
        autocompleteBox.style.display = "none";
    }
}

// Evento ao digitar
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length < 2) {
        autocompleteBox.innerHTML = "";
        autocompleteBox.style.display = "none";
        return;
    }

    const cities = await fetchAutocomplete(query);
    renderAutocomplete(cities);
});

// Evento botão pesquisar
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    const cities = await fetchAutocomplete(query);
    if (cities.length > 0) {
        const city = cities[0];
        loadWeather(city.lat, city.lon, city.name, city.country_code);
        autocompleteBox.innerHTML = "";
    }
});

// Esconder autocomplete ao clicar fora
document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !autocompleteBox.contains(e.target)) {
        autocompleteBox.innerHTML = "";
        autocompleteBox.style.display = "none";
    }
});
