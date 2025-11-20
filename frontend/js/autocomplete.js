const input = document.getElementById("city-input");
const list = document.getElementById("autocomplete-list");

const API_BACKEND = "https://clima-seguro-backend.onrender.com";

input.addEventListener("input", async () => {
    const q = input.value;
    if (q.length < 2) {
        list.innerHTML = "";
        return;
    }

    const res = await fetch(`https://clima-seguro-backend.onrender.com/api/autocomplete?q=${q}`);
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
