const API_BASE = "https://clima-seguro-backend.onrender.com";

const searchInput = document.getElementById("search");
const autocompleteBox = document.getElementById("autocomplete-list");
const weatherBox = document.getElementById("weather");

// Autocomplete
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

// Load Weather
async function loadWeather(lat, lon, name, country) {
  try {
    const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}&country=${encodeURIComponent(country)}`);
    const data = await res.json();

    if (data.error) {
      weatherBox.classList.remove("hidden");
      weatherBox.innerHTML = `<p>Erro: ${data.error}</p>`;
      return;
    }

    weatherBox.classList.remove("hidden");
    document.getElementById("city-name").innerText = `${data.city} (${data.country})`;
    document.getElementById("flag").src = data.flag || "";
    document.getElementById("desc").innerText = data.description || "";
    document.getElementById("temp").innerText = `🌡 Temperatura: ${Math.round(data.temp)}°C`;
    document.getElementById("humidity").innerText = `💧 Umidade: ${data.humidity}%`;
    document.getElementById("wind").innerText = `🌬 Vento: ${data.wind} km/h`;
  } catch (err) {
    console.error("Erro ao carregar o clima:", err);
    weatherBox.classList.remove("hidden");
    weatherBox.innerHTML = "<p>Erro ao carregar o clima</p>";
  }
}
