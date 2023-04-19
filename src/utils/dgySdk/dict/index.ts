import { dictIndex, dictTree, alarmLevelList, dictInit } from './dict.js'
const ready = () => new Promise((resolve:any)=> {
    Promise.all([
        dictInit(),
    ]).then(() => {
        resolve()
    })
})

export {
    dictIndex, dictTree, alarmLevelList,
}
export default {
    dictIndex,
    dictTree,
    alarmLevelList,
    ready
}
