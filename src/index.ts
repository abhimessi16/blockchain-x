#!/usr/bin/env node

import * as fs from "fs"
import * as path from "path"
import { Account, Balance, State, Tx, isReward } from "./models"
import { program } from "commander"

const genFilePath = path.join(__dirname, "../src", "database", "genesis.json")
const txDbFilePath = path.join(__dirname, "../src", "database", "tx.db")


const newStateFromDisk = () => {

    const gen = JSON.parse(fs.readFileSync(genFilePath).toString())
    const balances: Balance = gen.balances

    const state: State = {
        Balances: balances,
        txMempool: [],
        dbFile: txDbFilePath
    }

    const txDb = fs.readFileSync(txDbFilePath)

    if(txDb.toString().length === 0){
        return state
    }
    const txs = txDb.toString().split("\n")

    txs.slice(0, txs.length - 1).forEach(tx => {
        const newTx: Tx = JSON.parse(tx)
    })

    return state
}

const AddTx = (state: State, tx: Tx) => {
    if(apply(state, tx) !== null){
        return "error"
    }

    state.txMempool.push(tx)
}

const apply = (state: State, tx: Tx) => {
    if(isReward(tx)){
        state.Balances[tx.To] += tx.Value
        return null
    }

    if(state.Balances[tx.From] < tx.Value){
        return "insufficient balance"
    }

    state.Balances[tx.From] -= tx.Value
    state.Balances[tx.To] += tx.Value

    return null
}

const persistTxToDb = (state: State) => {
    const mempool: Tx[] = state.txMempool
    const txDb = fs.openSync(txDbFilePath, 'a')

    mempool.forEach(tx => {
        fs.appendFileSync(txDb, `${JSON.stringify(tx)}\n`)

        state.txMempool = state.txMempool.slice(1)
    })

}

program.version("1.0.0").description("CLI for Simple Blockchain")
const state: State = newStateFromDisk()

const tx = program.command('tx')
tx.requiredOption('-f, --from <string>', 'Enter From Account')
.requiredOption('-t, --to <string>', "Enter To Account")
.requiredOption('-v, --value <number>', "Enter sum to transfer")
.option('-d, --data <string>', "Enter Data")
.action((options) => {
    const newTx: Tx = options
    AddTx(state, newTx)
    persistTxToDb(state)
})

program.parse(process.argv)

const options = program.opts()

console.log(program.args);