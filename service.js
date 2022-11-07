require('dotenv').config();
const { get } = require('request');

const getCoinCurrentValue = (coins) => {
    const url = `${process.env.CRYPTOCOMPARE_API}?fsyms=${coins.join()}&tsyms=${process.env.CRYPTOCOMPARE_COST_FIAT}&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`;
    var options = {
        url,
        headers: { 'User-Agent': 'request' }
    }
    return new Promise(function (resolve, reject) {
        get(options, function (error, response, body) {
            if (error) { reject(error); } else { resolve(JSON.parse(body)); }
        });
    });
};

module.exports = {
    getCoinCurrentValue
}