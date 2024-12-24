import WebSocket from 'isomorphic-ws'
import EventEmitter from 'eventemitter3'

const WEBSOCKET_BASE_URL = 'wss://streaming.forexpros.com/echo'
const HEARTBEAT_INTERVAL = 5 * 1000

type Message = {
        message: string
    }

type PidInfoResponse = {
    pid:              string;
    last_dir:         "greenBg" | "redBg";
    last_numeric:     number;
    last:             string;
    bid:              string;
    ask:              string;
    high:             string;
    low:              string;
    last_close:       string;
    pc:               string;
    pcp:              "greenFont" | "redFont";
    pc_col:           string;
    turnover:         string;
    turnover_numeric: number;
    time:             string;
    timestamp:        number;
}

export type PidInfo = {
    pid:              number;
    last_dir:         "greenBg" | "redBg";
    last:             number;
    bid:              number;
    ask:              number;
    high:             number;
    low:              number;
    last_close:       number;
    pc:               number;
    pcp:              "greenFont" | "redFont";
    turnover:         number;
    timestamp:        number;
}

const parsePid = (pidInfo: PidInfoResponse): PidInfo => ({
        pid: parseInt(pidInfo.pid),
        last_dir: pidInfo.last_dir,
        last: pidInfo.last_numeric,
        bid: parseFloat(pidInfo.bid.replace(',', '')),
        ask: parseFloat(pidInfo.ask.replace(',', '')),
        high: parseFloat(pidInfo.high.replace(',', '')),
        low: parseFloat(pidInfo.low.replace(',', '')),
        last_close: parseFloat(pidInfo.last_close.replace(',', '')),
        pc: parseFloat(pidInfo.pc.replace(',', '')),
        pcp: pidInfo.pcp,
        turnover: pidInfo.turnover_numeric,
        timestamp: pidInfo.timestamp * 1000,
})

const getServer = (): number =>  Math.floor(Math.random() * 1000)
const getSessionId = (): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz012345';
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

/**
 * A class that allows you to receive real-time data from the ForexPro websocket (used by `investing.com`).
 * 
 * @example
 * ```ts
 * import { RealTimeData, PidInfo } from "investing-com-api";
 * const realTimeData = new RealTimeData();
 * realTimeData.on(RealTimeData.ON_OPEN, () => {
 *    realTimeData.subscribe([1057391]);
 * });
 * 
 * realTimeData.on(RealTimeData.ON_DATA, (data: PidInfo) => {
 *   console.log(data);
 * })
 * ```
 * @beta
 */

export class RealTimeData extends EventEmitter {
    /**
     * @event
     * Emitted when the websocket connection is opened.
    */
    static readonly ON_OPEN: string = "open";
    /**
     * @event
     * Emitted when new data is received.
     * @param data - The data received.
    */
    static readonly ON_DATA: string = "data";
    /**
     * @event
     * Emitted when the websocket connection is closed.
    */
    static readonly ON_CLOSE: string = "close";
    /**
     * @event
     * Emitted when an error occurs.
     * @param event - The error event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onerror
    **/
    static readonly ON_ERROR: string = "error";
    private readonly url: string = `${WEBSOCKET_BASE_URL}/${getServer()}/${getSessionId()}/websocket`
    private ws: WebSocket = new WebSocket(this.url)
    private heartbeatInterval: NodeJS.Timeout
    
    constructor() {
        super()
        this.ws.onopen = this.onOpenHandler.bind(this);        
        this.ws.onclose = this.oncloseHandler.bind(this);
        this.ws.onmessage = this.onmessageHandler.bind(this);
        this.ws.onerror = this.onerrorHandler.bind(this);
    }

    private onOpenHandler() {
        this.emit(RealTimeData.ON_OPEN)
        this.startHeartbeat();
      };

    private oncloseHandler() {
        this.emit(RealTimeData.ON_CLOSE)
        this.stopHeartbeat();
    };

    private onerrorHandler(event: WebSocket.ErrorEvent) {
        this.emit(RealTimeData.ON_ERROR, event)
        this.stopHeartbeat();
    }

    private onmessageHandler(data: WebSocket.MessageEvent) {
        try {
            const message = JSON.parse(JSON.parse(data.data.toString().slice(1))[0]) as Message// TODO: support multiple messages
            if (message.message != null) {
                for (const match of message.message.matchAll(/{.*}/g)) {
                    const pidInfo = JSON.parse(match[0]) as PidInfoResponse
                    this.emit(RealTimeData.ON_DATA, parsePid(pidInfo))
                }                        
            }

        } catch (error) {}
      };

    private startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.ws.send(JSON.stringify({
                 _event: "heartbeat", 
                 data: "h"
            }));
        }, HEARTBEAT_INTERVAL);
    }

    private stopHeartbeat() {
        if(!this.heartbeatInterval) return
        clearInterval(this.heartbeatInterval)
        this.heartbeatInterval = null
    }

    /**
     * Subscribe to a list of pair ids. You can find the pair id using the `searchQuotes` function. Call this function after the `open` event is emitted.
     * 
     * @example
     * ```
     * realTimeData.subscribe([1057391])
     * ```
     * 
     * @param pairIds - The pair ids to subscribe to.
     */
    public subscribe(pairIds: number[]): void {
        this.ws.send(JSON.stringify({
            _event: "bulk-subscribe",
            tzID: 8,
            message: pairIds
                .map(pairId => `pid-${pairId}:`)
                .join('%%')
        }))
    }

    /**
     * Close the websocket connection. After calling this method, the `close` event will be emitted.
     * 
     * Usage:
     * ```ts
     * realTimeData.close()
     * ```
     */
    public close(): void {
        this.stopHeartbeat()
        this.ws.close()
    }
}