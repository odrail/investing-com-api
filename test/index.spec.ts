import { investing, getHistoricalData } from '../src/index';

describe('Tests for Investing.com unofficial APIs', () => {
  describe('investing API', () => {
    it('should return undefined and throw error if no input is given', async () => {
      return expect(investing()).rejects.toThrow('Parameter input is required');
    });
  })

  describe('getHistorical API', () => {
    it('should return a function', async () => {
      expect(getHistoricalData).toBeInstanceOf(Function)
    })
  })
});

