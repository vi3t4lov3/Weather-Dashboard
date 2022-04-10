var currentDay = $('#currentDay');
var citySeachFormEl = document.querySelector('#city-search-form');
var cityEl = document.querySelector('#city')
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
      // console.log(data)
      var cityName = data.name;
      var weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      var weatherDescription = data.weather[0].main;
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
    for (i = 1; i < data.length; i ++) {
      console.log(i)
    }
    var day1 = new Date(data.daily[1].dt);
    var day1Day = moment.unix(day1).format('MM/DD/YYYY');
    var fTemp = ((data.daily[0].temp.day-273.15)*1.8)+32
    $("#date1").append(day1Day)
    $('#date1').append('<br>')
    var icon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
    $('#date1').append(`<img src="${icon}">`);
    $('#date1').append('<br>')
    $('#date1').append(`${data.daily[0].weather[0].description}`)
    $('#date1').append('<br>')
    $('#date1').attr('style', 'text-align: center')
    $('#date1').append(`Temp: ${fTemp.toFixed(0)}°F`)
    $('#date1').append('<br>')
    $('#date1').append(`Humidity: ${data.daily[0].humidity}%`)
    $('#date1').append('<br>')
    $('#date1').append(`Wind: ${data.daily[0].wind_speed} MPH`)
    $('#date1').append('<br>')
    $('#date1').append(`UVIndex: ${data.daily[0].uvi}`)
  });
}
citySeachFormEl.addEventListener('submit', formSubmitHandler); 