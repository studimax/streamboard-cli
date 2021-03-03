import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import {green} from "colors/safe";
import download from "./GithubDownloader";
import PackageManager from "./PackageManager";

export default class PluginCreate {
    private pkgManager = new PackageManager();

    constructor(private readonly pluginName: string, private readonly targetDir: string) {
    }

    public async run(noPrompt = false): Promise<void> {
        this.mkdir();
        await download("studimax/streamboard-simple-plugin", this.targetDir);
        const packageInfo = await fs.readJSON(path.resolve(this.pluginName, "package.json"));
        packageInfo.name = this.pluginName;
        const defaultIdentifier = "com.myname." + this.pluginName;
        packageInfo.identifier = noPrompt ? defaultIdentifier :
            (await inquirer.prompt([{
                name: "identifier",
                type: "input",
                message: "type a plugin identifier",
                default: () => defaultIdentifier,
                validate: (input: string) => !!input.match("^[a-z]{2,}\\.[a-z]{2,}\\.[a-z-]{2,}$")
            }])).identifier;
        await fs.writeJSON(path.resolve(this.pluginName, "package.json"), packageInfo, {spaces: "\t"});
        console.log(green("Installation..."));
        await this.pkgManager.install(this.targetDir);
        console.log(green("Plugin project created successfully"));
    }

    private mkdir(dirPath = "."): void {
        const p = path.resolve(this.targetDir, dirPath);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
}
