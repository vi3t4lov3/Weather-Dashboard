var currentDay = $('#currentDay');
var citySeachFormEl = document.querySelector('#city-search-form');
var cityHistoryEl = document.querySelector('#history-search');
var cityEl = document.querySelector('#city')

//global variables
var apikey = 'a5fc4ee8330414cf46eb731642cac3df';

//display the current day
function displayCurrentDay() {
  var today = moment().format('MM/DD/YYYY');
  currentDay.text(`Today ${today}`);
}
setInterval(displayCurrentDay, 1000);

//default city weather display
function homeWeatherDisplay(){
  var citySearch = 'Atlanta';
  getCityRepos(citySearch)
}

//hander search when we click search button 
var formSubmitHandler = function(event) {
  event.preventDefault();
  var citySearch = cityEl.value.trim();
  var cities = JSON.parse(localStorage.getItem('citySearchHistory')) || [];
  console.log(cities);
  if (citySearch) {
    cityEl.value = '';
    if (!cities.includes(citySearch)) {
      cities.push(citySearch);
    }
    localStorage.setItem('citySearchHistory', JSON.stringify(cities));
    getCityRepos(citySearch);
    renderSearchHistory(citySearch);
  } 
   else {
    cityEl.value = 'Please enter a city'
  }
}

//render search cities
function renderSearchHistory(citySearch) {
  $('#history-search').empty();
  var citiesSearched = JSON.parse(localStorage.getItem('citySearchHistory')) || [];
  for (var i = 0; i < citiesSearched.length; i++) {
      var keyword = citiesSearched[i];
      var historySearch= $('<button>');
      historySearch.addClass('btn');
      historySearch.text(keyword);
      historySearch.attr('data-city', keyword);
      $('#history-search').append(historySearch);
  }
}

// button click handler
function buttonClicktHandler(event) {
 var target = event.target;
 var city = target.getAttribute('data-city');
 getCityRepos(city)
}

// get base forcast information buy search city 
function getCityRepos(citySearch) {
  $('#forecast').empty();
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apikey}`
  
  fetch(requestURL)
    .then(function (response) {
      if (response.ok) {
        console.log('Weather data is working...')
        return response.json();
      } else {
        console.log('The city you search not exit or the api may not be available at this time.');
      }
    })
    .then(function (data) {
      // console.log(data);
      var todayDate = new Date(data.dt);
      var today = moment.unix(todayDate).format('MM/DD/YYYY');
      var cityName = data.name;
      var weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      var weatherDescription = data.weather[0].description;
      var weatherMain = data.weather[0].main
      var cityTemp = `Temp: ${data.main.temp.toFixed(0)} °F`;
      var cityWind = `Wind: ${data.wind.speed} MPH`;
      var cityHumidity = `Humidity: ${data.main.humidity} %`;
      var lon = data.coord.lon;
      var lat = data.coord.lat;
      getForecastUvIndex(lon, lat)
      get5daysForecast(lon, lat)  
      $('#forecast').append(`<div class="currentday">
      <h1 id="city-title">${cityName}</h1>
      <h4 id="date">Today ${weatherDescription}</h4>
      </div> 
      <div class="currentdaydetail">
        <p class="icon-weather" id="weather-icon"><img src='${weatherIcon}'></p> 
        <p id ="main">${weatherMain}</p>
        <p id="temperature">${cityTemp}</p>
        <p id="humidity">${cityHumidity}</p>
        <p id="wind-speed">${cityWind}</p>
        <p id="uv-index"></p>
      </div>
      `);
    });
    
}

// get uv index from the lat, lon
function getForecastUvIndex(lon, lat) {
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
function get5daysForecast (lon, lat) {
  $('#five-days-forecast').empty();
  $('#hourly-forecast').empty();
  var requestURL =`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apikey}`;
  fetch  (requestURL)
  .then(function (response) {
    return response.json();
    // console.log(response)
  })
  .then(function (data) {
    //loop to get next 5 day forecast
    for (var i = 1; i < data.daily.length-2; i ++) {
    var daily = new Date(data.daily[i].dt);
    var listDay = moment.unix(daily).format('MM/DD/YYYY');
    var fTemp = ((data.daily[i].temp.day-273.15)*1.8)+32
    var listWeatherIcon = `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
    var id = `date${i}`;

    //display conntent 5 day & hourly forecast to html pages using jquery
    $('#five-days-forecast').addClass('five-days-forecast');
    $('#five-days-forecast').append(`<div class='forecast-box' id='box-${i}'><p id='${id}'></p> </div>`);
    $(`#${id}`).append(`<h4>${listDay}</h4>`);
    $(`#${id}`).append(`<p class='icon-weather'><img src="${listWeatherIcon}"></p>`);
    $(`#${id}`).append(`<h6>${data.daily[i].weather[0].description}</h6>`)
    $(`#${id}`).attr('style', 'text-align: center');
    $(`#${id}`).append(`<p>Temp: ${fTemp.toFixed(0)} °F</p>`)
    $(`#${id}`).append(`<p>Humidity: ${data.daily[i].humidity}%</p>`)
    $(`#${id}`).append(`<p>Wind: ${data.daily[i].wind_speed} MPH</p>`)
    };
    for (var i = 1; i < data.hourly.length; i++) {
      var hourly = new Date(data.hourly[i].dt);
      var listHourly = moment.unix(hourly).format('LT');
      var hourlyid = `hourly${i}`;
      // console.log(listHourly);
      var fhourlyTemp = ((data.hourly[i].temp-273.15)*1.8)+32
    $('#hourly-forecast').append(`<div class='hourly-box' id='hourlybox-${i}'><p id='${hourlyid}'></p> </div>`);
    $(`#${hourlyid}`).append(`<p>${listHourly}</p>`);
    $(`#${hourlyid}`).append(`<p class='icon-weather'><img src="https://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png" width="50" heigh="50"></p>`);
    $(`#${hourlyid}`).attr('style', 'text-align: center');
    $(`#${hourlyid}`).append(`<p>${fhourlyTemp.toFixed(0)} °F</p>`)
    };
    
  });
}
citySeachFormEl.addEventListener('submit', formSubmitHandler); 
cityHistoryEl.addEventListener('click', buttonClicktHandler); 
homeWeatherDisplay();
renderSearchHistory();