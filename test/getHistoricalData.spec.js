const nock = require('nock')
const { getHistoricalData } = require('../index');

describe('Tests for getHistoricalData()', () => {
    const scope = nock('https://tvc6.investing.com')

    afterEach(() => {
      nock.cleanAll()
    })

    it('should return an async array', async () => {
      scope
        .get('/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history')
        .query(true)
        .reply(200, { s: "ok" })
      await expect(getHistoricalData()).resolves.toBeInstanceOf(Array)
    })

    it('should throw an error if investing.com API doesn\'t respond with a 200', async () => {
        scope
        .get('/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history')
        .query(true)
        .reply(403)
        await expect(getHistoricalData()).rejects.toThrow()
    })

    it('should throw an error if investing.com API responds with a 200 and not "ok" in body', async () => {
        scope
        .get('/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history')
        .query(true)
        .reply(200, { s: 'error' })
        await expect(getHistoricalData()).rejects.toThrow()
    })

    it('should call investing.com history api', async () => {
      scope
        .get('/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history')
        .query(true)
        .reply(200, { s: "ok" })
      await getHistoricalData({
        input: '1',
        resolution: 'D',
        from: new Date(1729123200000),
        to: new Date(1729209600000)
      })
      expect(scope.isDone()).toBeTruthy()
    })

    it('should return historical data for a specified data range', async () => {
      scope
        .get('/d8f62270e64f9eb6e4e6a07c3ffeab0b/1729428526/9/9/16/history')
        .query({
          symbol: '1',
          resolution: 'D',
          from: 1729123200,
          to: 1729209600
        })
        .reply(200, {
          "t": [
            1729123200,
            1729209600
          ],
          "c": [
            1.08309996128082008937099089962430298328399658203125,
            1.0865999460220299166479662744677625596523284912109375
          ],
          "o": [
            1.086099982261659935289799250313080847263336181640625,
            1.08309996128082008937099089962430298328399658203125
          ],
          "h": [
            1.0872999429702800977537435755948536098003387451171875,
            1.086899995803829899188031049561686813831329345703125
          ],
          "l": [
            1.0809999704360999661645337255322374403476715087890625,
            1.0822999477386499034281541753443889319896697998046875
          ],
          "v": [
            "n/a",
            "n/a"
          ],
          "vo": [
            "n/a",
            "n/a"
          ],
          "vac": [
            "n/a",
            "n/a"
          ],
          "s": "ok"
        })

      const data = await getHistoricalData({
        input: '1',
        resolution: 'D',
        from: new Date(1729123200000),
        to: new Date(1729209600000)
      })

      const expected = [
        {
          date: 1729123200,
          value: 1.086099982261659935289799250313080847263336181640625,
          price_open: 1.086099982261659935289799250313080847263336181640625,
          price_high: 1.0872999429702800977537435755948536098003387451171875,
          price_low: 1.0809999704360999661645337255322374403476715087890625,
          price_close: 1.08309996128082008937099089962430298328399658203125,
        },
        {
          date: 1729209600,
          value: 1.08309996128082008937099089962430298328399658203125,
          price_open: 1.08309996128082008937099089962430298328399658203125,
          price_high: 1.086899995803829899188031049561686813831329345703125,
          price_low: 1.0822999477386499034281541753443889319896697998046875,
          price_close: 1.0865999460220299166479662744677625596523284912109375,
        }
      ]
      expect(data).toEqual(expected)
    })
  })