import * as fs from "fs"

var genesisJson = {
    "genesis_time": "2024-05-13T06:01:00.000000000Z",
    "chain_id": "the-blockchain-for-clusters",
    "balances": {
        "andrej": 1000000
    }
}

export function writeGenesisToDisk(genFilePath: string) {
    const fd = fs.openSync(genFilePath, "w")
    fs.writeFileSync(fd, JSON.stringify(genesisJson))
}