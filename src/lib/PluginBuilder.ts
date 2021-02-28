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

    constructor(private readonly srcPath: string, private readonly distPath: string) {
    }

    public async run(): Promise<void> {
        console.log(cyan(`Run ${packageInfo.name}@${packageInfo.version}`));
        const pkg = await this.verifyPlugin();
        const c = config(
            this.srcPath,
            path.resolve(this.distPath, PluginBuilder.packageFolder, pkg.identifier)
        );
        console.log(cyan(`Let's make ${yellow(pkg.name)} a perfect packed plugin !`));
        await this.compile(pkg, c);
        await this.pack(pkg, c);
    }

    private compile(pkg: PluginPackageInterface, config: CompilerConfig): Promise<unknown> {
        return new Promise((resolve, reject) => {
            console.log(green("start compiling..."));
            const wb = webpack({
                ...config,
                entry: path.resolve(this.srcPath, pkg.main),
            });
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

    private async pack(pkg: PluginPackageInterface, config: CompilerConfig): Promise<void> {
        pkg = {
            ...pkg,
            main: config.output.filename
        };
        console.log(green("start creating plugin package.json..."));
        await fs.writeJSON(path.resolve(config.output.path, "package.json"), pkg, {spaces: "\t"});
        console.log(green("start packaging..."));
        tar
            .pack(config.output.path)
            .pipe(fs.createWriteStream(path.resolve(config.output.path, `../${pkg.identifier}@${pkg.version}.sbplugin`)));
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
