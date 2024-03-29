var APIKey = "c05979fd50e5119c43cbd3ab81fe852f";
var city = "";
var todayDate = "";
var cityListArr = [];
var forecast = [];

var currentDay = document.getElementById("current-day-id");
var currentTempEl = document.getElementById("current-temp");
var uviEl = document.getElementById("uvi-span");
var currentWindEl = document.getElementById("current-wind");
var currentHumidityEl = document.getElementById("current-humidity");

var buttonSection = document.querySelector(".button-section");


//inits the localstorage array.
init();

//gets the search bar submit buttons working
$(".search-bar").submit(function (event) {
  event.preventDefault();
  var city = $("#city-search-input").val();
  fetchData(city);
  storeCity(city);
  
});



//creates the buttons based on localstorage
function rButtons() {
  
  //clears the html with an empty string so there are no duplicated buttons on new search
  buttonSection.innerHTML = "";

  for (let i = 0; i < cityListArr.length; i++) {
    //creates a button
    var button = document.createElement('button');
    button.classList = 'btn city-selector'
    button.textContent = cityListArr[i];

    //creates a click listener on buttons
    $(".city-selector").click(function () {
      var city = $(this)[0].textContent;
      //console.log(cityListArr);
      fetchData(city);
    });
    
    //appends the button to the html
    buttonSection.appendChild(button);
  }
}

//inits local storage
function init() {
  var storedCities = JSON.parse(localStorage.getItem("cityList"));
  console.log(storedCities);

  if (storedCities !== null) {
    cityListArr = storedCities;
  }
  //calls renders buttons function
  rButtons();
}

//updates the city list in local storage
function storeCity(city) {

  cityListArr.push(city);
  console.log(cityListArr);
  //storedCities.push(cityList);

  localStorage.setItem("cityList", JSON.stringify(cityListArr));
  rButtons();
}

//fetches data from the openweather API
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
      var todayDate = moment.unix(data.dt).format("MM/DD/YYYY");
      currentDay.innerHTML = data.name + " " + todayDate;
      getForecast(data.coord.lat, data.coord.lon);
      //console.log(data);
    });

  //gets forecast using Lat and Lon
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
            //console.log(data);
            getElementData(data);

            forecast = [];
            pForecast(data);
          })
        }
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  }
}

//prints the forecast data to the cards
function pForecast(data) {
  //creates the icon for the current weather display
  var weathericon = data.daily[0].weather[0].icon;
  var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
  $("#icon").html("<img src=" + iconurl + ">");

  //loops through the openweather api to gather data for the forecast
  for (let i = 0; i < 5; i++) {
    var wind = "Wind: " + data.daily[i].wind_speed;
    var temp = "Temp: " + data.daily[i].temp.day;
    var hum = "Hum: " + data.daily[i].humidity;
    var day = moment.unix(data.daily[i].dt).format("MM/DD/YY");
    
    
    //retrieves Icon data from the api and icon url
    var weatherIcon = data.daily[i].weather[0].icon;
    var iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

    // object that stores data temporarily 
    var forecastO = {
      wind: data.daily[i].wind_speed,
      temp: data.daily[i].temp.day,
      hum: data.daily[i].humidity,
    }
    //pushes forecastO to the forecast array.
    forecast.push(forecastO);
    
    //adds content to cards
    $("#day-" + i).html(day);
    $("#wind-" + i).html(wind + " mph");
    $("#temp-" + i).html(temp + "F");
    $("#hum-" + i).html(hum + " %");
    $("#icon-" + i).html("<img src=" + iconURL + ">");
  }
}
//gets current weather element and sets data
//I realize I could of done all of this using the pForecast method, but this was my first attempt and did not have the time to refactor
//Although this does pull the current day and not forecast
function getElementData(data) {
  var uviData = data.current.uvi
  uviEl.innerHTML = uviData;

  //sets the uvi color based on current UVI
  if (uviData >= 0 && uviData < 3) {
    uviEl.style.backgroundColor = "green";
  } else if (uviData >= 3 && uviData <= 7) {
    uviEl.style.backgroundColor = "orange";
  } else if (uviData > 7) {
    uviEl.style.backgroundColor = "red";
  }
  currentTempEl.innerHTML = "Temp: " + data.current.temp + " F";
  currentWindEl.innerHTML = "Wind: " + data.current.wind_speed + "mph";
  currentHumidityEl.innerHTML = "Humidity: " + data.current.humidity;
}


