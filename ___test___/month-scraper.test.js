const fs = require('fs');
const moment = require('moment');
const Scraper = require('../src/scrapers/monthly.scraper');


const scraper = new Scraper('gb', 'london');

describe("Month Scraper", () => {

    let weathers;
    let processedWeather;
    const month = moment().format('MMMM')
    const year = moment().format('MMMM')
    it("sendRequest", async () => {

        weathers = await scraper.sendRquest(month, year)
        expect(weathers.length).toBeGreaterThan(80);
    });

    it("process", () => {
        processedWeather = scraper.process(year, month, weathers)
        expect(processedWeather.length).toBeGreaterThan(28);
    });

    it("save", () => {
        const dir = scraper.save(year, month, processedWeather)
        let savedFile = fs.readFileSync(dir, "utf-8");
        expect(JSON.parse(savedFile).length).toBe(processedWeather.length);
    });

});