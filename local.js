
const cheerio = require('cheerio');
const axios = require('axios');

class Scraper {
    constructor(country, city) {
        this.country = country;
        this.city = city;
    }

    async sendRquest(month, year) {
        const config = {
            method: 'get',
            url: `https://www.accuweather.com/en/${this.country}/${this.city}/ec4a-2/${month}-weather/328328?year=${year}`,
            headers: {
                'Accept': '*/*',
                'Connection': 'keep-alive',
            }
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
    async process(initialWeathers) {
        console.log(initialWeathers);
    }

    async save() { }
}


module.exports = Scraper