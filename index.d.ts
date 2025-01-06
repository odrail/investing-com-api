declare module "investing-com-api" {

  export const enum Resolution {
    FIVE_MINUTES = '5',
    FIFTEEN_MINUTES = '15',
    HOURLY = '60',
    FIVE_HOUR = '300',
    DAILY = 'D',
    WEEKLY = 'W',
    MONTHLY = 'M'
  }

  export interface GetHistoricalDataParams {
    pairId: PairId,
    resolution?: Resolution,
    from: Date,
    to: Date
  }

  export type PairId = number
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

  export function getHistoricalData(
    params: GetHistoricalDataParams
  ): Promise<InvestmentData[]>;

  export type SearchQuoteResponse = {
    pairId:      number;
    url:         string;
    description: string;
    symbol:      string;
    exchange:    string;
    flag:        string;
    type:        string;
  }

  export function searchQuotes(search: string): Promise<SearchQuoteResponse[]>
}
