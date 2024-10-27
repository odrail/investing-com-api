import { ChartResponse, HistoricalDataResponse } from "investing-com-api";

/**
 * Map the Investing array response
 * @param {Array} array Array of data returned from Investing website
 * @return {Array} An array of objects with date and value properties
 */

const mapResponse = (array: ChartResponse[]): HistoricalDataResponse => array.map((item) => ({
  date: item[0],
  price_open: item[1],
  price_high: item[2],
  price_low: item[3],
  price_close: item[4],
  volume: item[5],
}));

export {
  mapResponse,
};
