## About The Project

This nodejs based command line utility reads crypto trading data from a csv file and fetched portfolio values as per parameters.
The project uses API from CryptoCompare to fetch current price of a token in USD.

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
  CRYPTOCOMPARE_API_KEY=<Your CryptoCompare API key here>
  VALID_TOKENS=ETH,BTC,XRP
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
* Fetch portfolio value for a token in the csv. If no data is found for any valid token then fetches portfolio for all the available tokens.
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

Your Name - [@xception89](https://twitter.com/xception89) - sagarsgopale@gmail.com

Project Link: [https://github.com/gopalesagar/crypto-portfolio](https://github.com/gopalesagar/crypto-portfolio)