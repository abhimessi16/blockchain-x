import { Balance, XPeerNode } from "../models"

export type BasicResponse = {
    [key: string]: string
}

export type BalanceResponse = {
    hash: string
    balances: Balance
}

export type StateResponse = {
    block_hash: string
    block_height: number
    peers_known: {
        [key: string]: XPeerNode
    }
}