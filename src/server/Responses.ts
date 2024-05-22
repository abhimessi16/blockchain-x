import { Balance } from "../models"

export type BasicResponse = {
    [key: string]: string
}

export type BalanceResponse = {
    hash: string
    balances: Balance
}