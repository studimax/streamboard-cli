#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PluginBuilder_1 = __importDefault(require("../lib/PluginBuilder"));
try {
    const builder = new PluginBuilder_1.default(process.cwd(), process.cwd());
    builder.compile();
    console.log("Build success !");
}
catch (e) {
    console.error("ERROR");
    console.error(e?.message);
}
//# sourceMappingURL=index.js.map