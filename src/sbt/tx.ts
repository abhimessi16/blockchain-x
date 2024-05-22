import { State, Tx } from "../models"
import { AddTx, newStateFromDisk, persistToDb } from "../services/common"

import { createCommand } from "commander"

const txAdd = (options: any) => {
    const state: State = newStateFromDisk(options.dataDir)
    
    if(isNaN(options.value)){
        return
    }

    const newTx: Tx = {
        From: options.from,
        To: options.to,
        Value: Number(options.value),
        Data: options.data
    }
    AddTx(state, newTx)
    const latestBlockHash = persistToDb(state)
    console.log(latestBlockHash)
}

const tx = createCommand('tx')
tx.requiredOption('-f, --from <string>', 'Enter From Account')
.requiredOption('-t, --to <string>', "Enter To Account")
.requiredOption('-v, --value <number>', "Enter sum to transfer")
.option('-d, --data <string>', "Enter Data")
.action(txAdd)

export default tx