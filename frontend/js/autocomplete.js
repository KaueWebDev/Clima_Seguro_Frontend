const API_BASE = "https://clima-seguro-backend.onrender.com";
const searchInput = document.getElementById("search");
const autocompleteBox = document.getElementById("autocomplete-list");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length < 2) {
        autocompleteBox.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        autocompleteBox.innerHTML = "";

        const seen = new Set();
        data.forEach(city => {
            if (seen.has(city.name)) return;
            seen.add(city.name);

            const div = document.createElement("div");
            div.className = "option";
            div.textContent = `${city.name}`;

            div.addEventListener("click", () => {
                searchInput.value = city.name;
                autocompleteBox.innerHTML = "";
                loadWeather(city.lat, city.lon, city.name, city.country_code);
            });

            autocompleteBox.appendChild(div);
        });

    } catch (err) {
        console.error("Erro no autocomplete:", err);
        autocompleteBox.innerHTML = "<div class='option'>Erro ao buscar cidades</div>";
    }
});
