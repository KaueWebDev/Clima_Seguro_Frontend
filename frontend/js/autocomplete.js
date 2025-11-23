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
        (data || []).forEach(item => {
            if (!item || !item.name) return;
            if (seen.has(item.name)) return;
            seen.add(item.name);

            const div = document.createElement("div");
            div.className = "option";
            div.textContent = item.name; // já formatado no backend

            div.addEventListener("click", () => {
                searchInput.value = item.name;
                autocompleteBox.innerHTML = "";
                loadWeather(item.lat, item.lon, item.name, item.country_code || "");
            });

            autocompleteBox.appendChild(div);
        });
    } catch (err) {
        console.error("Erro no autocomplete:", err);
        autocompleteBox.innerHTML = "<div class='option'>Erro ao buscar cidades</div>";
    }
});
