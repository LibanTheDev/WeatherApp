var longitude,
    latitude,
    temperature,
    image,
    background = {

        //the different backgrounds for various climates
        "rainy":"http://terrylascola.com/wp-content/uploads/2014/04/music-mon-rainy-day-mix.jpeg",
        "cloudy":"http://hayatimagazine.com/wp-content/uploads/2015/04/tree-under-cloudy-sky-nature-hd-wallpaper-1920x1200-3821.jpg",
        "sunny":"http://www.nationalweatherstation.com/wp-content/uploads/2015/05/sunny-day-landscape.jpg",
        "night":"http://www.pa.uky.edu/~emilio/USA/Chicago/chicago_night.jpg",
        "thunder":"http://www.free-desktop-backgrounds.net/free-desktop-wallpapers-backgrounds/free-hd-desktop-wallpapers-backgrounds/284177943.jpg",
        "snowy":"http://p1.pichost.me/i/9/1321171.jpg",
        "extreme":"http://www.wallpaperawesome.com/wallpapers-awesome/wallpapers-weather-clouds-tornado-rain-cyclone-flashlights-awesome/wallpaper-street-and-storm-weather.jpg",
        "windy":"https://upload.wikimedia.org/wikipedia/commons/d/d3/Windy_Hill_Wind_Farm.jpg",
        "default":"http://ideatube.science/wp/qmQwhTO.jpg",

       
    




    };


   $(document).ready(function() {
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    //$("#data").html("latitude: " + latitude + "<br>longitude: " + longitude);
    getWeather();
    });
  } else {
    $(".app").addClass("hidden");
    $(".nonav").removeClass("hidden");
    image = background["sunny"];
    $("body").css('background-image', 'url(' + image + ')');
  }  


$("#celsius").on("click", function(){
      $("#temperature").html(showTemperature(temperature, "C") + " &#8451");
});

$("#farenheit").on("click", function(){
      $("#temperature").html(showTemperature(temperature, "F") + " &#8457");
});

$("#tweetweather").on("click",function(){


$("#tweetweather").attr("href", "https://twitter.com/intent/tweet?text=Current weather for: " + json.name + ", " + json.sys.country + " is " + json.weather[0].description + " with a temperature of " + showTemperature(temperature) + "ºC / " + showTemperature(temperature, "F") + "ºF"  + " %20%23LocalWeatherApp %20%23LearnToCode%20%23JavaScript");
    



});

});



function getWeather(){
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=75dd0806f6d8035c89dc883175b4eeb6", function(json) {
    //console.log(json);
    //console.log(json.weather[0].description);
    $("#cityName").html(json.name + ", " + json.sys.country);
    $("#weatherIcon").html("<img src=\""+ showIcon(json.weather[0].icon) + "\" alt=\""+ json.weather[0].description +"\" />");
    $("#weatherCity").html(json.weather[0].main);
    temperature = json.main.temp;
    $("#temperature").html(showTemperature(temperature) + " &#8451");
    $("#humidity").html((json.main.humidity).toFixed(0));
    $("#windspeed").html((json.wind.speed*3.6).toFixed(0) + " km/h");
   $("#tweetweather").attr("href", "https://twitter.com/intent/tweet?text=Current weather for: " + json.name + ", " + json.sys.country + " is " + json.weather[0].description + " with a temperature of " + showTemperature(temperature) + "ºC / " + showTemperature(temperature, "F") + "ºF"  + " %20%23LocalWeatherApp %20%23JavaScript");
    loadBG(json);
  });  
};

function showIcon(value) {
  if (value >= 900 && value <= 906) {
    return "danger.ico";
  }
  if (value >= 951 && value <= 956) {
    return "breezepic.ico";
  }
  if (value >= 957 && value <= 962) {
    return "tornadopic.ico";
  }
  return "http://openweathermap.org/img/w/" + value + ".png";
}

function showTemperature(value, unit) {
  if (unit === "F") {
    return (value * 9/5 - 459.67).toFixed(0);
  } else {
    return (value - 273.15).toFixed(0);
  }
}

function loadBG(data){
  var image = background["default"],
      weatherid = data.weather[0].id,
      now = Date.now(),
      sunsetHour = data.sys.sunset *1000,
      sunriseHour = data.sys.sunrise *1000;
  
  if ((sunriseHour < now) && (sunsetHour > now)) {
    switch (weatherid.toString().substring(0,1)) {
      case "2":
        image = background["thunder"];
        break;
      case "3":
      case "5":
        image = background["rainy"];
        break;
      case "6":
        image = background["snowy"];
        break;
      case "9":
        image = background["windy"];
        break;
      default:
        break;
    }
    if (weatherid === 800) {nn
      image = background["sunny"];
    }
    if (weatherid >= 801 && weatherid <= 805) {
      image = background["cloudy"];
    }
    if (weatherid >= 900 && weatherid <= 906) {
      image = background["extreme"];
    }
  } else {
    image = background["night"];
  }
  $("body").css('background-image', 'url(' + image + ')');
}