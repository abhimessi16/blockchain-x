import * as os from "os"
import { XPeerNode } from "../models"

export function checkBodyContainsTx(jsonBody: any){
    const keys = Object.keys(jsonBody)
    if(!keys.includes('from')){
        return false
    }else if(!keys.includes('to')){
        return false
    }else if(!keys.includes('value')){
        return false
    }
    return true
}

export function checkBodyContainsDataDir(jsonBody: any){
    return Object.keys(jsonBody).includes('dataDir')
}

export function getIpAddress() {

    const netInterfaces = os.networkInterfaces()
    
    for(let name in netInterfaces){
        let iface = netInterfaces[name]
        if(iface === undefined)
            continue
        for(let i = 0; i < iface.length; i++){
            let alias = iface[i]
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address
        }
    }
    return '0.0.0.0'
}

export function getTCPAddress(peer: XPeerNode) {
    return `${peer.ip}:${peer.port}`
}