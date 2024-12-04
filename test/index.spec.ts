import assert from "assert";
import { investing, getHistoricalData } from '../src/index';

describe('Tests for Investing.com unofficial APIs', () => {
  describe('investing API', () => {
    it('should return undefined and print error if no input is given', async () => {
      const response = await investing();
      assert.strictEqual(response, undefined);
    });
  
    it('should return undefined and print error if input is invalid', async () => {
      const response = await investing('currencies/invalid');
      assert.strictEqual(response, undefined);
    });
  })

  describe('getHistorical API', () => {
    it('should return a function', async () => {
      expect(getHistoricalData).toBeInstanceOf(Function)
    })
  })
});

