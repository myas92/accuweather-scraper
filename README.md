# Accuweather Scraper

The [cheerio](https://www.npmjs.com/package/cheerio) module was used to scrap the data

# Part one
## Get status monthly weather

Created a .json file based on year and month

```javascript
const WeatherMonthly = require("./src/controller/weather-monthly.controller");
const weatherMonthly = new WeatherMonthly("gb", "london");

await weatherMonthly.singleRequest("october");
//or
await weatherMonthly.singleRequest("october", "2021");
//creatad 2021-october.json
```

## Get status monthly weather for one year

Created 12 .json file based on year and months(from junary-december)

```javascript
const WeatherMonthly = require("./src/controller/weather-monthly.controller");
const weatherMonthly = new WeatherMonthly("gb", "london");

await weatherMonthly.parallelRequestsAllSettled('2021');
//or
await weatherMonthly.parallelRequestsAsyncEach('2021');
//creatad 2021-october.json
```
**NOTE** : `parallelRequestsAllSettled` and `parallelRequestsAsyncEach` They do the same thing but in two completely different ways


## Sample of created json files
```
[
    {
        "time": "2021/8/1",
        "high": "20°",
        "low": "12°"
    },
    {
        "time": "2021/8/2",
        "high": "19°",
        "low": "14°"
    },
    .
    .
    .
]
```
# Part two

After getting for status weather all months we can run daily scripts;

```javascript
const WeatherDaily = require('./src/controller/weather-daily.controller');

const weatherDaily = new WeatherDaily('gb', 'london');
weatherDaily.singleRequest()

```
## parallelRequestsAllSettled
send parallel requests to get satus weather 

```javascript
const WeatherDaily = require('./src/controller/weather-daily.controller');

const weatherDaily = new WeatherDaily('gb', 'london');
weatherDaily.parallelRequestsAllSettled('2021');
//or
weatherDaily.parallelRequestsAsyncEach()

```

**NOTE** : `parallelRequestsAllSettled` and `parallelRequestsAsyncEach` They do the same thing but in two completely 