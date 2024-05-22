import { State, Block } from "../models"
import { newStateFromDisk } from "../services/common"
import { getTime } from "../utils"
import { AddBlock, persistToDb } from "../services/common"

import { createCommand } from "commander"

const migrate = (options: any) => {
    const state: State = newStateFromDisk(options.datadir)

    const block0: Block = {
        header: {
            parent: state.latestBlockHash,
            time: getTime()
        },
        txs: [
            {From: 'andrej', To: 'andrej', Value: 3, Data: ""},
            {From: 'andrej', To: 'andrej', Value: 700, Data: "reward"}
        ]
    }

    AddBlock(state, block0)
    console.log(persistToDb(state))

    const block1: Block = {
        header: {
            parent: state.latestBlockHash,
            time: getTime()
        },
        txs: [
            {From: 'andrej', To: 'babayaga', Value: 2000, Data: ""},
            {From: 'andrej', To: 'andrej', Value: 100, Data: "reward"},
            {From: 'babayaga', To: 'andrej', Value: 1, Data: ""},
            {From: 'babayaga', To: 'caesar', Value: 1000, Data: ""},
            {From: 'babayaga', To: 'andrej', Value: 50, Data: ""},
            {From: 'andrej', To: 'andrej', Value: 600, Data: "reward"},

        ]
    }

    AddBlock(state, block1)
    console.log(persistToDb(state));
    
}

const sbt_migrate = createCommand('migrate')
.requiredOption('--datadir <string>', "Enter Absolute path to all the data.")
.action(migrate)

export default sbt_migrate