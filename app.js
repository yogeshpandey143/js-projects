const searchButton = document.querySelector(".search-btn");
const cityInput =document.querySelector(".city-input");
const weatherCardDiv =document.querySelector(".weather-card")
const currweatherCardDiv =document.querySelector(".current-weather");

const API_KEY="03dfc3344a71441dc42ec9650bdf7174";

const createWeatherCard=(cityName,weatherItem,index) =>{
 if(index===0)
 {
    return `<div class="details">
    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
    <h4>Temperature:  ${(weatherItem.main.temp -273.15).toFixed(2)} degree C</h4>
    <h4>wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity} %</h4>
</div>

<div class="icon">
<img src=" https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather image">
    <h4>${weatherItem.weather[0].description}</h4>
</div>
</div>`;
 }
 else{
 
    return ` <li class="card">
  <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
  <img src=" https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather image">
  <h4>Temperature: ${(weatherItem.main.temp -273.15).toFixed(2)} degree C</h4>
  <h4>wind: ${weatherItem.wind.speed} M/S</h4>
  <h4>Humidity: ${weatherItem.main.humidity} %</h4>
</li>`;  
 }
}

const getWeatherDetails =(cityName,lat,lon)=>{

const  WEATHER_API_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
 fetch(WEATHER_API_URL).then(res => res.json()).then(data=> {  
    console.log(data);

    // filter the forecasts to get only one forecast per day
    const uniqueForecastDays =[];  

   const fiveDaysForecast= data.list.filter(forecast =>{
        const forecastDate = new  Date(forecast.dt_txt).getDate();
       if(!uniqueForecastDays.includes(forecastDate))
       {
        return uniqueForecastDays.push(forecastDate);
       }
    });

// remove prvious weather cards 
    cityInput.value ="";
    weatherCardDiv.innerHTML="";
 currweatherCardDiv.innerHTML="";


    console.log(fiveDaysForecast);
    fiveDaysForecast.forEach((weatherItem ,index)=>{
        if(index===0)
        {
            currweatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));
        }
        else{
        // Attachig new  weather cards 
           weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem,index));
        }
    });
 }).catch(()=>{
    alert("An error occured while fetching the weather");
});

}





const getGeoCoordinate =()=>{
    const cityName = cityInput.value.trim();  // get user input city and remove extra spaces
    if(!cityName) return;
    const GEOCODING_API_URL =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;
    console.log(cityName);


// get entered city coordinates (longitude ,latitude and name) from the API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(!data.length) return  alert(`No Cordinate found for ${cityName}`);
       const {name ,lat ,lon} = data[0]; 
       getWeatherDetails(name,lat,lon);
}).catch(()=>{
        alert("An error occured while fetching the coordinates");
    });
}





searchButton.addEventListener("click",getGeoCoordinate);