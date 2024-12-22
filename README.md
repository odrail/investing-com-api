# Investing.com Unofficial APIs
[![](https://github.com/davideviolante/investing-com-api/workflows/Node.js%20CI/badge.svg)](https://github.com/DavideViolante/investing-com-api/actions?query=workflow%3A"Node.js+CI") [![Coverage Status](https://coveralls.io/repos/github/DavideViolante/investing-com-api/badge.svg?branch=master)](https://coveralls.io/github/DavideViolante/investing-com-api?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/ce48adbd97ff85557918/maintainability)](https://codeclimate.com/github/DavideViolante/investing-com-api/maintainability) ![npm](https://img.shields.io/npm/dm/investing-com-api)

[![NPM](https://nodei.co/npm/investing-com-api.png)](https://nodei.co/npm/investing-com-api/)

Unofficial APIs for Investing.com website.

## Install
`npm i investing-com-api`

## Documentation

Visit https://odrail.github.io/investing-com-api

## APIs

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
import { getHistoricalData } = from 'investing-com-api'

async function main() {
  try {
    const historicalData = await getHistoricalData({
      input: '46925',
      resolution: 'D',
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

## Run tests
`npm test`

## Run lint
`npm run lint`

## Thanks to
- [Davide Violante](https://github.com/DavideViolante/)
