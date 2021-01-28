import {webpack} from "webpack";
import config, {CompilerConfig} from "./webpack.config"
import path from "path";
import * as fs from "fs";
import Ajv from "ajv";
import tar from "tar-fs";
import {PluginPackageInterface, PluginPackageSchema} from "./PluginPackageInterface";
import packageInfo from "../../package.json"

export default class PluginBuilder {
    private readonly config: CompilerConfig;
    private readonly packageFolder: string;

    constructor(private readonly srcPath: string, private readonly distPath: string) {
        this.config = config;
        this.config.context = this.srcPath;
        this.packageFolder = "package"
        this.config.output.path = path.resolve(this.distPath, this.packageFolder, 'unpacked');
    }

    public async run() {
        console.log(`Run ${packageInfo.name}@${packageInfo.version}`);
        const pkg = await this.verifyPlugin();
        await this.compile();
        await this.pack(pkg);
    }

    private compile() {
        console.log("start compiling...");
        return new Promise((resolve, reject) => {
            const wb = webpack(this.config);
            wb.run((err?: Error, result?) => {
                console.log("finish compiling...");
                if (err) return reject(err);
                return resolve(result);
            });
        })
    }

    private async pack(pkg: PluginPackageInterface) {
        pkg = {
            ...pkg,
            main: this.config.output.filename
        }
        console.log("start creating plugin package.json...");
        await fs.promises.writeFile(path.join(this.config.output.path, "package.json"), JSON.stringify(pkg, null, "\t"));
        console.log("start packaging...");
        tar
            .pack(this.config.output.path)
            .pipe(fs.createWriteStream(path.resolve(this.config.output.path, `../${pkg.identifier}-${pkg.version}.sbplugin`)));
    }

    private async verifyPlugin(): Promise<PluginPackageInterface> {
        const pkgPath = path.join(this.srcPath, "package.json");
        const pkgData: PluginPackageInterface = JSON.parse(await fs.promises.readFile(pkgPath, "utf8"));
        const ajv = new Ajv({removeAdditional: true});
        const validate = await ajv.compile<PluginPackageInterface>(PluginPackageSchema)
        const valid = validate(pkgData);
        if (!valid) throw new Error(ajv.errorsText(validate.errors));
        return pkgData;
    }
}
