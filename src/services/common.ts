import * as fs from "fs"
import * as path from "path"

import { isReward, blockHash, getTime } from "../utils"
import { Balance, State, BlockFS, Block, Tx, BlockHeader } from "../models"
import { getBlocksDbFilePath, getGenesisJsonFilePath, initDataDirIfNotExists } from "../database/fs"

export const newStateFromDisk = (dataDir: string) => {

    initDataDirIfNotExists(dataDir)

    const genFilePath = getGenesisJsonFilePath(dataDir)
    const blockDbFilePath = getBlocksDbFilePath(dataDir)

    const gen = JSON.parse(fs.readFileSync(genFilePath).toString())
    const balances: Balance = gen.balances

    const state: State = {
        balances: balances,
        txMempool: [],
        latestBlockHash: '',
        dbFile: dataDir
    }

    const blockDb = fs.readFileSync(blockDbFilePath)

    if(blockDb.toString().length === 0){
        return state
    }
    const blocks = blockDb.toString().split("\n")

    blocks.slice(0, blocks.length - 1).forEach(block => {
        const block1: BlockFS = JSON.parse(block)
        AddBlock(state, block1.block)
        state.latestBlockHash = blockHash(block1.block)
    })

    state.txMempool = []
    
    return state
}

export const createBlock = (state: State, txs: Tx[]) => {
    const header: BlockHeader = {
        parent: state.latestBlockHash,
        time: getTime()
    }
    const block: Block = {
        header: header,
        txs: txs
    }
    return block
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
        return "insufficient balance"
    }    
    
    state.balances[tx.From] -= tx.Value
    state.balances[tx.To] += tx.Value
    
    return null
}

export const persistToDb = (state: State) => {

    const blockDbFilePath = getBlocksDbFilePath(state.dbFile)
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

    state.txMempool = []

    return state.latestBlockHash
}