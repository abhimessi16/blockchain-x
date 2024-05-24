import { Balance } from "../models"

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
}