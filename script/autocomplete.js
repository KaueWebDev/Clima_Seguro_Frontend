const input = document.getElementById("city-input");
const list = document.getElementById("autocomplete-list");

const API_BACKEND = "https://clima-seguro-backend.onrender.com";

// AUTOCOMPLETE
input.addEventListener("input", async () => {
    const q = input.value;
    if (q.length < 2) {
        list.innerHTML = "";
        return;
    }

    const res = await fetch(`${API_BACKEND}/api/autocomplete?q=${q}`);
    const cities = await res.json();

    list.innerHTML = "";

    cities.forEach(city => {
        const li = document.createElement("li");
        li.innerText = city.name;
        li.onclick = () => {
            input.value = city.name;
            list.innerHTML = "";
            loadWeather(city.lat, city.lon);
        };
        list.appendChild(li);
    });
});

// ATUALIZA A INTERFACE
function updateWeatherUI(data) {
    const city = document.getElementById("city");
    const temp = document.getElementById("temp");
    const icon = document.getElementById("weather-icon");

    city.textContent = data.city;
    temp.textContent = Math.round(data.temp) + "°C";

    // Ícone oficial da OpenWeather
    const iconCode = data.icon;
    icon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}
