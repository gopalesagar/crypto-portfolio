require('dotenv').config();
const { createReadStream } = require('fs');
const { getCoinCurrentValue } = require('./service');
const { DateTime } = require('luxon');
const sourceFilePath = process.env.PORTFOLIO_CSV_FILE;
let rlInterface;

/**
 * 
 * @returns {Object} Readline interface for a csv file
 */
const getRealineInterface = async (filePath) => {
    return require('readline').createInterface({
        input: createReadStream(filePath)
    });
}

/**
 * 
 * @param {string} date ISO date string
 * @returns {Object} Object with start and end of the day in seconds
 */
const getStartAndEndOfDateInSeconds = async (date) => {
    const dateTime = DateTime.fromISO(date);
    return {
        start: dateTime.startOf('day').toSeconds(),
        end: dateTime.endOf('day').toSeconds()
    }
}

/**
 * 
 * @param {string} line Csv file line string
 */
const getLineData = (line) => line.split(process.env.DELIMITER);

/**
 * 
 * @param {Object} resultData Data that has to be processed 
 * @param {string} token Token by which data has to be filtered if provided
 * @returns {Object}
 */
const getFilteredResult = async (resultData, token) => {
    const priceResult = await getCoinCurrentValue(Object.keys(resultData));
    for(key in resultData) {
        const currentCoin = resultData[key];
        currentCoin.portfolioValue = `${currentCoin.amount * priceResult[key].USD} USD`;
        if(token) currentCoin.token = token;
    }
    const filteredResult = token ? resultData[token] : resultData;
    return filteredResult;
}
/**
 * 
 * @param {string} token Token name for which portfolio value is requested
 * @returns {Promise} Portfolio value by a token or for all tokens
 */
const getCoinPortfolioValues = async (token) => {
    return new Promise(async (resolve) => {
        rlInterface = await getRealineInterface(sourceFilePath);
        let result = {};
        rlInterface.on('line', async (line) => {
            const lineData = getLineData(line);
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
            resolve(await getFilteredResult(result, token));
        });
    });
}

/**
 * 
 * @param {string} date Date string in YYYY-MM-DD format
 * @param {string} token Token name for which portfolio value is requested
 * @returns {Promise} Portfolio value by date and token or only date
 */
const getPortfolioValueByDate = async (date, token) => {
    return new Promise(async (resolve) => {
        rlInterface = await getRealineInterface(sourceFilePath);
        let result = {};
        
        const dateRange = await getStartAndEndOfDateInSeconds(date);

        rlInterface.on('line', async (line) => {
            let lineData = getLineData(line);

            const coin = lineData[2];
            if(coin !== 'token') {
                const timestamp = lineData[0];
                if (timestamp >= dateRange.start && timestamp <= dateRange.end) {
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
            resolve(await getFilteredResult(result, token));
        });
    });
}

module.exports = {
    getCoinPortfolioValues,
    getPortfolioValueByDate
}