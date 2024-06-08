import { XPeerNode, XNode, State } from "../models";
import { xNode, state } from "../sbt/run";
import { StateResponse } from "../server/Responses";

const API_URL = "/api/v1"
const PEER_STATUS_ENDPOINT = "/node/status"

export function newNode(dataDir: string, port: number, bootstrap: XPeerNode, state: State): XNode {
    return {
        dataDir: dataDir,
        port: port,
        state: state,
        knownPeers: {}
    }
}

export const fetchNewBlocksAndPeers = () => {
    
    Object.keys(xNode.knownPeers).forEach(async (peer) => {
        console.log(peer);
        
        const peerStatus = await queryPeerStatus(peer)
        console.log(peerStatus, 'here');

        const localBlockHeight = state.latestBlock.header.height
        let newBlocksCount = 0

        if(localBlockHeight < peerStatus.block_height){
            newBlocksCount = peerStatus.block_height - localBlockHeight
            console.log(`New blocks found, count: ${newBlocksCount}`);
        }

        Object.keys(peerStatus.peers_known).forEach((peer) => {
            const existingPeer = peer in xNode.knownPeers
            if(!existingPeer){
                console.log(`Found new peer, ${peer}`);
                xNode.knownPeers[peer] = peerStatus.peers_known[peer]
            }
        })

    })
}

const queryPeerStatus = async (peer: string) => {
    const url = `http://${peer}${API_URL}${PEER_STATUS_ENDPOINT}`

    const stateResponse = fetch(url)
    .then(resp => resp.json() as Promise<StateResponse>)
    
    return stateResponse
}