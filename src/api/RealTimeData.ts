import WebSocket from 'isomorphic-ws'
import EventEmitter from 'eventemitter3'

const WEBSOCKET_BASE_URL = 'wss://streaming.forexpros.com/echo'
const HEARTBEAT_INTERVAL = 5 * 1000

type Message = {
        message: string
    }

type PidInfo = {
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

const parsePid = (pidInfo: PidInfo) => ({
        pid: parseInt(pidInfo.pid),
        last_dir: pidInfo.last_dir,
        last_numeric: pidInfo.last_numeric,
        bid: parseFloat(pidInfo.bid),
        ask: parseFloat(pidInfo.bid),
        high: parseFloat(pidInfo.high.replace(',', '')),
        low: parseFloat(pidInfo.low.replace(',', '')),
        last_close: parseFloat(pidInfo.last_close.replace(',', '')),
        pc: parseFloat(pidInfo.pc.replace(',', '')),
        pcp: pidInfo.pcp,
        pc_col: pidInfo.pc_col, // TODO Da eliminare. Ricavabile dal segno di pc
        turnover: pidInfo.turnover,
        turnover_numeric: pidInfo.turnover_numeric,
        time: pidInfo.time, // TODO Da eliminare -> ricavabile da timestamp
        timestamp: pidInfo.timestamp,
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

export class RealTimeData extends EventEmitter {
    private readonly url: string = `${WEBSOCKET_BASE_URL}/${getServer()}/${getSessionId()}/websocket`
    private ws: WebSocket = new WebSocket(this.url)
    private heartbeatInterval: NodeJS.Timeout
    
    constructor() {
        super()
        this.ws.onopen = this.onOpenHandler.bind(this);        
        this.ws.onclose = this.oncloseHandler.bind(this);
        this.ws.onmessage = this.onmessageHandler.bind(this);
    }

    private onOpenHandler() {
        this.emit('open')
        this.startHeartbeat();
      };

    private oncloseHandler() {
        this.emit('close')
        this.stopHeartbeat();
    };

    private onmessageHandler(data: WebSocket.MessageEvent) {
        try {
            const message = JSON.parse(JSON.parse(data.data.toString().slice(1))[0]) as Message// TODO: support multiple messages
            if (message.message != null) {
                for (const match of message.message.matchAll(/{.*}/g)) {
                    const pidInfo = JSON.parse(match[0]) as PidInfo
                    this.emit('data', parsePid(pidInfo))
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

    public subscribe(pairIds: number[]) {
        this.ws.send(JSON.stringify({
            _event: "bulk-subscribe",
            tzID: 8,
            message: pairIds
                .map(pairId => `pid-${pairId}:`)
                .join('%%')
        }))
    }

    public close(): void {
        this.stopHeartbeat()
        this.ws.close()
    }
}