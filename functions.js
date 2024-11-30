/**
 * Map the Investing array response
 * @param {Array} array Array of data returned from Investing website
 * @return {Array} An array of objects with date and value properties
 */
const mapResponse = (array = []) => array.map((item) => ({
  date: item[0],
  price_open: item[1],
  price_high: item[2],
  price_low: item[3],
  price_close: item[4],
  value: item[4],
  volume: item[5],
}));

module.exports = {
  mapResponse,
};
