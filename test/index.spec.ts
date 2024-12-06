import { getHistoricalData } from '../src/index';

describe('Tests for Investing.com unofficial APIs', () => {
  describe('getHistorical API', () => {
    it('should return a function', async () => {
      expect(getHistoricalData).toBeInstanceOf(Function)
    })
  })
});

