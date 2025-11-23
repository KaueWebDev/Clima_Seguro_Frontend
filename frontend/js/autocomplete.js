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

        data.forEach(city => {
            const div = document.createElement("div");
            div.className = "option";

            // Nome simplificado (já ajustado no backend)
            div.textContent = `${city.name} (${city.country_code})`;

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
