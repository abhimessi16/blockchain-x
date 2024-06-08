import { createCommand } from "commander";

import server from "../server/node";
import { State, XNode, XPeerNode } from "../models";
import { getIpAddress, getTCPAddress } from "../server/utils";
import { newStateFromDisk } from "../services/common";

const DefaultHttpPort = 8080

const bootstrap: XPeerNode = {
    ip: getIpAddress(),
    port: DefaultHttpPort,
    isBootstrap: true,
    isActive: true
}

export const xNode: XNode = <XNode>{}
export const state: State = <State>{}

const runServer = async (options: any) => {

    const dataDir: string = options.datadir
    const port: number = options.port

    xNode.dataDir = dataDir
    xNode.port = port
    xNode.knownPeers = {
        [getTCPAddress(bootstrap)]: bootstrap
    }

    Object.assign(state, newStateFromDisk(xNode.dataDir))

    
    
    server.listen(DefaultHttpPort)
}

export const run = createCommand("run")
.requiredOption('--datadir <string>', "Enter Absolute path to all the data.")
.option("-p, --port <number>", "Enter port number.")
.action(runServer)
