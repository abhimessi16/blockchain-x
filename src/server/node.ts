import * as http from "http"
import { BalanceResponse, BasicResponse } from "./Responses"
import { AddBlock, createBlock, newStateFromDisk, persistToDb } from "../services/common"
import balances from "../sbt/balances"
import { Tx } from "../models"
import { checkBodyContainsDataDir, checkBodyContainsTx } from "./utils"

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
                res.write(JSON.stringify(resPayload), (err) => console.log(err));
            }else{
                const dataDir = jsonBody.datadir
                const state = newStateFromDisk(dataDir)
                let resPayload: BalanceResponse = {
                    hash: state.latestBlockHash,
                    balances: state.balances
                }
                res.write(JSON.stringify(resPayload), (err) => console.log(err))
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
                persistToDb(state)

                resPayload["status"] = "Pass"
                resPayload["message"] = "Tx added to disk!"

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
