const moment = require('moment');
const async = require('async');
let q = require('q');
const Scraper = require('../scrapers/daily.scraper');
const MONTHS = require('../assets/month.json');

class WeatherDailyController {
    constructor(country, city) {
        this.scraper = new Scraper(country, city);
    }

    /**
     * Send a request For getting status daily weather page=0
     * @param {string} year, The Year For get Status Weather
     */

    async singleRequest(year = moment().format('YYYY')) {
        try {
            const weathers = await this.scraper.sendRquest();
            const processedWeathers = this.scraper.process(year, weathers);
            this.scraper.save(processedWeathers);
        } catch (error) {
            console.log("Error: singleRequest", error.message);
            throw error
        }
    }

    /**
     * Send Parallel requests For getting status weathers page 0-end
     * @param {string} year, The Year To specify the weather date
     */

    async parallelRequestsAllSettled(year = moment().format('YYYY')) {
        try {
            const pages = new Array(8).fill(0)
            const requests = pages.map((page, index) => this.scraper.sendRquest(index))
            const weathers = await Promise.allSettled(requests);

            for (const [index, page] of pages.entries()) {
                if (weathers[index].status == 'fulfilled') {
                    const processedWeathers = this.scraper.process(year, weathers[index].value);
                    this.scraper.save(processedWeathers);
                }
            }
        } catch (error) {
            console.log("Error: parallelRequestsAllSettled", error.message);
            throw error
        }
    }

    /**
     * Send Parallel requests For getting status weathers page 0-end
     * use third party modules : async and q modules
     * @param {string} year, The Year For get Status Weather
     */
    async parallelRequestsAsyncEach(year = moment().format('YYYY')) {
        const defer = q.defer();
        const pages = Array.from(Array(8).keys())
        async.each(pages, async (page) => {
            try {
                const weather = await this.scraper.sendRquest(page);
                const processedWeathers = this.scraper.process(year, weather);
                this.scraper.save(processedWeathers);
            } catch (error) {
                console.log(`Error: parallelRequestsAsyncEach in ${month}`, error.message);
            }
        }, () => {
            defer.resolve()
        })
        return defer.promise;
    }


}

module.exports = WeatherDailyController