declare module "investing-com-api" {

  export interface GetHistoricalDataParams {
    input: string,
    resolution?: '5' | '60' | 'D' | 'W' | 'M',
    from: Date,
    to: Date
  }

  export type PairId = string
  export type Period = 'P1D' | 'P1W' | 'P1M' | 'P3M' | 'P6M' | 'P1Y' | 'P5Y' | 'MAX'
  export type Interval = 'PT1M' | 'PT5M' | 'PT15M' | 'PT30M' | 'PT1H' | 'PT5H' | 'P1D' | 'P1W' | 'P1M'
  export type PointsCount = 60 | 70 | 120
  export type ChartResponse = [number, number, number, number, number, number]
  export type GetHistoricalDataFn = (params: GetHistoricalDataParams) => Promise<InvestmentData[]>

  // Structure of a single data point response
  export interface InvestmentData {
    date: number;        // Timestamp of the data point
    price_open: number;  // Opening price
    price_high: number;  // Highest price during the period
    price_low: number;   // Lowest price during the period
    price_close: number; // Closing price
  }

  export type GetHistoricalDataResponse = 
    | {
      s: "ok"
      t: number[]
      o: number[]
      h: number[]
      l: number[]
      c: number[]
      v: number[]
      vac: number[]
      vo: number[]
  } 
  | { s: "no_data", nextTime: number }
  | string[]

  /**
   * Fetches historical data for a specified trading pair.
   * 
   * @param input - The trading pair identifier.
   * @param period - The period for which to fetch the data (optional).
   * @param interval - The time interval for the data points (optional).
   * @param pointscount - The number of data points to retrieve (optional).
   * @param pptrLaunchOptions - Options for launching Puppeteer (optional).
   * @returns A promise that resolves to an array of historical data points.
   */
  export function investing(
    input: string,
    period?: Period,
    interval?: Interval,
    pointscount?: PointsCount,
  ): Promise<InvestmentData>;

  export function getHistoricalData(
    params: GetHistoricalDataParams
  ): Promise<InvestmentData[]>;
}
