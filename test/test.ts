import PluginBuilder from "../src/lib/PluginBuilder";
import * as path from "path";
const builder = new PluginBuilder(path.resolve(__dirname, "plugin"), __dirname);
builder.run()
    .then(() => {
        console.log("Build success !")
    })
    .catch(reason => {
        console.error("ERROR");
        console.error(reason?.message);
    })
