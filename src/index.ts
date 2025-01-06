import { RealTimeData, PidInfo } from "./api/RealTimeData";
import getHistoricalData from "./getHistoricalData";
// export { PidInfo } from "./api/RealTimeData";

const a : PidInfo = null

console.log(a)

export {
    PidInfo
}

// export {
//     // APIs
//     getHistoricalData,
//     RealTimeData,

//     // Types
//     PidInfo
// }

// const realTimeData = new RealTimeData();
// realTimeData.on(RealTimeData.ON_OPEN, () => {
//     realTimeData.subscribe([
//         // 1057391, // 
//         1061443
//     ]);
// });

// realTimeData.on(RealTimeData.ON_DATA, (data: PidInfo) => {
//     console.log(data);
// })

// realTimeData.on(RealTimeData.ON_CLOSE, () => {
//     console.log('closed');
// })