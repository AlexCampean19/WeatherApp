let express = require('express')
let request = require('request');
const bodyParser = require('body-parser')
let store = require('store')
let app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', function(req, res, next) {
    let city = req.body.city;
    let url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    request(url, function(error, response, body) {
        let date = JSON.parse(body)
        console.log(body)
        let lat = date.results[0].latitude;
        let lon = date.results[0].longitude;
        store.set('latitude', lat)
        store.set('longitude', lon)
        console.log(store.get('latitude'))

        next()
    })
})
app.post('/', function(req, res, next) {
    let api = "https://api.open-meteo.com/v1/forecast?latitude=" + store.get("latitude") + "&longitude=" + store.get("longitude") + "&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto";
    request(api, function(error, response, body) {
        let vreme = JSON.parse(body)
        console.log(vreme)
            //console.log(vreme.current_weather.temperature)

        const weather = {
            city: req.body.city,
            temperature: vreme.current_weather.temperature,
            description: vreme.current_weather.weathercode,
            temp_min: vreme.daily.temperature_2m_min[0],
            temp_max: vreme.daily.temperature_2m_max[0],
            ore: vreme.hourly.time,
            gradeore: vreme.hourly.temperature_2m,
            zile: vreme.daily.time,
            tempzilemax: vreme.daily.temperature_2m_max,
            tempzilemin: vreme.daily.temperature_2m_min,
        }

        res.render('weather', weather);
    })
})
app.listen(8001);