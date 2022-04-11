var currentDay = $('#currentDay');
var citySeachFormEl = document.querySelector('#city-search-form');
var cityHistoryEl = document.querySelector('#history-search');
var cityEl = document.querySelector('#city')
var cityTitle = document.querySelector('#city-title');
var uvIndexEl = document.querySelector('#uv-index');
var weatherContainEl = document.querySelector('#weather-container');

var cities = [] ;
//display the current day
function displayCurrentDay() {
  var today = moment().format('MM/DD/YYYY');
  currentDay.text(`Today ${today}`);
}
setInterval(displayCurrentDay, 1000);

//render search cities
function renderSearchHistory() {
  for (var i = 0; i < cities.length; i++) {
    displaySearchCity(cities[i]);
    // console.log()
  }
}
function displaySearchCity(cities) {
  var newSearch = $(`<button class ='btn'>`);
  newSearch.text(cities);
  $('#history-search').append(newSearch);

}
//button click formSubmitHandler
function buttonSubmitHandler(event) {
  var cityButton = $(event.target)
  var city = $(event.target).text();
  event.preventDefault();
  getCityRepos(city);

}

//hander search button 
var formSubmitHandler = function(event) {
  event.preventDefault();
  var apiKey = 'a5fc4ee8330414cf46eb731642cac3df'
  var citySearch = cityEl.value.trim(); 
  var city = localStorage.getItem('citySearchHistory');

  if (citySearch) {
    cityEl.value = '';
    localStorage.setItem('citySearchHistory', JSON.stringify(citySearch));
    cities = city;
    getCityRepos(citySearch, apiKey);
    renderSearchHistory();
    // console.log(cities);
  } 
   else {
    $('#display-weather').empty();
    cityEl.value = 'Please enter a city'
  }
}
//default city weather display
function homeWeatherDisplay(){
  var citySearch = 'Atlanta';
  var apikey = 'a5fc4ee8330414cf46eb731642cac3df';
  getCityRepos(citySearch, apikey)
}
// get base forcast information buy search city 
function getCityRepos(citySearch, apikey) {
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apikey}`
  
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
      var todayDate = new Date(data.dt);
      var today = moment.unix(todayDate).format('MM/DD/YYYY');
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
      $('#date').append(` (${today})`);
      $('#city-title').append(cityName);
      $('#weather-icon').append(`<img src='${weatherIcon}'>`);
      $('#description').append(`<h5>${weatherDescription}</h5>`);
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
        var cityUVIndex = data.value;
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
    // console.log(data)
    //loop to get next 5 day forecast
    for (var i = 1; i < data.daily.length-2; i ++) {
    var daily = new Date(data.daily[i].dt);
    var listDay = moment.unix(daily).format('MM/DD/YYYY');
    var fTemp = ((data.daily[i].temp.day-273.15)*1.8)+32
    var listWeatherIcon = `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
    var id = `date${i}`;

    //display conntent 5 day forecast to html pages using jquery
    $('#five-days-forecast').addClass('five-days-forecast');
    $('#five-days-forecast').append(`<div class='forecast-box' id='box-${i}'><p id='${id}'></p> </div>`);
    $(`#${id}`).append(`<h4>${listDay}</h4>`);
    $(`#${id}`).append(`<p class='icon-weather'><img src="${listWeatherIcon}"></p>`);
    $(`#${id}`).append(`<h6>${data.daily[i].weather[0].description}</h6>`)
    $(`#${id}`).attr('style', 'text-align: center');
    $(`#${id}`).append(`<p>Temp: ${fTemp.toFixed(0)}°F</p>`)
    $(`#${id}`).append(`<p>Humidity: ${data.daily[i].humidity}%</p>`)
    $(`#${id}`).append(`<p>Wind: ${data.daily[i].wind_speed} MPH</p>`)
    };
  });
}
citySeachFormEl.addEventListener('submit', formSubmitHandler); 
cityHistoryEl.addEventListener('click', buttonSubmitHandler); 
homeWeatherDisplay()