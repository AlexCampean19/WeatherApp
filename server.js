let express = require('express')
let request = require('request');
let store = require('store')
let app = express();


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function(req, res) {
    res.render("weather", { weather: null, error: null });
})

app.post(('/getCords'), function(req, res, next) {
    lon = req.body.lon;
    lat = req.body.lat
    store.set('longitude', lon)
    store.set('latitude', lat)

})
app.get('/getCords', function(req, res, next) {

    let api = "https://api.open-meteo.com/v1/forecast?latitude=" + store.get("latitude") + "&longitude=" + store.get("longitude") + "&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto";
    request(api, function(error, response, body) {
        if (error) {
            res.render('weather', { weather: null, error: 'Error, please try again' });
        } else {
            let vreme = JSON.parse(body)
            res.render('weather', {
                weather: vreme,
                city: 'Your Location',
                temperature: vreme.current_weather.temperature,
                description: vreme.current_weather.weathercode,
                temp_min: vreme.daily.temperature_2m_min[0],
                temp_max: vreme.daily.temperature_2m_max[0],
                ore: vreme.hourly.time,
                descriptionore: vreme.hourly.weathercode,
                gradeore: vreme.hourly.temperature_2m,
                zile: vreme.daily.time,
                descriptionday: vreme.daily.weathercode,
                tempzilemax: vreme.daily.temperature_2m_max,
                tempzilemin: vreme.daily.temperature_2m_min,
                error: null,
                suncloud: [1, 2],
                fog: [45, 48],
                drizzle: [51, 53, 55, 56, 57],
                rain: [61, 63, 65, 66, 67, 80, 81, 82],
                snow: [71, 73, 75, 77, 85, 86],
                storm: [95, 96, 99],
            })
        }


    })
})

app.post('/', function(req, res, next) {

    let city = req.body.city;
    let url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    request(url, function(error, response, body) {
        if (error) {
            res.render('weather', { weather: null, error: 'Error, please try again' });
        } else {
            let date = JSON.parse(body)
            if (date.results == undefined) {
                res.render('weather', { weather: null, error: 'Error, please try again' });
            } else {
                let lat = date.results[0].latitude;
                let lon = date.results[0].longitude;
                store.set('latitude', lat)
                store.set('longitude', lon)
                next()
            }

        }
    })
})

app.post('/', function(req, res, next) {

    let api = "https://api.open-meteo.com/v1/forecast?latitude=" + store.get("latitude") + "&longitude=" + store.get("longitude") + "&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto";
    request(api, function(error, response, body) {
        if (error) {
            res.render('weather', { weather: null, error: 'Error, please try again' });
        } else {
            let vreme = JSON.parse(body)
            res.render('weather', {
                weather: vreme,
                city: req.body.city,
                temperature: vreme.current_weather.temperature,
                description: vreme.current_weather.weathercode,
                temp_min: vreme.daily.temperature_2m_min[0],
                temp_max: vreme.daily.temperature_2m_max[0],
                ore: vreme.hourly.time,
                descriptionore: vreme.hourly.weathercode,
                gradeore: vreme.hourly.temperature_2m,
                zile: vreme.daily.time,
                descriptionday: vreme.daily.weathercode,
                tempzilemax: vreme.daily.temperature_2m_max,
                tempzilemin: vreme.daily.temperature_2m_min,
                error: null,
                suncloud: [1, 2],
                fog: [45, 48],
                drizzle: [51, 53, 55, 56, 57],
                rain: [61, 63, 65, 66, 67, 80, 81, 82],
                snow: [71, 73, 75, 77, 85, 86],
                storm: [95, 96, 99],
            })
        }


    })
})

let oras = [];
app.post('/add_favorite', function(req, res) {
    oras.push(req.body)
    store.set('favoriteCity', oras)

})

app.get('/favorite', function(req, res) {
    let orasfav = store.get('favoriteCity')
    let orasadaugat = JSON.stringify(orasfav)
    let vremeoras = JSON.parse(orasadaugat)
    res.render('favorite', {
        vremeorase: vremeoras,
    })
})

app.listen(8001);