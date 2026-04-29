const API_KEY = 'a76c5292165a23c8000c55e602475ec1';

document.getElementById('weather-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        alert('Proszę podać nazwę miasta!');
        return;
    }

    getCurrentWeather(city);
    getForecast(city);
});
//teraz
function getCurrentWeather(city) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            console.log('Bieżąca pogoda:', data);
            displayCurrentWeather(data);
        } else {
            console.error('Błąd pobierania bieżącej pogody. Status:', this.status);
            alert('Nie udało się pobrać bieżącej pogody. Sprawdź nazwę miasta.');
        }
    };

    xhr.onerror = function() {
        console.error('Błąd żądania (Network Error) dla bieżącej pogody');
    };

    xhr.send();
}
//5dni

function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Prognoza 5 dni:', data);
            displayForecast(data);
        })
        .catch(error => {
            console.error('Błąd pobierania prognozy:', error);
        });
}



function displayCurrentWeather(data) {
    const section = document.getElementById('current-weather');
    section.innerHTML = `
        <h2>Pogoda w: ${data.name}, ${data.sys.country}</h2>
        <div class="weather-info">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
            </div>
            <div class="weather-details">
                <p class="temp">${Math.round(data.main.temp)}°C</p>
                <p>Odczuwalna: ${Math.round(data.main.feels_like)}°C</p>
                <p><strong>${data.weather[0].description}</strong></p>
                <p>Wilgotność: ${data.main.humidity}%</p>
                <p>Wiatr: ${data.wind.speed} m/s</p>
            </div>
        </div>
    `;
    section.classList.remove('hidden');
}

function displayForecast(data) {
    const section = document.getElementById('forecast');
    const container = document.getElementById('forecast-container');
    container.innerHTML = ''; // Wyczyszczenie starych danych

   
    
    data.list.forEach(item => {
        const dateObj = new Date(item.dt * 1000);
        const day = dateObj.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' });
        const time = dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h3>${day}<br>${time}</h3>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            </div>
            <p class="forecast-temp">${Math.round(item.main.temp)}°C</p>
            <p class="forecast-desc">${item.weather[0].description}</p>
        `;
        container.appendChild(card);
    });

    section.classList.remove('hidden');
}
