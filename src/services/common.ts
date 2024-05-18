import * as fs from "fs"
import * as path from "path"

import { isReward, blockHash, getTime } from "../utils"
import { Balance, State, BlockFS, Block, Tx } from "../models"

const genFilePath = path.join(__dirname, "../../src", "database", "genesis.json")
const txDbFilePath = path.join(__dirname, "../../src", "database", "tx.db")
const blockDbFilePath = path.join(__dirname, "../../src", "database", "block.db")

export const newStateFromDisk = () => {

    const gen = JSON.parse(fs.readFileSync(genFilePath).toString())
    const balances: Balance = gen.balances

    const state: State = {
        balances: balances,
        txMempool: [],
        latestBlockHash: '',
        dbFile: txDbFilePath
    }

    const blockDb = fs.readFileSync(blockDbFilePath)

    if(blockDb.toString().length === 0){
        return state
    }
    const blocks = blockDb.toString().split("\n")

    blocks.slice(0, blocks.length - 1).forEach(block => {
        const block1: BlockFS = JSON.parse(block)
        AddBlock(state, block1.block)
    })

    persistToDb(state)
    
    return state
}

export const AddBlock = (state: State, block: Block) => {

    block.txs.forEach(tx => {
        AddTx(state, tx)
    })
}

export const AddTx = (state: State, tx: Tx) => {

    if(apply(state, tx) !== null){
        return "error"
    }

    state.txMempool.push(tx)
}

export const apply = (state: State, tx: Tx) => {

    if(!(tx.From in state.balances))
        state.balances[tx.From] = 0

    if(!(tx.To in state.balances))
        state.balances[tx.To] = 0
    
    if(isReward(tx)){
        state.balances[tx.To] += tx.Value
        
        return null
    }
    
    if(state.balances[tx.From] < tx.Value){
        console.log('coming here');
        
        return "insufficient balance"
    }    
    
    state.balances[tx.From] -= tx.Value
    state.balances[tx.To] += tx.Value
    
    return null
}

export const persistToDb = (state: State) => {

    const blockDb = fs.openSync(blockDbFilePath, 'a')

    const block: Block = {
        header: {
            parent: state.latestBlockHash,
            time: getTime()
        },
        txs: state.txMempool
    }

    const hash: string = blockHash(block)
    state.latestBlockHash = hash

    const blockFS: BlockFS = {
        hash: hash,
        block: block
    }

    fs.appendFileSync(blockDb, `${JSON.stringify(blockFS)}\n`)
    console.log("adding new block");
    console.log(blockFS);

    state.txMempool = []

    return state.latestBlockHash
}