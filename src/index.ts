#!/usr/bin/env node

import sbt_migrate from "./sbt/migrate"
import balances from "./sbt/balances"
import tx from "./sbt/tx"

import { program } from "commander"

program.version("1.0.0").description("CLI for Simple Blockchain")

program.addCommand(tx)
program.addCommand(balances)
program.addCommand(sbt_migrate)
.requiredOption('--datadir <string>', "Enter Absolute path to all the data.")

program.parse(process.argv)
console.log(program.opts(), ' coming here')
export default program