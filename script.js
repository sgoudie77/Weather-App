const api = {
    key: "6d8aae41c5f3e297546a33ab1869fda6",
    base: "https://api.openweathermap.org/data/2.5/"
}

// Seet variable for the searchbox input
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

// Search button linked to search bar
document.querySelector('header button').addEventListener('click', function () {
    getResults(searchbox.value);
});

// Get results when enter key is pressed
function setQuery(e) {
    if (e.keyCode == 13) {
        getResults(searchbox.value);
    }
}

// Fetch request to the  API tp get the data
function getResults (query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`).then(weather => {
        return weather.json();
    }).then(displayResults);
}

// Set variables to display the results
function displayResults (weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    let state; 

    // Default display and state
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
    state = 'celsius';

    // Display background image to match the search term
    document.body.style.background = "url('https://source.unsplash.com/1600x900/?" + weather.weather[0].main + "')";

    // Formula to change celsius to fahrenheight
    let tempImperial = (weather.main.temp + 32) * (9 / 5);
    // Formula to change hi/low celsius to fahrenheit
    let tempImperialHi = (weather.main.temp_max +32) * (9 /5);
    let tempImperialLow = (weather.main.temp_min +32) * (9 /5);
    // Change temp and hi/low from celsius to fahrenheit
    temp.addEventListener('click', () => {
        if (state != 'fahrenheit') {
            temp.innerHTML = `${Math.round(tempImperial)}<span>°F</span>`;
            hilow.innerText = `Hi ${Math.round(tempImperialLow)}°F / Low ${Math.round(tempImperialHi)}°F`;
            state = 'fahrenheit';
        } else if (state != 'celsius') {
            temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
            hilow.innerText = `Hi ${Math.round(weather.main.temp_min)}°C / Low ${Math.round(weather.main.temp_max)}°C`;
            state = 'celsius';
        }   
    })

    // Button to convert c/f
    document.querySelector('.current button').addEventListener('click', function () {
        if (state != 'fahrenheit') {
            temp.innerHTML = `${Math.round(tempImperial)}<span>°F</span>`;
            hilow.innerText = `${Math.round(tempImperialLow)}°F / ${Math.round(tempImperialHi)}°F`;
            state = 'fahrenheit';
        } else if (state != 'celsius') {
            temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
            hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
            state = 'celsius';
        }
    })

    // Weather icons
    let icon = weather.weather[0].icon;
    document.querySelector('.current .icon').src = "http://openweathermap.org/img/wn/" + icon + ".png";

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `Hi ${Math.round(weather.main.temp_min)}°C / Low ${Math.round(weather.main.temp_max)}°C`;
}

// Set the date to display
function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemper", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}


// OpenCage Geocoding API - code from the site

let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var apikey = '984afab3ddba4423808ae7f15473f6b8';

        var api_url = 'https://api.opencagedata.com/geocode/v1/json'

        var request_url = api_url
        + '?'
        + 'key=' + apikey
        + '&q=' + encodeURIComponent(latitude + ',' + longitude)
        + '&pretty=1'
        + '&no_annotations=1';

        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);

        request.onload = function() {
  

        if (request.status === 200){ 
            // Success!
            var data = JSON.parse(request.responseText);
            getResults(data.results[0].components.city);
        } else if (request.status <= 500){ 
            // We reached our target server, but it returned an error
                                
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log('error msg: ' + data.status.message);
        } else {
            console.log("server error");
        }
    };

    request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
    };

    request.send();  // make the request
    },
    getLocation: function () {
        function success (data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else {
            getResults();
        }
    }
};

geocode.getLocation();