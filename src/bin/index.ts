#!/usr/bin/env node

import PluginBuilder from "../lib/PluginBuilder";

try {
    const builder = new PluginBuilder(process.cwd(), process.cwd());
    builder.compile();
    console.log("Build success !")
} catch (e) {
    console.error("ERROR");
    console.error(e?.message);
}
