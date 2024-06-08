import { xNode } from "../sbt/run"
import { fetchNewBlocksAndPeers } from "../services/peers"

const delay = 45000

export function sync() {
    const syncAlg = setInterval(fetchNewBlocksAndPeers, delay)
    return syncAlg
}