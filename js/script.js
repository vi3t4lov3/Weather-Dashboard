var cityEl = document.querySelector('#city');

var api = 'a5fc4ee8330414cf46eb731642cac3df'
var city = 'Atlanta';
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + api;

  fetch(apiUrl)
  .then(function (response) {
  return response.json(); 
  })
  .then(function (data) {
    console.log(data);
  })

// fetch('https://api.github.com/orgs/twitter/repos')
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log('Twitter Repositories: Names only \n----------');
//     for (var i = 0; i < data.length; i++) {
//       console.log(data[i].name);
//     }
//   });
