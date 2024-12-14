const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const apiKey = '4115eab41dcc516063c499f83652c246';
const weatherInfo = document.querySelector('.weather-info');
const notFound = document.querySelector('.not-found');
const searchCity = document.querySelector('.search-city')

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
    const apiURL = 'https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}appid=${apiKey}&units=metric';

    const response = await fetch(apiURL);
    return response.json()
}
async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);
    console.log(weatherData);
}
