var currentDay = $('#currentDay');
var citySeachFormEl = document.querySelector('#city-search-form');
var cityEl = document.querySelector('#city')
var cityTitle = document.querySelector('#city-title');
var uvIndexEl = document.querySelector('#uv-index');
var weatherContainerEl = document.querySelector('.weather-container');
// var fiveDayForecastEL = $('#five-days-forecast');

var historicalCity = [] 
//display the current day
function displayCurrentDay() {
  var today = moment().format('dddd DD, YYYY hh:mm:ss');
  currentDay.text(`Today ${today}`);
}
setInterval(displayCurrentDay, 1000);

//hander search form 
var formSubmitHandler = function(event) {
  event.preventDefault();
  var apiKey = 'a5fc4ee8330414cf46eb731642cac3df'
  var citySearch = cityEl.value.trim(); 
  if (citySearch) {
   
    var cities = localStorage.getItem('historicalCitySearch');
    if (cities == null) {
      
      cities = [citySearch];
    } else {
      // cities.push(citySearch);
    }
    localStorage.setItem('historicalCitySearch', cities);
    
    getCityRepos(citySearch, apiKey);
    cityEl.value = '';
  } else {

    cityEl.value = 'Please enter a city'
  }
}

// get base forcast information buy search city 
function getCityRepos(cityValue, apikey) {
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&units=imperial&appid=${apikey}`
  
  fetch(requestURL)
    .then(function (response) {
      if (response.ok) {
        console.log('status working...')
        return response.json();
      } else {
        console.log('status not working...');
      }
    })
    .then(function (data) {
      // console.log(data)
      var cityName = data.name;
      var weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      var weatherDescription = data.weather[0].description;
      var cityTemp = `Temp: ${data.main.temp} °F`;
      var cityWind = `Wind: ${data.wind.speed} MPH`;
      var cityHumidity = `Humidity: ${data.main.humidity} %`;
      var lon = data.coord.lon;
      var lat = data.coord.lat;
      getForecastUvIndex(lon, lat , apikey)
      get5daysForecast(lon, lat , apikey)
      // Display text data
      // cityTitle.innerHTML = cityName; 
      $('#city-title').append(cityName);
      $('#weather-icon').append(`<img src='${weatherIcon}'>`);
      $('#description').append(weatherDescription);
      $('#temperature').append(cityTemp);
      $('#humidity').append(cityHumidity);
      $('#wind-speed').append(cityWind);

    });
    
}

// get uv index from the lat, lon
function getForecastUvIndex(lon, lat , apikey) {

  var requestURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apikey}&lat=${lat}&lon=${lon}`;
  
      fetch (requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // console.log(data);
        var cityUVIndex = data.value;
        var todayDate = new Date(data.date);
        var today = moment.unix(todayDate).format('MM/DD/YYYY');

        //set color for UV index
        if (cityUVIndex > 7) {
          $('#uv-index').addClass("badge badge-danger")
        }
        if (cityUVIndex < 3 ) {
          $('#uv-index').addClass("badge badge-success")
        }
        if (cityUVIndex > 3 && cityUVIndex < 7 ) {
          $('#uv-index').addClass("badge badge-warning")
        } 
        $('#uv-index').append(`UV Index: ${cityUVIndex}`)
        $('#date').append(today);
      })

}
//get 5 days forecast
function get5daysForecast (lon, lat, apikey) {
  var requestURL =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apikey}`;
  fetch  (requestURL)
  .then(function (response) {
    return response.json();
    // console.log(response)
  })
  .then(function (data) {
    console.log(data)
    for (var i = 2; i < data.daily.length-1; i ++) {
    var daily = new Date(data.daily[i].dt);
    var listDay = moment.unix(daily).format('MM/DD/YYYY');
    var fTemp = ((data.daily[i].temp.day-273.15)*1.8)+32
    var listWeatherIcon = `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
    var id = `date${i}`;

    $('#five-days-forecast').addClass('five-days-forecast');
    $('#five-days-forecast').append(`<div class='forecast-box' id='box-${i}'><p id='${id}'></p> </div>`);
    $(`#${id}`).append(`<h3>${listDay}</h3>`);
    $(`#${id}`).append(`<p class='icon-weather'><img src="${listWeatherIcon}"></p>`);
    $(`#${id}`).append(`<p>${data.daily[i].weather[0].description}</p>`)
    $(`#${id}`).attr('style', 'text-align: center');
    $(`#${id}`).append(`<p>Temp: ${fTemp.toFixed(0)}°F</p>`)
    $(`#${id}`).append(`<p>Humidity: ${data.daily[i].humidity}%</p>`)
    $(`#${id}`).append(`<p>Wind: ${data.daily[i].wind_speed} MPH</p>`)
    };
  });
}
citySeachFormEl.addEventListener('submit', formSubmitHandler); 


// $(id).append(day1Day)
// $(id).append('<br>')
// $(id).append(`<img src="${icon}">`);
// $(id).append('<br>')
// $(id).append(`${data.daily[i].weather[0].description}`)
// $(id).append('<br>')
// $(id).attr('style', 'text-align: center')
// $(id).append(`Temp: ${fTemp.toFixed(i)}°F`)
// $(id).append('<br>')
// $(id).append(`Humidity: ${data.daily[i].humidity}%`)
// $(id).append('<br>')
// $(id).append(`Wind: ${data.daily[i].wind_speed} MPH`)
// $(id).append('<br>')
// $(id).append(`UVIndex: ${data.daily[i].uvi}`)
// 