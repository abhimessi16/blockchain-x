import { XPeerNode, XNode, State } from "../models";


export function newNode(dataDir: string, port: number, bootstrap: XPeerNode, state: State): XNode {
    return {
        dataDir: dataDir,
        port: port,
        state: state,
        knownPeers: []
    }
}