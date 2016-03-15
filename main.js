



$(document).ready(function(){



$("#getLocation").on('click',function(){


if(navigator.geolocation) {

	navigator.geolocation.getCurrentPosition(coord);

} else{

	alert('No support');
}

function coord (pos) {
	// body...
	alert('Latitude: '+pos.coords.latitude+' Longitude: '+pos.coords.longitude);
}





});




});






