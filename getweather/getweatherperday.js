const request = require('request')
const weatherData = (callback) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=Cluj-Napoca&appid=7c755906360fdde890fa9c2dcdd2e9d2&units=metric`
        // console.log(url)
    request({ url, json: true }, (error, { body }) => {
        console.log("code", body.cod)
        for (let i = 8; i < sapt_json.list.length; i += 8) {

            callback(undefined, {
                day: new Date(sapt_json.list[i].dt * 1000).toDateString(undefined, 'Romania/Cluj-Napoca'),
                tempmaxperday: Math.floor((sapt_json.list[i].main.temp_max)),
                tempminperday: Math.floor((sapt_json.list[i].main.temp_max)),
                //    humidity:body.main.humidity
            })


        }

    })
}



module.exports = weatherData;