 
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
               
}
                

               


              



           


        }); //End .ajax()
    } //End getWeatherData()
    //---------------------------------------------------
    //---------------------------------------------------

    //Find city function
    function getCity(lat, long) {
        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyCGy3rc_Rpqox7dScKxIIH7U-I18JoPgbc'
            , dataType: 'json'
            , success: function (json) {
                console.log(json);
                var city = json.results[0].address_components[2].long_name;
                var  neighborhood = json.results[0].address_components[4].long_name;
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
