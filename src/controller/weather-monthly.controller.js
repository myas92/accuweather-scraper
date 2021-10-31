const moment = require('moment');
const async = require('async');
let q = require('q');
const Scraper = require('../scrapers/monthly.scraper');
const MONTHS = require('../assets/month.json');

class WeatherMonthController {
    constructor(country, city) {
        this.scraper = new Scraper(country, city);
    }
    /**
     * Send a request For getting status monthly weather
     * @param {*} month The month To specify the weather date
     * @param {*} year The year To specify the weather date
     */

    async singleRequest(month = null, year = moment().format('YYYY')) {
        month = MONTHS.includes(month) ? month : moment().format('MMMM').toLowerCase();
        const weathers = await this.scraper.sendRquest(month, year);
        const processedWeathers = this.scraper.process(year, month, weathers);
        this.scraper.save(year, month, processedWeathers);
    }

    /**
     * Send Parallel requests For getting status monthly weathers january-december
     * @param {*} year The year To specify the weather date 
     */

    async parallelRequestsAllSettled(year = moment().format('YYYY')) {
        try {
            const requests = MONTHS.map(month => this.scraper.sendRquest(month, year))
            const weathers = await Promise.allSettled(requests);

            for (const [index, month] of MONTHS.entries()) {
                if (weathers[index].status == 'fulfilled') {
                    const processedWeathers = this.scraper.process(year, month, weathers[index].value);
                    this.scraper.save(year, month, processedWeathers);
                }
            }
        } catch (error) {
            console.log("Error: parallelRequestsAllSettled", error.message);
            throw error
        }

    }

    /**
     * Send Parallel requests For getting status monthly weathers january-december
     * use third party modules : async and q modules
     * @param {string} year, The Year For get Status Weather
     */
    async parallelRequestsAsyncEach(year = moment().format('YYYY')) {
        const defer = q.defer()
        async.each(MONTHS, async (month) => {
            try {
                const weather = await this.scraper.sendRquest(month, year);
                const processedWeathers = this.scraper.process(year, month, weather);
                this.scraper.save(year, month, processedWeathers);
            } catch (error) {
                console.log(`Error: parallelRequestsAsyncEach in ${month}`, error.message);
            }
        }, () => {
            defer.resolve()
        })
        return defer.promise;
    }

}

module.exports = WeatherMonthController