#!/usr/bin/env node

import PluginBuilder from "../lib/PluginBuilder";

const builder = new PluginBuilder(process.cwd(), process.cwd());
builder.run().then(() => {
    console.log("Build success !")
}).catch(reason => {
    console.error("ERROR");
    console.error(reason?.message);
})
