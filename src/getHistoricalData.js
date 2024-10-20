const { mapResponse } = require('../functions')

const buildUrl = ({ input, resolution, from, to } = {}) => {
    const query = new URLSearchParams({
        symbol: input,
        resolution,
        from: from && from.getTime() / 1000,
        to: to && to.getTime() / 1000,
    })
    return 'https://tvc6.investing.com/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history?' + query
}

const getHistoricalData = async (params) => {
    const response = await fetch(buildUrl(params),{
        headers: new Headers({
          "upgrade-insecure-requests": "1"
        })
      });
    
    // TODO da testare
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    
    const json = await response.json();
    // TODO da testare
    if (json.s != "ok") {
        throw new Error(json.s);
    }

    const array = []
    if (Array.isArray(json.t)) {
        for (let index = 0; index < json.t.length; index++) {
            array.push([
                json.t[index],
                json.o[index],
                json.h[index],
                json.l[index],
                json.c[index]
            ])
        }
    }

    return mapResponse(array)
}

module.exports = getHistoricalData