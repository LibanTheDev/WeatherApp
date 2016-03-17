 
$(document).ready(function() {

 function getWeatherData(lat, long) {
        $.ajax({
            url: 'https://api.forecast.io/forecast/8403785038c4e5e3875efb76777aca8c/' + lat + ',' + long
            , dataType: "jsonp", //Cross-domain call requires jsonp
            success: function (json) {

                //Current data
                var currentTemp = Math.round(json.currently.apparentTemperature) + '\u00B0';
                var description = json.currently.summary;
                var icon = json.currently.icon;
                
               

                //Append current data to document
                $('#temp').append(currentTemp);
                $('#condition').append(description +
                    '<br><canvas class="' + icon + '" width="50" height="50"></canvas>');

                //Only display wind data if wind speed is greater than 1mph
               

                //Forecast data
                $.each(json.daily.data, function (i, forecast) {

                    //Skip the first JSON object (data for current day)
                    if (i > 0) {
                        //Store data for daily forecasts
                        //Convert epoch time to readable data
                        var forecastDay = new Date(forecast.time * 1000);
                        forecastDay = (forecastDay.toGMTString()).slice(0, 7);

                        var sunsetTime = new Date(forecast.sunsetTime * 1000);
                        sunsetTime = sunsetTime.toString();
                        sunsetTime = sunsetTime.slice(16, 21);
                        sunsetTime = tConvert(sunsetTime);

                        var sunriseTime = new Date(forecast.sunriseTime * 1000);
                        sunriseTime = sunriseTime.toString();
                        sunriseTime = sunriseTime.slice(17, 21) + 'am';


                        var minTempTime = new Date(forecast.temperatureMinTime * 1000);
                        minTempTime = minTempTime.toString();
                        minTempTime = minTempTime.slice(17, 21) + 'am';


                        var maxTempTime = new Date(forecast.temperatureMaxTime * 1000);
                        maxTempTime = maxTempTime.toString();
                        maxTempTime = maxTempTime.slice(17, 21) + 'pm';

                        var forecastMax = Math.round(forecast.temperatureMax) + '\u00B0';
                        var forecastMin = Math.round(forecast.temperatureMin) + '\u00B0';
                        var forecastIcon = forecast.icon;
                        var forecastDescription = forecast.summary;

                        //HTML to append to document
                        var html =
                            '<div class="forecast-list"><ul class="list">' +
                            '<li class="item" id="day">' + forecastDay + '</li>' +
                            '<li class="item"><canvas class="' + forecastIcon + '" width="40" height="40"></canvas></li>' +
                            '<li class="item forecastTemp" id="max">' + forecastMax + '</li>' +
                            '<li class="item forecastTemp" id="min">' + forecastMin + '</li>' +
                            '<li class="item"><span class="btn">+</span></li>' +
                            '</ul></div>' +

                            //The following div is hidden when the DOM loads
                            '<div class="box hide"><ul>' +
                            '<li>SUNRISE: ' + sunriseTime + '</li>' +
                            '<li>SUNSET: ' + sunsetTime + '</li>' +
                            '<div class="box-second-line">' +
                            '<li>LOW: ' + forecastMin + '@' + minTempTime + '</li>' +
                            '<li>HIGH: ' + forecastMax + '@' + maxTempTime + '</li><br>' +
                            '<li>' + forecastDescription + '</li>' +
                            '</ul></div></div><br><br>';

                                 //Append HTML to document
                        $('.forecast').append(html);
                    } //End if statement
                }); //End .each()

                //Click event to unhide hidden forecast data
                //Create a function that combines both the fade and toggle effects
                $.fn.slideFadeToggle = function (speed, easing, callback) {
                    return this.animate({
                        opacity: 'toggle'
                        , height: 'toggle'
                    }, speed, easing, callback);
                }; //END slideFadeToggle()


                //EVENT HANDLERS---------------------------------------------------------------    
                //Listen to the document(the elements are created dynamically) for click on the forecasts to invoke
                //the slideFadeToggle function
                $(document).on('click', '.forecast-list', function () {
                    if ($(this).next('.box').is(':visible')){
                        $(this).next('.box').slideFadeToggle();
                    } else {
                        $('.box').slideUp(100).fadeOut(200);
                        $(this).next($('.box')).slideFadeToggle(200, 'linear');
                    }
                });
//                    
//                    $('.box').hide();
//                    $(this).next($('.box')).slideFadeToggle(400, 'linear');
//                    $(this).prop('disabled', true);
//                }); //End event handler for slideFadeTaggle 
//
//                //Listen for click on box to hide it
//                $(document).on('click', '.box', function () {
//                    $(this).slideFadeToggle(400, 'linear');
//                    $('.forecast-list').prop('disabled', false);
//                }); //End EVENT HANDLERS------------------------------------------------------------
//
//                $(document).on('click', '.forecast-list', function () {
//
//                    if ($(this).next('.box').is(':visible')) {
//                        $(this).next('.box').hide()
//                    } else {
//                        $(this).next('.box').slideFadeToggle;
//                    }
//                }); //End if statement


                //SKYCONS
                var icons = new Skycons({
                        "color": "black"
                    }),

                    //The items in the array match the weather condiitons provided by Dark Sky.  In order to invoke the icons
                    //you must loop through the DOM to find the matching conditions
                    list = [
                        "clear-day", "clear-night", "partly-cloudy-day"


                        
                        , "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind"


                        
                        , "fog"]
                    , i;

                //Loop to search through classes to find weather type names
                for (i = list.length; i--;) {
                    var weatherType = list[i]
                        , elements = document.getElementsByClassName(weatherType);
                    for (e = elements.length; e--;) {
                        icons.set(elements[e], weatherType);
                    }
                }
                icons.play();
            }


        }); //End .ajax()
    } //End getWeatherData()
    //---------------------------------------------------
    //---------------------------------------------------

    //Find city function
    function getCity(lat, long) {
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyDJZCiJdKG3377QE2rRuuQ2jzSDV6kmeYs'
            , dataType: 'json'
            , success: function (json) {
                console.log(json);
                var city = json.results[0].address_components[3].long_name;
                var neighborhood = json.results[0].address_components[2].long_name;
                var locationHTML = '<h1>' + city + '</h1><h3>' + neighborhood + '</h3>';
                $('#location').append(locationHTML);
            }
        })
    } //End getCity()
    //---------------------------------------------------
    //---------------------------------------------------

    //Function to get longitude and latitude and pass to getWeatherData()
    function checkGeoLocation() {
        if (!navigator.geolocation) {
            alert("Isn't it time for a better browser?");
            return;
        }

        function success(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            getWeatherData(latitude, longitude);
            getCity(latitude, longitude);
        }

        function error(err) {
            console.log(err.code);
        }

        navigator.geolocation.getCurrentPosition(success, error);

    } //End checkGeoLocation
    checkGeoLocation();
                        });
