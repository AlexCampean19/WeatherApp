let express = require('express')
let request = require('request');
let bodyParser = require('body-parser')
let store = require('store')
let app = express();
let storage = require('node-persist')

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function(req, res) {
    res.render("weather", { weather: null, error: null });
})

app.post('/', function(req, res, next) {

    let city = req.body.city;
    console.log(city)
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
    let api = "https://api.open-meteo.com/v1/forecast?latitude=" + store.get("latitude") + "&longitude=" + store.get("longitude") + "&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto";
    request(api, function(error, response, body) {
        if (error) {
            res.render('weather', { weather: null, error: 'Error, please try again' });
        } else {
            let vreme = JSON.parse(body)

            //console.log(vreme.current_weather.temperature)

            res.render('weather', {
                weather: vreme,
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
                error: null
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

    console.log(vremeoras)

    console.log(vremeoras[0].oras)
    res.render('favorite', {
        vremeorase: vremeoras,

    })
})



app.listen(8001);