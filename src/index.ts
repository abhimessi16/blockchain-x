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

    const txDb = fs.readFileSync(txDbFilePath).toString().split("\n")

    txDb.forEach(tx => {
        const newTx: Tx = JSON.parse(tx)
        state.txMempool.push(newTx)
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
    const mempool: Tx[] = [{"From": "abhilas", "To": "geetha", "Value": 1000, "Data": ""}]
    const txDb = fs.openSync(txDbFilePath, 'a')

    mempool.forEach(tx => {
        fs.appendFileSync(txDb, `\n${JSON.stringify(tx)}`)

        state.txMempool = state.txMempool.slice(1)
    })

}

program.version("1.0.0").description("CLI for Simple Blockchain")

const tx = program.command('tx')
tx.option('-f, --from <string>', 'Enter From Account')
.option('-t, --to <string>', "Enter To Account")
.action((options) => {
    console.log(options)
})

program.parse(process.argv)

const options = program.opts()

console.log(program.args);