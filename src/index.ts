#!/usr/bin/env node

import * as fs from "fs"
import * as path from "path"
import { Account, Balance, State, Tx, isReward } from "./models"

import { program } from "commander"
import { createHash } from "crypto"

const genFilePath = path.join(__dirname, "../src", "database", "genesis.json")
const txDbFilePath = path.join(__dirname, "../src", "database", "tx.db")


const newStateFromDisk = () => {

    const gen = JSON.parse(fs.readFileSync(genFilePath).toString())
    const balances: Balance = gen.balances

    const state: State = {
        Balances: balances,
        txMempool: [],
        snapshot: '',
        dbFile: txDbFilePath
    }

    const txDb = fs.readFileSync(txDbFilePath)

    if(txDb.toString().length === 0){
        return state
    }
    const txs = txDb.toString().split("\n")

    txs.slice(0, txs.length - 1).forEach(tx => {
        const newTx: Tx = JSON.parse(tx)
        apply(state, newTx)
    })

    doSnapshot(state)
    return state
}

const AddTx = (state: State, tx: Tx) => {

    if(apply(state, tx) !== null){
        return "error"
    }

    state.txMempool.push(tx)
}

const apply = (state: State, tx: Tx) => {

    if(!(tx.From in state.Balances))
        state.Balances[tx.From] = 0

    if(!(tx.To in state.Balances))
        state.Balances[tx.To] = 0
    
    if(isReward(tx)){
        state.Balances[tx.To] += tx.Value
        
        return null
    }
    
    if(state.Balances[tx.From] < tx.Value){
        console.log('coming here');
        
        return "insufficient balance"
    }    
    
    state.Balances[tx.From] -= tx.Value
    state.Balances[tx.To] += tx.Value
    
    return null
}

const doSnapshot = (state: State) => {
    const txDb = fs.readFileSync(txDbFilePath)
    state.snapshot = createHash('sha256').update(txDb.toString()).digest('hex')
}

const persistTxToDb = (state: State) => {
    const mempool: Tx[] = state.txMempool
    const txDb = fs.openSync(txDbFilePath, 'a')

    mempool.forEach(tx => {
        fs.appendFileSync(txDb, `${JSON.stringify(tx)}\n`)

        state.txMempool = state.txMempool.slice(1)
        doSnapshot(state)
    })
    return state.snapshot
}

const balancesList = () => {
    const state: State = newStateFromDisk()

    console.log('Account balances:');
    console.log('-----------------');
    
    Object.keys(state.Balances).forEach(key => {
        console.log(`${key}: ${state.Balances[key]}`);
        
    })
    console.log(state.snapshot)
}

program.version("1.0.0").description("CLI for Simple Blockchain")

const tx = program.command('tx')
tx.requiredOption('-f, --from <string>', 'Enter From Account')
.requiredOption('-t, --to <string>', "Enter To Account")
.requiredOption('-v, --value <number>', "Enter sum to transfer")
.option('-d, --data <string>', "Enter Data")
.action((options) => {
    const state: State = newStateFromDisk()
    
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
    const snapshot = persistTxToDb(state)
    console.log(snapshot)
})

const balances = program.command('balances')
balances.command('list')
.action(balancesList)

program.parse(process.argv)