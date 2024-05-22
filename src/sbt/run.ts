import { createCommand } from "commander";

import server from "../server/node";

const runServer = () => {
    server.listen(8080, () => {
        console.log("server started on port 8080");
    })
}

export const run = createCommand("run")
.action(runServer)
