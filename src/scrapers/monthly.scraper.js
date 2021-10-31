
const cheerio = require('cheerio');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
class MonthScraper {
    constructor(country, city) {
        this.country = country;
        this.city = city;
    }

    async sendRquest(month, year) {
        const config = {
            method: 'get',
            url: `https://www.accuweather.com/en/${this.country}/${this.city}/ec4a-2/${month}-weather/328328?year=${year}`,
        };
        try {
            const response = await axios(config);
            const $ = cheerio.load(response.data);
            let extractedWeathers = $('body > div > div.two-column-page-content > div.page-column-1 > div.content-module > div.monthly-component.non-ad > div > div.monthly-calendar ').text();
            let weathers = extractedWeathers.replace(/\t/g, '').split('\n').filter(item => item !== '');
            return weathers

        } catch (error) {
            console.log(error);
        }

    }
    process(year, month, weathersStatus) {
        let weathersOfCurrentMonth = [];
        let isStartedMonth = false;
        for (let index = 0; index < weathersStatus.length; index++) {
            if (weathersStatus[index] == '1') {
                isStartedMonth = !isStartedMonth
            }
            if (isStartedMonth) {
                try {
                    weathersOfCurrentMonth.push({
                        time: `${year}/${moment(month, 'MMMM').format('M')}/${weathersStatus[index]}`,
                        high: weathersStatus[index + 1],
                        low: weathersStatus[index + 2]
                    });
                    index = index + 2
                } catch (error) {
                    console.log(error);
                    throw new Error('Sending request Faild in Monthly Weather')
                }

            }
        }

        return weathersOfCurrentMonth;
    }

    save(year, month, weathers) {
        const fileName = `${year}-${month}.json`
        fs.writeFileSync(fileName, JSON.stringify(weathers));
        return fileName
    }
}

module.exports = MonthScraper