const { getCoinPortfolioValues, getPortfolioValueByDate } = require('./helpers');
const { isValidDate, isValidToken } = require('./validation');
const { argv } = require('yargs');

if(!argv.token && !argv.date) {
    console.log(`Fetching portfolio for all the investments...`);
    getCoinPortfolioValues().then(result => console.log(result)).catch(error => { console.log(error.message) });
} else if(argv.token && !argv.date) {
    isValidToken(argv.token);
    console.log(`Fetching portfolio for token ${argv.token}...`);
    getCoinPortfolioValues(argv.token).then(result => console.log(result)).catch(error => { console.log(error.message) });
} else if(!argv.token && argv.date) {
    isValidDate(argv.date);
    console.log(`Fetching portfolio for date ${argv.date}...`);
    getPortfolioValueByDate(argv.date).then(result => console.log(result)).catch(error => { console.log(error.message) });
} else if(argv.token && argv.date) {
    isValidDate(argv.date);
    isValidToken(argv.token);
    console.log(`Fetching portfolio for all token ${argv.token} for date ${argv.date}...`);
    getPortfolioValueByDate(argv.date, argv.token).then(result => console.log(result)).catch(error => { console.log(error.message) });
}