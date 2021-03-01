import PluginBuilder from "../src/lib/PluginBuilder";
import * as path from "path";

describe("PluginBuilder", () => {
    it("builder run", done => {
        const builder = new PluginBuilder(path.resolve(__dirname, "plugin"), path.resolve(__dirname, "plugin"));
        builder.run()
            .then(() => {
                done();
            })
            .catch(reason => {
                done(reason?.message);
            });
    })
})
