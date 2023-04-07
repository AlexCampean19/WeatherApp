let express = require('express')
let request = require('request');
const sessionStorage = require('sessionstorage-for-nodejs');
let store = require('store')
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
        store.set('latitude', lat);
        store.set('longitude', lon);
        console.log(parseFloat(store.get('latitude').toFixed(2)))
        next()

    })
})
let api = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=52.52&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto";
app.get('/', function(req, res, next) {
    request(api, function(error, response, body) {
        let vreme = JSON.parse(body)
        console.log(vreme)
            //console.log(vreme.current_weather.temperature)
        const weather = {
            city: city,
            temperature: vreme.current_weather.temperature,
            temp_min: vreme.daily.temperature_2m_min[0],
            temp_max: vreme.daily.temperature_2m_max[0],
            ore: vreme.hourly.time,
            gradeore: vreme.hourly.temperature_2m,
            zile: vreme.daily.time,
            tempzilemax: vreme.daily.temperature_2m_max,
            tempzilemin: vreme.daily.temperature_2m_min,

        }
        console.log(Math.round(vreme.daily.temperature_2m_max))

        res.render('weather', weather);
    })
})





app.listen(8001);