import { State } from "../models";
import { newStateFromDisk } from "../services/common";

import { createCommand } from "commander";

const balancesList = (options: any) => {
    
    const state: State = newStateFromDisk(options.datadir)

    console.log('Account balances:');
    console.log('-----------------');
    
    Object.keys(state.balances).forEach(key => {
        console.log(`${key}: ${state.balances[key]}`);
        
    })
    console.log(state.latestBlockHash)
}

const balances = createCommand('balances')
balances.command('list')
.requiredOption('--datadir <string>', "Enter Absolute path to all the data.")
.action(balancesList)

export default balances
