import { SearchQuoteOptions, SearchQuoteResponse } from "investing-com-api"

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

const applyFilters = (quote: Quote, options?: SearchQuoteOptions): boolean => {
    if (!options) return true
    if (options.filter.type) {
        if (!quote.type.includes(options.filter.type)) return false
    }
    if (options.filter.exchanges) {
        if (!options.filter.exchanges.includes(quote.exchange)) return false
    }
    return true
}

const searchQuotes = async (search: string, options?: SearchQuoteOptions): Promise<SearchQuoteResponse[]> => {
    const response = await fetch(`https://api.investing.com/api/search/v2/search?q=${search}`)
    if (!response.ok) return Promise.reject(`Response status: ${response.status}`);
    const body = await response.json() as SearchDataResponse
    return body.quotes
        .filter(quote => applyFilters(quote, options))
        .map(mapQuote)
}

export default searchQuotes