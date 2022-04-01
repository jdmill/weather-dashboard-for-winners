var APIKey = "c05979fd50e5119c43cbd3ab81fe852f";
var city = "";
var todayDate = "";
var cityList = [];

var currentDay = document.getElementById("current-day-id");
var currentTempEl = document.getElementById("current-temp");
var uviEl = document.getElementById("uvi");
var currentWindEl = document.getElementById("current-wind");
var currentHumidityEl = document.getElementById("current-humidity");


init();
//gets the search bar submit buttons working
$(".search-bar").submit(function (event) {
  var city = $("#city-search-input").val();

  fetchData(city);
  event.preventDefault();
});

// gets the text value of the city selector buttons
$(".city-selector").click(function () {
  var city = $(this)[0].textContent;
  console.log(cityList);
  fetchData(city);
});

function init() {
  var storedCitiesObj = localStorage.getItem("cityList", JSON.stringify(cityList));
  console.log(storedCitiesObj);

  if (storedCitiesObj !== null) {
    cityList = storedCitiesObj;
  }

};


function fetchData(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      convertDate(data);
      currentDay.innerHTML = data.name +" "+ todayDate;
      getForecast(data.coord.lat, data.coord.lon);
      console.log(data);
    });

  function getForecast(lat, lon) {
    var getForecastUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly,alerts&appid=c05979fd50e5119c43cbd3ab81fe852f&units=imperial";

    fetch(getForecastUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
            getElementData(data);
          });
        }
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  }
  //currentDay.append(city + " (" + )
}

//gets elements and sets data
function getElementData(data) {
  uviEl.innerHTML = "UVI: " + data.current.uvi;
  currentTempEl.innerHTML = "Temp: " + data.current.temp + " F";
  currentWindEl.innerHTML = "Wind: " + data.current.wind_speed + "mph";
  currentHumidityEl.innerHTML = "Humidity: " + data.current.humidity;
}

function getForecastData(data) {
  
}

function convertDate(data) {
  var unixTimeStamp = data.dt;
  console.log(unixTimeStamp);
  var date = new Date(unixTimeStamp * 1000);
  todayDate = "(" + date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear() + ")";

  return todayDate;
}
