/* eslint-disable max-len */
const assert = require('assert');
const { investing } = require('../index');
const { mapResponse } = require('../functions');

const mockData = [
  [1587340800000, 230.7, 1, 2, 3, 4],
  [1587427200000, 259.4, 5, 6, 7, 8],
  [1587513600000, 246.2, 9, 10, 11, 12],
  [1587945600000, 218, 13, 14, 15, 16],
];

describe('Tests for Investing.com unofficial APIs', () => {
  it('should map an array of arrays to array of objects', () => {
    const mappedResponse = mapResponse(mockData);
    const expected = [
      {
        date: mockData[0][0],
        price_open: mockData[0][1],
        price_high: mockData[0][2],
        price_low: mockData[0][3],
        price_close: mockData[0][4],
        volume: mockData[0][5],
      },
      {
        date: mockData[1][0],
        price_open: mockData[1][1],
        price_high: mockData[1][2],
        price_low: mockData[1][3],
        price_close: mockData[1][4],
        volume: mockData[1][5],
      },
      {
        date: mockData[2][0],
        price_open: mockData[2][1],
        price_high: mockData[2][2],
        price_low: mockData[2][3],
        price_close: mockData[2][4],
        volume: mockData[2][5],
      },
      {
        date: mockData[3][0],
        price_open: mockData[3][1],
        price_high: mockData[3][2],
        price_low: mockData[3][3],
        price_close: mockData[3][4],
        volume: mockData[3][5],
      },
    ];
    expect(mappedResponse).toEqual(expected);
  });


  it('should return undefined and print error if no input is given', async () => {
    const response = await investing();
    assert.strictEqual(response, undefined);
  });

  it('should return undefined and print error if input is invalid', async () => {
    const response = await investing('currencies/invalid');
    assert.strictEqual(response, undefined);
  });

  it('should return error with invalid period', async () => {
    const response = await investing('currencies/eur-usd', '1M');
    assert.strictEqual(response, undefined);
  });

  it('should return error with invalid interval', async () => {
    const response = await investing('currencies/eur-usd', 'P1M', '15M');
    assert.strictEqual(response, undefined);
  });

  it('should return error with invalid pointscount', async () => {
    const response = await investing('currencies/eur-usd', 'P1M', 'P1D', 20);
    assert.strictEqual(response, undefined);
  });
});
