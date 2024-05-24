import * as http from "http"

import { BalanceResponse, BasicResponse, StateResponse } from "./Responses"
import { AddBlock, createBlock, newStateFromDisk, persistToDb } from "../services/common"
import { Tx } from "../models"
import { checkBodyContainsDataDir, checkBodyContainsTx, getIpAddress } from "./utils"
import { blockHash } from "../utils"
import { xNode, state } from "../sbt/run"

const API_URL = '/api/v1'

const server = http.createServer((req, res) => {

    if(!checkBodyContainsDataDir(xNode)){

        let resPayload: BasicResponse = {}
        resPayload["error"] = "Please provide location of data."
        res.write(JSON.stringify(resPayload));
        res.end()

    }else {

        if(req.url === `${API_URL}/balances/list` && req.method === 'GET'){
            req.once("readable", () => {
                let reqBuffer = ""
                let buf;
                while((buf = req.read()) !== null){
                    reqBuffer += buf
                }

                let resPayload: BalanceResponse = {
                    hash: blockHash(state.latestBlock),
                    balances: state.balances
                }
                res.write(JSON.stringify(resPayload))
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

                if(checkBodyContainsTx(jsonBody)){
                    
                    const tx: Tx = {
                        From: jsonBody.from,
                        To: jsonBody.to,
                        Value: jsonBody.value,
                        Data: jsonBody.data
                    }

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
        }else if(req.url === `${API_URL}/node/status` && req.method === 'GET'){
            req.once("readable", () => {

                let resBuffer = ""
                let buf;

                while((buf = req.read()) !== null){
                    resBuffer += buf
                }

                const resPayload: StateResponse = {
                    block_hash: blockHash(state.latestBlock),
                    block_height: state.latestBlock.header.height
                }
                res.write(JSON.stringify(resPayload))
                res.end()

            })
        }else if(req.url === `${API_URL}/test` && req.method === 'GET'){
            res.write(JSON.stringify(xNode))
            res.end()
        }else{
            const resPayload: BasicResponse = {
                "message": "invalid endpoint/method"
            }
            res.write(JSON.stringify(resPayload))
            res.end()
        }
    }
})

export default server
