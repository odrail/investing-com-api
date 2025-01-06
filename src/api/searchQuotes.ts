import { SearchQuoteResponse } from "investing-com-api"

type Quote = {
    id: number;
    url: string;
    description: string;
    symbol: string;
    exchange: string;
    flag: string;
    type: string;
}

type SearchDataResponse = {
    quotes: Quote[]
}

const mapQuote = (quote: Quote): SearchQuoteResponse => ({
    description: quote.description,
    exchange: quote.exchange,
    flag: quote.flag,
    pairId: quote.id,
    symbol: quote.symbol,
    type: quote.type,
    url: quote.url
})

/**
 * A class that allows you to receive real-time data from the ForexPro websocket (used by `investing.com`).
 * 
 * @example
 * ```js
 * import { searchQuotes } from 'investing-com-api'
 * 
 * async function main() {
 *   try {
 *     const resultSearchQuotes = await searchQuotes('SWDA')
 * } catch (err) {
 *     console.error(err);
 *   }
 * }
 * ```
 * @beta
 * 
 * */
const searchQuotes = async (search: string): Promise<SearchQuoteResponse[]> => {
    const qs = new URLSearchParams({
        q: search,
    })
    const response = await fetch(`https://api.investing.com/api/search/v2/search?${qs.toString()}`)
    if (!response.ok) return Promise.reject(`Response status: ${response.status}`);
    const body = await response.json() as SearchDataResponse
    return body.quotes
        .map(mapQuote)
}

export default searchQuotes