const input = document.getElementById("city-input");
const list = document.getElementById("autocomplete-list");

const API_BACKEND = "https://SEU_BACKEND.onrender.com";

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
document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
}
