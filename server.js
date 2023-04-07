let express = require('express')
let request = require('request');
const weatherData = require('./getweather/getweatherperday');
let app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
let city = 'Cluj-Napoca'
let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&&appid=7c755906360fdde890fa9c2dcdd2e9d2&units=metric`
app.get('/', function(req, res) {

    request(url, function(error, response, body) {

        weather_json = JSON.parse(body);
        console.log(weather_json);
        let weather = {
            city: city,
            temperature: Math.round(weather_json.main.temp),
            temp_min: Math.round(weather_json.main.temp_min),
            temp_max: Math.round(weather_json.main.temp_max),
            description: weather_json.weather[0].description,
        }
        let weather_data = { weather: weather }

        res.render('weather', weather_data);
    })

})
app.get('/getweatherperday', (req, res) => {
    weatherData((error, { day, tempmaxperday, tempminperday }) => {
        console.log(day, tempmaxperday, tempminperday)
        let daytemp = {
            day,
            tempmaxperday,
            tempminperday
        }
        console.log(daytemp)
        let day_data = { daytemp: daytemp }
        res.render('dayweather', day_data)
    })
})
app.get('/getweatherperhour', (req, res) => {
    weatherData((error, { time, hour, temp }) => {
        console.log(time, hour, temp)
        let hourtemp = {
            time,
            hour,
            temp
        }
        console.log(hourtemp)
        let hour_data = { hourtemp: hourtemp }
        res.render('dayweather', hour_data)
    })
})

app.listen(8001);