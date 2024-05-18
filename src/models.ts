export type Account = string

export type Tx = {
    From: string
    To: string
    Value: number
    Data: string
}

export type Balance = {
    [account: Account]: number
}

export type State = {
    Balances: Balance
    txMempool: Tx[]
    snapshot: string

    dbFile: string
}

export function isReward(tx: Tx){
    return tx.Data === "reward"
}