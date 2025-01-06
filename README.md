# Investing.com Unofficial APIs
[![](https://github.com/davideviolante/investing-com-api/workflows/Node.js%20CI/badge.svg)](https://github.com/DavideViolante/investing-com-api/actions?query=workflow%3A"Node.js+CI") [![Coverage Status](https://coveralls.io/repos/github/DavideViolante/investing-com-api/badge.svg?branch=master)](https://coveralls.io/github/DavideViolante/investing-com-api?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/ce48adbd97ff85557918/maintainability)](https://codeclimate.com/github/DavideViolante/investing-com-api/maintainability) ![npm](https://img.shields.io/npm/dm/investing-com-api)

[![NPM](https://nodei.co/npm/investing-com-api.png)](https://nodei.co/npm/investing-com-api/)

Unofficial APIs for Investing.com website.

## Install
`npm i investing-com-api`

## APIs

### searchQuotes

Use this API to retrieve the `pairId` of the asset of your interest.

#### Input params
- **search** String: input string. It can be ISIN, name or anything else

#### Output

```js
  {
    pairId:      number;
    url:         string;
    description: string;
    symbol:      string;
    exchange:    string;
    flag:        string;
    type:        string;
  }[]
```

#### Example
```js
import { searchQuotes } from 'investing-com-api'

async function main() {
  try {
    const resultSearchQuotes = await searchQuotes('SWDA')
    console.log(resultSearchQuotes)
    /* 
    [
        {
            "pairId": 995448,
            "url": "/etfs/ishares-msci-world---acc?cid=995448",
            "description": "iShares Core MSCI World UCITS ETF USD (Acc)",
            "symbol": "SWDA",
            "exchange": "Switzerland",
            "flag": "Switzerland",
            "type": "ETF - Switzerland"
        },
        {
            "pairId": 995447,
            "url": "/etfs/ishares-msci-world---acc?cid=995447",
            "description": "iShares Core MSCI World UCITS ETF USD (Acc)",
            "symbol": "SWDA",
            "exchange": "London",
            "flag": "UK",
            "type": "ETF - London"
        },
        {
            "pairId": 46925,
            "url": "/etfs/ishares-msci-world---acc?cid=46925",
            "description": "iShares Core MSCI World UCITS ETF USD (Acc)",
            "symbol": "SWDA",
            "exchange": "Milan",
            "flag": "Italy",
            "type": "ETF - Milan"
        }
    ]
    */
  } catch (err) {
    console.error(err);
  }
}
```

### getHistoricalData
Not all parameters are mandatory.

#### Input params
- **params** Object (required)
  - **input** String: input string, provide a valid investing.com pairId. (Required)
  - **resolution** String: resolution of the response.
    - Valid values: 
      - `'5'` (5 minutes)
      - `'60'` (1 hour)
      - `'300'` (5 hours)
      - `'D'` (1 day, **Default**)
      - `'W'` (week)
      - `'M'` (month)
  - **from** Date: a Date object to indicate the start of the period (Required)
  - **to** Date: a Date object to indicate the end of the period (Required)

#### Output
```js
{
  date: number;        // Timestamp of the data point
  price_open: number;  // Opening price
  price_high: number;  // Highest price during the period
  price_low: number;   // Lowest price during the period
  price_close: number; // Closing price
}[]
```

#### Example
```js
import { getHistoricalData, Resolution } = from 'investing-com-api'

async function main() {
  try {
    const historicalData = await getHistoricalData({
      pairId: 46925,
      resolution: Resolution.DAILY,
      from: new Date('2024-10-15T00:00:00.000Z'),
      to: new Date('2024-10-22T00:00:00.000Z'),
    })
  } catch (err) {
    console.error(err);
  }
}
```

Response
```js
[
  {
    date: 1659398400000,
    price_open: 1.0264,
    price_high: 1.0294,
    price_low: 1.0155,
    price_close: 1.0157,
    volume: 10
  },
  {
    date: 1659484800000,
    price_open: 1.0158,
    price_high: 1.0209,
    price_low: 1.0126,
    price_close: 1.0136,
    volume: 15
  },
  ...
]
```

### searchQuotes

#### Input params
- **search** String (required)
- **options** Object (optional)
  - **filters** Object (optional)
    - **type** String (optional)
    - **exchange** Array of Strings (optional)

#### Output
```js
{ 
  pairId:      number;
  url:         string;
  description: string;
  symbol:      string;
  exchange:    string;
  flag:        string;
  type:        string;
}[]
```

#### Example
```js
import { searchQuotes } = from 'investing-com-api'

async function main() {
  try {
    const quotes = await searchQuotes('SWDA')
  } catch (err) {
    console.error(err);
  }
}
```

Response
```js
[
    {
        pairId: 995448,
        url: "/etfs/ishares-msci-world---acc?cid=995448",
        description: "iShares Core MSCI World UCITS ETF USD (Acc)",
        symbol: "SWDA",
        exchange: "Switzerland",
        flag: "Switzerland",
        type: "ETF - Switzerland"
    },
    {
        pairId: 995447,
        url: "/etfs/ishares-msci-world---acc?cid=995447",
        description: "iShares Core MSCI World UCITS ETF USD (Acc)",
        symbol: "SWDA",
        exchange: "London",
        flag: "UK",
        type: "ETF - London"
    },
    {
        pairId: 46925,
        url: "/etfs/ishares-msci-world---acc?cid=46925",
        description: "iShares Core MSCI World UCITS ETF USD (Acc)",
        symbol: "SWDA",
        exchange: "Milan",
        flag: "Italy",
        type: "ETF - Milan"
    }
]
```

## Run tests
`npm test`

## Run lint
`npm run lint`

## Thanks to
- [Davide Violante](https://github.com/DavideViolante/)
