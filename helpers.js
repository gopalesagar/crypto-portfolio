require('dotenv').config();
const { createReadStream } = require('fs');
const { getCoinCurrentValue } = require('./service');
const { DateTime } = require('luxon');

const getCoinPortfolioValues = async (token) => {
    return new Promise(function (resolve, reject) {
        const rlInterface = require('readline').createInterface({
            input: createReadStream(process.env.PORTFOLIO_CSV_FILE)
        });
        let result = {};
        rlInterface.on('line', async (line, lineCount, byteCount) => {

            let lineData = line.split(process.env.DELIMITER);
            const coin = lineData[2];
            if(coin !== 'token') {
                const tradeType = lineData[1];
                const amount = lineData[3];
                let currentCountResult = result[coin] || { amount: 0 };

                currentCountResult.amount -= tradeType === 'WITHDRAWAL' && parseFloat(amount);
                currentCountResult.amount += tradeType === 'DEPOSIT' && parseFloat(amount);
                result[coin] = currentCountResult;
            }
        })

        rlInterface.on('close', async () => {
            const priceResult = await getCoinCurrentValue(Object.keys(result));
            for(key in result) {
                const currentCoin = result[key];
                currentCoin.portfolioValue = `${currentCoin.amount * priceResult[key].USD} USD`;
            }
            const f = token ? result[token] : result;
            resolve(f || result);
        });
    });
}

const getPortfolioValueByDate = async (date, token) => {
    return new Promise(function (resolve, reject) {
        const rlInterface = require('readline').createInterface({
            input: createReadStream(process.env.PORTFOLIO_CSV_FILE)
        });
        let result = {};
        try {
            // date format has to be ISO
            const dateRangeStart = DateTime.fromISO(date).startOf('day').toMillis();
            const dateRangeEnd = DateTime.fromISO(date).endOf('day').toMillis();
            
            rlInterface.on('line', async (line) => {
                let lineData = line.split(process.env.DELIMITER);
                
                const coin = lineData[2];
                if(coin !== 'token') {
                    const timestamp = lineData[0];
                    if (timestamp >= dateRangeStart && timestamp <= dateRangeEnd) {
                        const tradeType = lineData[1];
                        const amount = lineData[3];
                        let currentCountResult = result[coin] || { amount: 0 };

                        currentCountResult.amount -= tradeType === 'WITHDRAWAL' && parseFloat(amount);
                        currentCountResult.amount += tradeType === 'DEPOSIT' && parseFloat(amount);
                        result[coin] = currentCountResult;
                    }
                }
            })

            rlInterface.on('close', async () => {
                const priceResult = await getCoinCurrentValue(Object.keys(result));
                for(key in result) {
                    const currentCoin = result[key];
                    currentCoin.portfolioValue = `${currentCoin.amount * priceResult[key].USD} USD`;
                }
                const f = token ? result[token] : result;
                resolve(f);
            });
        } catch(error) {
            console.log('Error occurred: ', error);
        }
    });
}

module.exports = {
    getCoinPortfolioValues,
    getPortfolioValueByDate
}