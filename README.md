## About The Project

This nodejs based command line utility reads crypto trading transactions data from a csv file and fetched portfolio values as per parameters.
The project uses API from CryptoCompare to fetch current price of a token in USD.

## Design Decisions Those Were Tried & Used

### Functions Required
* The requirement was categorized into 2 functions. One helper function works on only token related processing, while other works on date & token related processing.
* Service layer is present to make external API calls.
* Environment variables are present to avoid hard coding

### Validation
* The input parameters are validated
* ```token``` parameter is validated against VALID_TOKENS env variable.
* ```date``` parameter is validated to be in format YYYY-MM-DD

### Using Read Stream
* The first approach was to use read streams because as the trading transactions data csv file can be very large. 
* Reading the file without streams can cause cause nodejs to go out of memory. 
* By using read stream the file could be read in chunks but the problem here is that, it does not give data line by line which adds up to more logic and can hit performance.

### Addition of ```readline``` module
* The readline module of Node.Js creates interface to read a file line by line. 
* Hence, readline was used along with read stream. This resulted in reading file line by line much faster. 
* Without any logic, the reading of the whole file would complete faster. It took ~6 seconds for the csv provided in assignment.

### Date Processing
* In case of date processing, the timestamp seconds value of start and end of the day for the date provided is considered.
* Timestamp is considered in seconds and not milliseconds. This is given in the requirement and not an assumption.

## Getting Started

Clone the project. The main branch has the latest updated code.

### Prerequisites
* Have [Node.js](https://nodejs.org/en/) installed on your local machine

* Obtain API key from https://www.cryptocompare.com/

* Create a .env file in the root with following values
  ```sh
  PORTFOLIO_CSV_FILE=./transactions.csv
  DELIMITER=','
  CRYPTOCOMPARE_API=https://min-api.cryptocompare.com/data/pricemulti
  CRYPTOCOMPARE_COST_FIAT=USD
  CRYPTOCOMPARE_API_KEY=<CRYPTO_COMPARE_API_KEY>
  VALID_TOKENS=ETH,BTC,XRP
  VALID_DATE_FORMAT='yyyy-MM-dd'
  ```
* Place your csv file in the project repository. The csv format should match the existing transactions.csv file existing in the project. Provide the file path in the .env file created above.

* Update the VALID_TOKENS variable in .env file to include all the tokens which have trades in the csv file.

* Install node modules
  ```sh
  npm install
  ```
## Usage
```portfolio.js``` is the main file to be executed. It accepts 2 optional parameters. They are ```token``` and ```date```

### Parameters
* token(string): One of the values from VALID_TOKENS in the .env
* date(string): Date string in format YYYY-MM-DD

### Use Cases
* Fetch portfolio value for all the tokens in the csv
  ```sh
  node portfolio.js
  ```
* Fetch portfolio value for a token in the csv
  ```sh
  node portfolio.js --token=<TOKEN_NAME>
  ```
* Fetch portfolio value of a day for all tokens
  ```sh
  node portfolio.js --date=<DATE_YYYY-MM-DD>
  ```
* Fetch portfolio value of a day for a token
  ```sh
  node portfolio.js --token=<TOKEN_NAME> --date=<DATE_YYYY-MM-DD>
  ```

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

[@xception89](https://twitter.com/xception89) - sagarsgopale@gmail.com

Project Link: [https://github.com/gopalesagar/crypto-portfolio](https://github.com/gopalesagar/crypto-portfolio)