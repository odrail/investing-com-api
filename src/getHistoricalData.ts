import { GetHistoricalData } from 'investing-com-api';
const { mapResponse } = require('./functions');

const buildUrl = ({ input, resolution = 'D', from, to }: GetHistoricalData) => {
  const query = new URLSearchParams({
    symbol: input,
    resolution,
    from: from && Math.round(from.getTime() / 1000).toString(),
    to: to && Math.round(to.getTime() / 1000).toString(),
  });
  return 'https://tvc6.investing.com/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history?' + query;
};

const getHistoricalData = async (params: GetHistoricalData) => {
  const response = await fetch(buildUrl(params));

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();

  if (json.s != 'ok') {
    throw new Error(json.s);
  }

  const array = [];
  if (Array.isArray(json.t)) {
    for (let index = 0; index < json.t.length; index++) {
      array.push([
        json.t[index] * 1000,
        json.o[index],
        json.h[index],
        json.l[index],
        json.c[index],
        json.v[index],
      ]);
    }
  }

  return mapResponse(array);
};

export default getHistoricalData;
