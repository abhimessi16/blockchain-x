import { Block, Tx } from "./models"
import { createHash } from "crypto"

export function isReward(tx: Tx){
    return tx.Data === "reward"
}

export function blockHash(block: Block){
    const blockString = JSON.stringify(block)
    return createHash('sha256').update(blockString).digest('hex')
}

export function getTime(){
    return Math.floor(Date.now() / 1000)
}