
const WeatherMonthly = require('./src/controller/weather-monthly.controller');
const WeatherDaily = require('./src/controller/weather-daily.controller');

const weatherMonthly = new WeatherMonthly('gb', 'london');
const weatherDaily = new WeatherDaily('gb', 'london')
// -----------------------------------------------------------------






async function run() {
    await weatherMonthly.singleRequest('october');
    await weatherMonthly.parallelRequestsAllSettled('2021');
    await weatherMonthly.parallelRequestsAsyncEach('2021');

    // -----------------------------------------------------------------
    weatherDaily.singleRequest()
    weatherDaily.parallelRequestsAllSettled()
    weatherDaily.parallelRequestsAsyncEach()
}


run()
