import path from "path";
import fs from "fs-extra";
import Ajv from "ajv";
import tar from "tar-fs";
import {PluginPackageInterface, PluginPackageSchema} from "./PluginPackageInterface";
import packageInfo from "../../package.json";
import {cyan, green, yellow} from "colors/safe";
import webpack from "webpack";
import Config, {CompilerConfig} from "./webpack.config";
import cliProgress from "cli-progress";

export default class PluginBuilder {
    private static readonly packageFolder = "package";
    public verbose = true;

    constructor(private readonly srcPath: string, private readonly distPath: string) {
    }

    public async run(): Promise<void> {
        this.log(cyan(`Run ${packageInfo.name}@${packageInfo.version}`));
        const pkg = await this.verifyPlugin();
        const c = new Config(
            this.srcPath,
            path.resolve(this.distPath, PluginBuilder.packageFolder, pkg.identifier)
        );
        this.log(cyan(`Let's make ${yellow(pkg.name)} a perfect packed plugin !`));
        await this.compile(pkg, c);
        await this.pack(pkg, c);
    }

    private log(...data: any[]) {
        if (this.verbose) console.log(...data);
    }

    private compile(pkg: PluginPackageInterface, config: Config): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.log(green("start compiling..."));
            const bar = new cliProgress.SingleBar({
                format: 'Compile |' + cyan('{bar}') + '| {percentage}% || {state}',
                clearOnComplete: true
            }, cliProgress.Presets.shades_classic);
            if (this.verbose) {
                bar.start(100, 0, {
                    state: "starting"
                });
            }
            config.entry = path.resolve(this.srcPath, pkg.main);
            config.onprogress = (percentage, msg) => {
                bar.update(Math.floor(percentage * 100), {
                    state: msg
                });
            }
            const wb = webpack(config.toWebpackConfig());
            wb.run((err?: Error, stats?) => {
                bar.stop();
                this.log(green("finish compiling..."));
                if (err) return reject(err);
                if (stats?.hasErrors()) return reject(stats?.compilation.errors);
                if (stats?.hasWarnings()) {
                    this.log(yellow(stats?.compilation.warnings.toString()));
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
        this.log(green("start creating plugin package.json..."));
        await fs.writeJSON(path.resolve(config.output.path, "package.json"), pkg, {spaces: "\t"});
        this.log(green("start packaging..."));
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
