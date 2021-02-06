import fs from "fs-extra";
import path from "path";

export default class PluginCreate {
    constructor(private readonly pluginName: string, private readonly targetDir: string) {
    }

    public run() {
        this.mkdir();
        this.mkdir("assets");
        console.log(this.pluginName);
        console.log(this.targetDir);
    }

    private mkdir(dirPath = ".") {
        const p = path.resolve(this.targetDir, dirPath);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }

}
