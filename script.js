var cities = [];
var Days = "";
var Day = "";

if (localStorage.getItem("city")) {
  var storedCities = JSON.parse(localStorage.getItem("city"));
  cities = storedCities;
  var city = storedCities[storedCities.length - 1];

  getWeather(city);
  buildButtons();
}

// creates a function to run when clicked on the submit button
$("#search-btn").on("click", function (e) {
  e.preventDefault();
  if (city === "") {
    return;
  } else {
    var city = $(".city").val();
    cities.push(city);
    localStorage.setItem("city", JSON.stringify(cities));
    buildButtons();
    getWeather(city);
  }
});

$(".cities").on("click", function (e) {
  e.preventDefault();
  city = $(this).attr("data-cityWeather");
  getWeather(city);
  console.log(city);
});


function buildButtons() {
  $(".search-history").empty();
  for (let i = 0; i < cities.length; i++) {
    var button = $(`<button>`)
      .addClass("cities")
      .attr("data-cityWeather", cities[i]);
    button.text(cities[i]);
    $(".search-history").prepend(button);
  }
}


function getWeather(city) {
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=d5205637385cd4394460b3d628372f66`;
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    const city = response.city;
    var weather = response.list;
    $(".current-day").empty();
    $(".five-days").empty();

    // a for loop to create the 5 day cards
    for (let i = 0; i < 5; i++) {
      // creates the Days div while setting the class
      Days = $("<div>").attr("class", "weather-box");
      const iconCode = weather[i * 8].weather[0].icon;
      const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

      const date = $("<div>")
        .text(weather[i * 8].dt_txt)
        .attr("class", "bold");
      // creates the icon div
      const icon = $("<img>").attr("src", `${iconUrl}`);
      // creates the temp div
      const temp = $("<div>").text("Temp: " + weather[i * 8].main.temp + " °F");
      // creates the humidity div
      const humidityDay = $("<div>").text(
        "Humidity: " + weather[i * 8].main.humidity + "%"
      );
      // appends all of the previous divs to Days
      Days.append(date, icon, temp, humidityDay);
      $(".five-days").prepend(Days).val();
    }
    var queryURL1 = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&units=imperial&appid=d5205637385cd4394460b3d628372f66`;

    $.ajax({
      url: queryURL1,
      method: "GET",
    }).then(function (log) {
      console.log(log);
      var nowWeather = log.current;
      $(".current-day").empty();
      Day = $("<div>").attr("class", "current-day");
      const crtDay = $("<h1>").text(city.name);
      const temp = $("<div>").text("Temperature: " + nowWeather.temp + " °F");
      const humid = $("<div>").text("Humidity: " + nowWeather.humidity);
      const wind = $("<div>").text("Wind Speed: " + nowWeather.wind_speed);
      const UV = $("<div>")
        .text("UV Index: " + nowWeather.uvi)
        .attr("class", "box");

      if (nowWeather.uvi < 2) {
        UV.addClass("dim");
      } else if (nowWeather.uvi <= 5) {
        UV.addClass("bright");
      } else if (nowWeather.uvi > 5) {
        UV.addClass("brighter");
      }

      Day.append(crtDay, temp, humid, wind, UV);
      $(".current-day").prepend(Day).val();
    });
  });
}

