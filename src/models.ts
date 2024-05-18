export type Account = string
export type Hash = string

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
    balances: Balance
    txMempool: Tx[]
    latestBlockHash: Hash

    dbFile: string
}

export type Block = {
    header: BlockHeader
    txs: Tx[]
}

export type BlockHeader = {
    parent: Hash
    time: number
}

export type BlockFS = {
    hash: Hash
    block: Block
}