const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const apiKey = '4115eab41dcc516063c499f83652c246';
const weatherInfo = document.querySelector('.weather-info');
const notFound = document.querySelector('.not-found');
const searchCity = document.querySelector('.search-city')
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const condTxt = document.querySelector('.condition-txt');
const humidTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');
const weatherImg = document.querySelector('.weather-summary-img');
const currentDate = document.querySelector('.current-date-txt');
const forcastItems = document.querySelector('.forecast-items-container');
const geolocationIcon = document.querySelector('.geolocation-icon');
geolocationIcon.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherAndForecastByLocation(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error.message);
                alert("Unable to fetch location. Please enable location services and try again.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

async function fetchWeatherAndForecastByLocation(latitude, longitude) {
    try {
      
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const weatherData = await weatherResponse.json();

        
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        if (weatherData.cod === 200 && forecastData.cod === "200") {
            
            const {
                name: country,
                main: { temp, humidity },
                weather: [{ id, main, icon }],
                wind: { speed },
            } = weatherData;

            countryTxt.textContent = country;
            tempTxt.textContent = Math.round(temp) + ' °C';
            humidTxt.textContent = humidity + ' %';
            condTxt.textContent = main;
            windTxt.textContent = speed + ' M/s';
            currentDate.textContent = getDate();
            weatherImg.src = `assets/weather_icons/${getWeatherIcon(id, icon)}`;

            const time = '12:00:00';
            const today = new Date().toISOString().split('T')[0];

            forcastItems.innerHTML = ''; 
            forecastData.list.forEach(weather => {
                if (weather.dt_txt.includes(time) && !weather.dt_txt.includes(today)) {
                    updateForecastItems(weather);
                }
            });

            showDisplaySection(weatherInfo);
        } else {
            alert("Unable to fetch weather data.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred. Please try again.");
    }
}
searchBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim()!='')
    {
        getFetchData(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})
cityInput.addEventListener('keydown',(event)=>{
    if (event.key== 'Enter' && cityInput.value.trim()!='')
    {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
    
})
async function getFetchData(endPoint, city){
    
    
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiURL);
    return response.json()
}

function getWeatherIcon(id, icon) {
    if (id <= 232) {
        return 'thunder.svg';
    } else if (id <= 321) {
        return 'rainy-7.svg';
    } else if (id <= 531) {
        return icon.endsWith('d') ? 'rainy-3.svg' : 'rainy-5.svg';
    } else if (id <= 622) {
        return icon.endsWith('d') ? 'snowy-3.svg' : 'snowy-6.svg';
    } else if (id === 800) {
        return icon.endsWith('d') ? 'day.svg' : 'night.svg';
    } else if (id <= 804) {
        return icon.endsWith('d') ? 'cloudy-day-3.svg' : 'cloudy-night-3.svg';
    }
    return 'weather.svg'; 
}

function getDate() {
    const date = new Date();
    const options = {
        weekday : 'short',
        day : '2-digit',
        month : 'short'
    }
    return date.toLocaleDateString('en-GB', options);
}
async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);
    if(weatherData.cod != 200){
        showDisplaySection(notFound);
        return 
    }
    console.log(weatherData);
    const {
        name : country,
        main : {temp , humidity},
        weather : [{ id, main, icon}],
        wind : {speed},

    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    humidTxt.textContent = humidity + ' %';
    condTxt.textContent = main;
    windTxt.textContent = speed + ' M/s';
    currentDate.textContent = getDate();
    weatherImg.src = `assets/weather_icons/${getWeatherIcon(id, icon)}`;
    
    await updateForecastInfo(city);
    showDisplaySection(weatherInfo);
}

async function updateForecastInfo(city){
    const forecasts = await getFetchData('forecast', city);
    const time = '12:00:00';
    const today = new Date().toISOString().split('T')[0];

    forcastItems.innerHTML = '';
    forecasts.list.forEach(weather=>{
        if (weather.dt_txt.includes(time) && !weather.dt_txt.includes(today)){
            console.log(weather);
            updateForecastItems(weather);
        }
      
    })
} 
function updateForecastItems(weather){
    const {
        dt_txt : date,
        weather : [{id, icon}],
        main : {temp}
    } = weather;

    const dateTaken = new Date(date);
    const options = {
        day : '2-digit',
        month : 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-GB', options);
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather_icons/${getWeatherIcon(id , icon)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
         </div>
    `

    forcastItems.insertAdjacentHTML('beforeend',forecastItem);
}
function showDisplaySection(section){
    [weatherInfo, searchCity, notFound].forEach(section=>section.style.display = 'none');
    section.style.display = 'flex';    
}