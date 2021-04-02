const api = {
    key: "6d8aae41c5f3e297546a33ab1869fda6",
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

//search button linked to search bar
document.querySelector('header button').addEventListener('click', function () {
    getResults(searchbox.value);
});

function setQuery(e) {
    if (e.keyCode == 13) {
        getResults(searchbox.value);
    }
}

function getResults (query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`).then(weather => {
        return weather.json();
    }).then(displayResults);
}

function displayResults (weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    let state; 

    //default
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
    state = 'celsuis';

    //display background image to match the search term
    //document.body.style.background = "url('https://source.unsplash.com/1600x900/?" + city + "')";

    //formula to change celsius to fahrenheight
    let tempImperial = (weather.main.temp + 32) * (9 / 5);
    //formula to change hi/low celsius to fahrenheit
    let tempImperialHi = (weather.main.temp_max +32) * (9 /5);
    let tempImperialLow = (weather.main.temp_min +32) * (9 /5);
    //change temp and hi/low from celsius to fahrenheit
    temp.addEventListener('click', () => {
        if (state != 'fahrenheit') {
            temp.innerHTML = `${Math.round(tempImperial)}<span>°F</span>`;
            hilow.innerText = `${Math.round(tempImperialLow)}°F / ${Math.round(tempImperialHi)}°F`;
            state = 'fahrenheit';
        } else if (state != 'celsuis') {
            temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
            hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
            state = 'celsius';
        }   
    })

    //button to convert c/f
    // document.querySelector('.current button').addEventListener('click' function () {
    //     if (state != 'fahrenheit') {
    //         temp.innerHTML = `${Math.round(tempImperial)}<span>°F</span>`;
    //         hilow.innerText = `${Math.round(tempImperialLow)}°F / ${Math.round(tempImperialHi)}°F`;
    //         state = 'fahrenheit';
    //     } else if (state != 'celsuis') {
    //         temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
    //         hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
    //         state = 'celsius';
    //     }
    // })

    //weather icons
    let weather_icon = document.querySelector('.current .icon');
    weather_icon = weather.weather[0].icon;
    //document.querySelector('.current .icon').src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    //const {icon} = weather.weather[0].icon;
    //weather_icon.innerHTML = `<img src="icons/${icon}.png">;`
    //weather_icon.innerHTML = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    //weather_icon.innerHTML = `{"http://openweathermap.org/img/wn/" + ${icon} + "@2x.png"};`
    //.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    //document.querySelector('.current .icon').src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
}

function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemper", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}
