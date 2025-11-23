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
        const cities = await res.json();

        autocompleteBox.innerHTML = "";

        cities.forEach(city => {
            const item = document.createElement("div");
            item.className = "option";
            item.textContent = city.name;

            item.addEventListener("click", () => {
                searchInput.value = city.name;
                autocompleteBox.innerHTML = "";
                loadWeather(city.lat, city.lon, city.name, city.country_code);
            });

            autocompleteBox.appendChild(item);
        });

    } catch (error) {
        console.error("Erro no autocomplete:", error);
    }
});
