var citySeachFormEl = document.querySelector('#city-search-form');
var cityEl = document.querySelector('#city')
var displayResultEl = document.querySelector('#display-results')
var resultEl = document.querySelector('#result')
//hander search form 
var formSubmitHandler = function(event) {
  event.preventDefault();
  var citySearch = cityEl.value.trim(); //trim to clean the space on search text
  if (citySearch) {
    getCityRepos(citySearch);
    displayResultEl.textContent ='';
    cityEl.value = '';
  } else {
    cityEl.value = 'Please enter a city'
  }
}

function getCityRepos () {
  var apiKeys = 'a5fc4ee8330414cf46eb731642cac3df'
  var city = cityEl.value
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKeys}`)
  .then(function (response) {
    if (response.ok) {
      console.log('status working...') 
      return response.json();
    }else {
      console.log('status not working...');
    }
  })
  .then (function (data) {
    if (data ==  undefined) {
      console.log('Please enter the city') 
    } else {
      console.log(data)
      
    }
             
    })
}
getCityRepos ()
citySeachFormEl.addEventListener('submit', formSubmitHandler); 