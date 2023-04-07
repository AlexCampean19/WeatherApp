const request = require('request')
const weatherDataonHour = (callback) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Cluj-Napoca&appid=7c755906360fdde890fa9c2dcdd2e9d2&units=metric`
        // console.log(url)
    request({ url, json: true }, (error, { body }) => {
        console.log("code", body.cod)
        for (let i = 0; i < 9; i++) {

            callback(undefined, {
                time: new Date(data.list[i].dt * 1000),
                hour: ((time.toLocaleTimeString(undefined, 'Romania/Cluj-Napoca')).replace(':00', '')),
                thetemp: parseInt(data.list[i].main.temp),
                //    humidity:body.main.humidity
            })


        }

    })
}



module.exports = weatherDataonHour;