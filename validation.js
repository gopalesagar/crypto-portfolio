require('dotenv').config();
const { isDate, isIn } = require('validator');
const validTokens = process.env.VALID_TOKENS;

const isValidDate = (date) => {
    if(!isDate(date, { format: process.env.VALID_DATE_FORMAT })) { throw new Error(`Invalid date format. Please provide date in YYYY-MM-DD format`); }
}

const isValidToken = (token) => {
    if(!isIn(token, validTokens.split(process.env.DELIMITER))) { throw new Error(`Invalid token provided. Please provide token value from ${validTokens}`); }
}

const validatePortfolioParameters = (date, token) => {
    if(date) isValidDate(date);
    if(token) isValidToken(token);
}

module.exports = {
    validatePortfolioParameters
}