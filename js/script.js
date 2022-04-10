var currentDay = $('#currentDay');
var citySeachFormEl = document.querySelector('#city-search-form');
var cityEl = document.querySelector('#city')
var displayWeatherResultEl = document.querySelector('city-div')
var cityTitle = document.querySelector('#city-title');
var uvIndexEl = document.querySelector('#uv-index');
var weatherContainerEl = document.querySelector('.weather-container');
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
  var citySearch = cityEl.value.trim(); //trim to clean the space on search text
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
      console.log(data)
      var cityName = data.name;
      var weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      var weatherDescription = data.weather[0].description;
      var cityTemp = `Temp: ${data.main.temp} °F`;
      var cityWind = `Wind: ${data.wind.speed} MPH`;
      var cityHumidity = `Humidity: ${data.main.humidity} %`;
      var lon = data.coord.lon;
      var lat = data.coord.lat;
      getForecastUvIndex(lon, lat , apikey)
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
        console.log(data);
        var cityUVIndex = data.value;
        var todayDate = new Date(data.date*1000);
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
        $('#date').append(todayDate.toLocaleString('en-GB', { hour12:false } ));
      })

}


citySeachFormEl.addEventListener('submit', formSubmitHandler); 