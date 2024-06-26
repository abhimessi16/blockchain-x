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
    latestBlock: Block
    latestBlockHash: Hash

    dataDir: string
}

export type Block = {
    header: BlockHeader
    txs: Tx[]
}

export type BlockHeader = {
    parent: Hash
    height: number
    time: number
}

export type BlockFS = {
    hash: Hash
    block: Block
}

export type XNode = {
    dataDir: string
    port: number

    state: State
    knownPeers: {
        [key: string]: XPeerNode
    }
}

export type XPeerNode = {
    ip: string
    port: number
    isBootstrap: boolean
    isActive: boolean
}