import * as http from "http"
import { BalanceResponse, BasicResponse } from "./Responses"
import { AddBlock, createBlock, newStateFromDisk, persistToDb } from "../services/common"
import { Tx } from "../models"
import { checkBodyContainsDataDir, checkBodyContainsTx } from "./utils"
import { blockHash } from "../utils"

const API_URL = '/api/v1'

const server = http.createServer((req, res) => {

    if(req.url === `${API_URL}/balances/list` && req.method === 'POST'){

        req.once("readable", () => {
            let reqBuffer = ""
            let buf;
            while((buf = req.read()) !== null){
                reqBuffer += buf
            }

            const jsonBody = JSON.parse(reqBuffer)

            if(!checkBodyContainsDataDir){
                let resPayload: BasicResponse = {}
                resPayload["error"] = "Please provide location of data."
                res.write(JSON.stringify(resPayload));
            }else{
                const dataDir = jsonBody.datadir
                const state = newStateFromDisk(dataDir)
                let resPayload: BalanceResponse = {
                    hash: blockHash(state.latestBlock),
                    balances: state.balances
                }
                res.write(JSON.stringify(resPayload))
            }
            res.end()
        })
    }else if(req.url === `${API_URL}/tx/add` && req.method === 'POST'){

        req.once("readable", () => {

            let reqBuffer = ""
            let buf;

            while((buf = req.read()) !== null){
                reqBuffer += buf
            }

            const jsonBody = JSON.parse(reqBuffer)

            let resPayload: BasicResponse = {}

            if(checkBodyContainsTx(jsonBody) && checkBodyContainsDataDir(jsonBody)){
                
                const dataDir = jsonBody.datadir
                const tx: Tx = {
                    From: jsonBody.from,
                    To: jsonBody.to,
                    Value: jsonBody.value,
                    Data: jsonBody.data
                }

                const state = newStateFromDisk(dataDir)
                const block = createBlock(state, [tx])
                AddBlock(state, block)
                const hash = persistToDb(state)

                resPayload["status"] = "Pass"
                resPayload["message"] = "Tx added to disk!"
                resPayload["block_hash"] = hash

                res.write(JSON.stringify(resPayload))
            }else{
                resPayload["status"] = "Fail"
                resPayload["message"] = "Please provide all required parameters"

                res.write(JSON.stringify(resPayload))
            }
            res.end()

        })
    }
})

export default server
