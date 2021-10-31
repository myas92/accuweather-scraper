
const cheerio = require('cheerio');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
class DailyScraper {
    constructor(country, city) {
        this.country = country;
        this.city = city;
    }

    async sendRquest(page = null) {
        page = page && page != 0 ? `?page=${page}` : '';
        const config = {
            method: 'get',
            url: `https://www.accuweather.com/en/${this.country}/${this.city}/ec4a-2/daily-weather-forecast/328328${page}`,
        };
        try {
            const response = await axios(config);
            const $ = cheerio.load(response.data);
            let extractedWeathers = $('body > div > div.two-column-page-content > div.page-column-1 > div:nth-child(1)').text();
            let weathers = extractedWeathers.replace(/\t/g, '').split('\n').filter(item => item !== '');
            return weathers

        } catch (error) {
            console.log(error);
            throw new Error('Sending request Faild in Daily Weather')
        }

    }
    process(year, weathersStatus) {
        let weathersOfCurrentMonth = [];
        for (let index = 1; index < weathersStatus.length; index++) {
            if (['Further Ahead', 'Previous'].includes(weathersStatus[index])) {
                break;
            }
            try {
                weathersOfCurrentMonth.push({
                    day: weathersStatus[index],
                    time: `${year}/${weathersStatus[index + 1]}`,
                    high: weathersStatus[index + 2],
                    low: weathersStatus[index + 3].substring(1),
                    status: weathersStatus[index + 4],
                    percent: weathersStatus[index + 5],
                });
                index = index + 6
            } catch (error) {
                console.log(error);
            }

        }

        return weathersOfCurrentMonth;
    }

    async save(weathers) {
        for (const weather of weathers) {
            const month = moment(weather.time, 'YYYY/M/D').format("MMMM").toLowerCase();
            const year = moment(weather.time, 'YYYY/M/D').format("YYYY");
            const path = `${year}-${month}.json`
            if (fs.existsSync(path)) {
                let weatherFromFile = JSON.parse(fs.readFileSync(path, 'utf-8'));

                let updatedWeathers = weatherFromFile.map(item => {
                    if (item.time == weather.time) {
                        item["meta"] = weather
                    }
                    return item
                })
                fs.writeFileSync(`${year}-${month}.json`, JSON.stringify(updatedWeathers))
            }
        }
    }
}

module.exports = DailyScraper