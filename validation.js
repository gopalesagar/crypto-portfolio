require('dotenv').config();
const { isDate, isIn } = require('validator');

const isValidDate = (date) => {
    if(!isDate(date, { format: 'yyyy-MM-dd' })) { throw new Error(`Invalid date format. Please provide date in YYYY-MM-DD format`); }
}

const isValidToken = (token) => {
    if(!isIn(token, process.env.VALID_TOKENS.split(','))) { throw new Error(`Invalid token provided. Please provide token value from ETH, BTC or XRP`); }
}

module.exports = {
    isValidDate,
    isValidToken
}