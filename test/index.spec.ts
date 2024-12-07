import nock from 'nock'
import { getHistoricalData, searchQuotes } from '../src/index';

describe('Tests for Investing.com unofficial APIs', () => {
  describe('getHistorical API', () => {
    it('should return a function', async () => {
      expect(getHistoricalData).toBeInstanceOf(Function)
    })
  })

  describe('searchQuotes API', () => {
    const scope = nock('https://api.investing.com');
    const investingSearchResponse = { 
      quotes: [
        {
            id: 1,
            url: "/fake-path?cid=1",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Switzerland",
            flag: "Switzerland",
            type: "ETF - Switzerland"
        },
        {
            id: 2,
            url: "/fake-path?cid=2",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "London",
            flag: "UK",
            type: "ETF - London"
        },
        {
            id: 3,
            url: "/fake-path?cid=3",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Milan",
            flag: "Italy",
            type: "ETF - Milan"
        },
        {
            id: 4,
            url: "/fake-path?cid=4",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Milan",
            flag: "Italy",
            type: "Index - Milan"
        }
    ]
  }
    it('should return a function', async () => {
      expect(searchQuotes).toBeInstanceOf(Function)
    })

    it('should reject promise if api response with an error', () => {
      const search = 'fake-symbol'
      scope
          .get(`/api/search/v2/search?q=${search}`)
          .reply(500)
      expect(searchQuotes(search)).rejects.toBe("Response status: 500")
    })
    
    it('should return all quotes', async () => {
      const search = 'fake-symbol'
      scope
          .get(`/api/search/v2/search?q=${search}`)
          .reply(200, investingSearchResponse)
      const response = await searchQuotes(search)
      const expected = [
        {
            pairId: 1,
            url: "/fake-path?cid=1",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Switzerland",
            flag: "Switzerland",
            type: "ETF - Switzerland"
        },
        {
            pairId: 2,
            url: "/fake-path?cid=2",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "London",
            flag: "UK",
            type: "ETF - London"
        },
        {
            pairId: 3,
            url: "/fake-path?cid=3",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Milan",
            flag: "Italy",
            type: "ETF - Milan"
        },
        {
            pairId: 4,
            url: "/fake-path?cid=4",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Milan",
            flag: "Italy",
            type: "Index - Milan"
        }
      ]
      expect(response).toEqual(expected)
    })
    
    it('should return quotes filtered by exchange', async () => {
      const search = 'fake-symbol'
      scope
          .get(`/api/search/v2/search?q=${search}`)
          .reply(200, investingSearchResponse)
      const response = await searchQuotes(search, { filter: {exchanges: ['Milan', 'London']}})
      const expected = [
        {
            pairId: 2,
            url: "/fake-path?cid=2",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "London",
            flag: "UK",
            type: "ETF - London"
        },
        {
            pairId: 3,
            url: "/fake-path?cid=3",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Milan",
            flag: "Italy",
            type: "ETF - Milan"
        },
        {
            pairId: 4,
            url: "/fake-path?cid=4",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Milan",
            flag: "Italy",
            type: "Index - Milan"
        }
      ]
      expect(response).toEqual(expected)
    })
    
    it('should return quotes filtered by type', async () => {
      const search = 'fake-symbol'
      scope
          .get(`/api/search/v2/search?q=${search}`)
          .reply(200, investingSearchResponse)
      const response = await searchQuotes(search, { filter: {type: 'ETF'}})
      const expected = [
        {
            pairId: 1,
            url: "/fake-path?cid=1",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Switzerland",
            flag: "Switzerland",
            type: "ETF - Switzerland"
        },
        {
            pairId: 2,
            url: "/fake-path?cid=2",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "London",
            flag: "UK",
            type: "ETF - London"
        },
        {
            pairId: 3,
            url: "/fake-path?cid=3",
            description: "fake description",
            symbol: "fake-symbol",
            exchange: "Milan",
            flag: "Italy",
            type: "ETF - Milan"
        }
      ]
      expect(response).toEqual(expected)
    })
  })
});

