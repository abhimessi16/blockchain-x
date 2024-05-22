import * as fs from "fs"

var genesisJson = {
    "genesis_time": Date.now().toString(),
    "chain_id": "the-blockchain-for-clusters",
    "balances": {
        "andrej": 1000000
    }
}

export function writeGenesisToDisk(genFilePath: string) {
    const fd = fs.openSync(genFilePath, "w")
    fs.writeFileSync(fd, JSON.stringify(genesisJson))
}