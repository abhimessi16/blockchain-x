import * as path from "path"
import * as fs from "fs"
import { writeGenesisToDisk } from "./genesis"

export function getDatabaseDirPath(dataDir: string) {
    return path.join(dataDir, "database")
}

export function getGenesisJsonFilePath(dataDir: string) {
    return path.join(getDatabaseDirPath(dataDir), "genesis.json")
}

export function getBlocksDbFilePath(dataDir: string) {
    return path.join(getDatabaseDirPath(dataDir), "block.db")
}

export function initDataDirIfNotExists(dataDir: string) {
    if(fs.existsSync(getGenesisJsonFilePath(dataDir))){
        return
    }

    const dbDir = getDatabaseDirPath(dataDir)
    if(!fs.existsSync(dbDir)){
        fs.mkdirSync(dbDir)
    }

    const genFilePath = getGenesisJsonFilePath(dataDir)
    writeGenesisToDisk(genFilePath)

    const blocksDbPath = getBlocksDbFilePath(dataDir)
    createEmptyBlocksDb(blocksDbPath)

}

function createEmptyBlocksDb(blocksDbPath: string) {
    fs.open(blocksDbPath, "r", (err, _) => {
        if(err)
            return err
    })
}