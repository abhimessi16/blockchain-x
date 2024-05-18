import { State } from "../models";
import { newStateFromDisk } from "../services/common";

import { createCommand } from "commander";

const balancesList = () => {
    const state: State = newStateFromDisk()

    console.log('Account balances:');
    console.log('-----------------');
    
    Object.keys(state.balances).forEach(key => {
        console.log(`${key}: ${state.balances[key]}`);
        
    })
    console.log(state.latestBlockHash)
}

const balances = createCommand('balances')
balances.command('list')
.action(balancesList)

export default balances
