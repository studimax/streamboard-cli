import config, {CompilerConfig} from "./webpack.config";
import path from "path";
import fs from "fs-extra";
import Ajv from "ajv";
import tar from "tar-fs";
import {PluginPackageInterface, PluginPackageSchema} from "./PluginPackageInterface";
import packageInfo from "../../package.json";
import {green} from "colors";
import {cyan, yellow} from "colors/safe";
import webpack from "webpack";

export default class PluginBuilder {
    private static readonly packageFolder = "package";
    private readonly config: CompilerConfig;

    constructor(private readonly srcPath: string, private readonly distPath: string) {
        this.config = config(this.srcPath, path.resolve(this.distPath, PluginBuilder.packageFolder, "unpacked"));
    }

    public async run(): Promise<void> {
        console.log(cyan(`Run ${packageInfo.name}@${packageInfo.version}`));
        const pkg = await this.verifyPlugin();
        console.log(cyan(`Let's make ${yellow(pkg.name)} a perfect packed plugin !`));
        await this.compile();
        await this.pack(pkg);
    }

    private compile(): Promise<unknown> {
        return new Promise((resolve, reject) => {
            console.log(green("start compiling..."));
            const wb = webpack(this.config);
            wb.run((err?: Error, stats?) => {
                console.log(green("finish compiling..."));
                if (err) return reject(err);
                if (stats?.hasErrors()) return reject(stats?.compilation.errors);
                if (stats?.hasWarnings()) {
                    console.log(yellow(stats?.compilation.warnings.toString()));
                }
                return resolve(stats);
            });
        });
    }

    private async pack(pkg: PluginPackageInterface): Promise<void> {
        pkg = {
            ...pkg,
            main: this.config.output.filename
        };
        console.log(green("start creating plugin package.json..."));
        await fs.writeJSON(path.resolve(this.config.output.path, "package.json"), pkg, {spaces: "\t"});
        console.log(green("start packaging..."));
        tar
            .pack(this.config.output.path)
            .pipe(fs.createWriteStream(path.resolve(this.config.output.path, `../${pkg.identifier}@${pkg.version}.sbplugin`)));
    }

    private async verifyPlugin(): Promise<PluginPackageInterface> {
        const pkgPath = path.resolve(this.srcPath, "package.json");
        const pkgData: PluginPackageInterface = await fs.readJSON(pkgPath);
        const ajv = new Ajv({removeAdditional: true});
        const validate = await ajv.compile<PluginPackageInterface>(PluginPackageSchema);
        const valid = validate(pkgData);
        if (!valid) throw new Error(ajv.errorsText(validate.errors));
        return pkgData;
    }
}
