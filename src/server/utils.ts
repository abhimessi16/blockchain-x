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
    return Object.keys(jsonBody).includes('datadir')
}