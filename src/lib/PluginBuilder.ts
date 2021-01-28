import {webpack} from "webpack";
import config, {CompilerConfig} from "./webpack.config"
import path from "path";
import * as fs from "fs";
import Ajv from "ajv";
import tar from "tar-fs";
import {PluginPackageInterface, PluginPackageSchema} from "./PluginPackageInterface";

export default class PluginBuilder {
    private readonly config: CompilerConfig;
    private readonly pkg: PluginPackageInterface;
    private readonly packageFolder: string;

    constructor(private readonly srcPath: string, private readonly distPath: string) {
        this.config = config;
        this.config.context = this.srcPath;
        this.packageFolder = "package"
        this.config.output.path = path.resolve(this.distPath, this.packageFolder, 'unpacked');
        this.pkg = this.verifyPlugin();
    }

    public compile() {
        const wb = webpack(this.config);
        wb.run((err?: Error, result?) => {
            if (err) throw new Error("error during packaging");
            this.pack();
        });
    }

    private pack() {
        const pkg = {
            ...this.pkg,
            main: this.config.output.filename
        }
        fs.writeFileSync(path.join(this.config.output.path, "package.json"), JSON.stringify(pkg, null, "\t"));
        tar
            .pack(this.config.output.path)
            .pipe(fs.createWriteStream(path.resolve(this.config.output.path, `../${pkg.identifier}-${pkg.version}.sbplugin`)));
    }

    private verifyPlugin(): PluginPackageInterface {
        const pkgPath = path.join(this.srcPath, "package.json");
        const pkgData: PluginPackageInterface = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        const ajv = new Ajv({removeAdditional: true});
        const validate = ajv.compile<PluginPackageInterface>(PluginPackageSchema)
        const valid = validate(pkgData);
        if (!valid) throw new Error(ajv.errorsText(validate.errors));
        return pkgData;
    }
}
