import { ChartResponse, Interval, InvestmentData, PairId, Period, PointsCount } from 'investing-com-api';
import mapResponse from './mapResponse';

type HistoricalChartResponse = {
  data: ChartResponse[]
}

const validPeriod = ['P1D', 'P1W', 'P1M', 'P3M', 'P6M', 'P1Y', 'P5Y', 'MAX'];
const validInterval = ['PT1M', 'PT5M', 'PT15M', 'PT30M', 'PT1H', 'PT5H', 'P1D', 'P1W', 'P1M'];
const validPointscount = [60, 70, 120];

/**
 * Check if params are valid
 * @param {String} input input
 * @param {String} period period
 * @param {String} interval interval
 * @param {Number} pointscount pointscount
 */
function checkParams(input: string, period: Period, interval: Interval, pointscount: PointsCount) {
  if (!input) {
    throw Error('Parameter input is required');
  }
  if (!validPeriod.includes(period)) {
    throw Error('Invalid period parameter. Valid values are: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX');
  }
  if (!validInterval.includes(interval)) {
    throw Error('Invalid interval parameter. Valid values are: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M');
  }
  if (!validPointscount.includes(pointscount)) {
    throw Error('Invalid pointscount parameter. Valid values are: 60, 70, 120');
  }
}

/**
 * Call Investing website
 * @param {string} pairId Input string, see mapping.js keys, or provide a valid investing.com pairId
 * @param {string} period Period of time, window size.
 *                        Valid values: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX
 * @param {string} interval Interval between results.
 *                          Valid values: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M
 * @param {number} pointscount Number of results returned. Valid values: 60, 70, 120
 * @return {Promise<ChartResponse[]>} An array of arrays with date (timestamp) and values (number) properties
 */
async function callInvesting(pairId: PairId, period: Period, interval: Interval, pointscount: PointsCount): Promise<ChartResponse[]> {
  const query = new URLSearchParams({
    period,
    interval,
    pointscount: pointscount.toString(),
  });
  const url = `https://api.investing.com/api/financialdata/${pairId}/historical/chart?${query}`;

  const response = await fetch(url, {
    headers: new Headers({
      'upgrade-insecure-requests': '1',
    }),
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json: HistoricalChartResponse = await response.json();
  return json.data;
}

/**
 * Investing
 * @param {string} pairId Input string, see mapping.js keys, or provide a valid investing.com pairId
 * @param {string} [period] Period of time, window size. Default P1M (1 month)
 *                        Valid values: P1D, P1W, P1M, P3M, P6M, P1Y, P5Y, MAX
 * @param {string} [interval] Interval between results. Default P1D (1 day)
 *                          Valid values: PT1M, PT5M, PT15M, PT30M, PT1H, PT5H, P1D, P1W, P1M
 * @param {number} [pointscount] Number of results returned, but depends on period and interval too.
 *                             Valid values: 60, 70, 120
 * @return {Promise<Array>} An array of objects with date (timestamp), value (number) and other (number) properties
 */

const investing = async(pairId?: string, period: Period = 'P1M', interval: Interval = 'P1D', pointscount: PointsCount = 120): Promise<InvestmentData[]> => {
  checkParams(pairId, period, interval, pointscount);
  const resInvesting = await callInvesting(pairId, period, interval, pointscount);
  const results = mapResponse(resInvesting);
  if (!results.length) {
    throw Error('Wrong input or pairId');
  }
  return results;
}

export default investing