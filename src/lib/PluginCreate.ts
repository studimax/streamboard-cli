import fs from "fs-extra";
import path from "path";
import download from "./GithubDownloader";
import inquirer from "inquirer";
import {cyan, green} from "colors/safe";

export default class PluginCreate {
    constructor(private readonly pluginName: string, private readonly targetDir: string) {
    }

    public async run() {
        this.mkdir();
        await download("studimax/streamboard-simple-plugin", this.targetDir);
        const packageInfo = await fs.readJSON(path.resolve(this.pluginName, "package.json"));
        packageInfo.name = this.pluginName;
        const {identifier} = await inquirer.prompt([{
            name: "identifier",
            type: "input",
            message: `use identifier like ch${cyan("ch.studimax." + this.pluginName)}`,
            default: () => "ch.studimax." + this.pluginName,
            validate: ((input: string) => !!input.match("^[a-z]{2,}\\.[a-z]{2,}\\.[a-z-]{2,}$"))
        }])
        packageInfo.identifier = identifier;
        await fs.writeJSON(path.resolve(this.pluginName, "package.json"), packageInfo);
        console.log(green("Plugin project created successfully"));
    }

    private mkdir(dirPath = ".") {
        const p = path.resolve(this.targetDir, dirPath);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }

}
