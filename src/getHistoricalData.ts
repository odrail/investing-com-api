import { ChartResponse, GetHistoricalDataFn, GetHistoricalDataParams, GetHistoricalDataResponse, InvestmentData } from 'investing-com-api';
import mapResponse from './mapResponse';

const buildUrl = ({ input, resolution = 'D', from, to }: GetHistoricalDataParams): string => {
  const query = new URLSearchParams({
    symbol: input,
    resolution,
    from: from && Math.round(from.getTime() / 1000).toString(),
    to: to && Math.round(to.getTime() / 1000).toString(),
  });
  return 'https://tvc6.investing.com/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history?' + query;
};

const getHistoricalData: GetHistoricalDataFn = async (params) => {
  const response = await fetch(buildUrl(params));

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json: GetHistoricalDataResponse = await response.json();

  if (Array.isArray(json)) {
    throw new Error(json.join('-'))
  }

  if (json.s != 'ok') {
    throw new Error(json.s);
  }

  const array: ChartResponse[] = json.t.map((_, index) => {
    return [
      json.t[index] * 1000,
      json.o[index],
      json.h[index],
      json.l[index],
      json.c[index],
      json.v[index],
    ]
  })

  return mapResponse(array);
};

export default getHistoricalData;
