#!/usr/bin/env node

import sbt_migrate from "./sbt/migrate"
import balances from "./sbt/balances"
import tx from "./sbt/tx"

import { program } from "commander"
import { run } from "./sbt/run"

program.version("1.0.0").description("CLI for Simple Blockchain")

program.addCommand(tx)
program.addCommand(balances)
program.addCommand(sbt_migrate)
program.addCommand(run)

program.parse(process.argv)
export default program