let express = require('express')
let request = require('request');
const sessionStorage = require('sessionstorage-for-nodejs');
const { getWeather } = require('./WeatherApi/getWeather');
let app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
let city = 'Cluj-Napoca';


let url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
app.get('/', function(req, res, next) {
    request(url, function(error, response, body) {

        let date = JSON.parse(body)

        let lat = date.results[0].latitude;
        let lon = date.results[0].longitude;
        sessionStorage.setItem('latitude', lat);
        sessionStorage.setItem('longitude', lon);
        api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`,
            request(api, function(err, response, body) {
                let vreme = JSON.parse(body)
                console.log(vreme.current_weather.temperature)
                let weather = {
                    city: city,
                    temperature: Math.round(vreme.current_weather.temperature),
                    temp_min: Math.round(vreme.daily_units.temperature_2m_min),
                    temp_max: Math.round(vreme.daily_units.temperature_2m_max),
                    ore: vreme.hourly.time,
                    gradeore: vreme.hourly.temperature_2m,
                    zile: vreme.daily.time,
                    tempzilemax: Math.round(vreme.daily.temperature_2m_max),
                    tempzilemin: Math.round(vreme.daily.temperature_2m_min),

                }
                console.log(weather)
                let weather_data = { weather: weather }
                res.render('weather', weather_data);
            })
    })
})







app.listen(8001);