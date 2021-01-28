"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const webpack_config_1 = __importDefault(require("./webpack.config"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const ajv_1 = __importDefault(require("ajv"));
const tar_fs_1 = __importDefault(require("tar-fs"));
const PluginPackageInterface_1 = require("./PluginPackageInterface");
class PluginBuilder {
    constructor(srcPath, distPath) {
        this.srcPath = srcPath;
        this.distPath = distPath;
        this.config = webpack_config_1.default;
        this.config.context = this.srcPath;
        this.packageFolder = "package";
        this.config.output.path = path_1.default.resolve(this.distPath, this.packageFolder, 'unpacked');
        this.pkg = this.verifyPlugin();
    }
    compile() {
        const wb = webpack_1.webpack(this.config);
        wb.run((err, result) => {
            if (err)
                throw new Error("error during packaging");
            this.pack();
        });
    }
    pack() {
        const pkg = {
            ...this.pkg,
            main: this.config.output.filename
        };
        fs.writeFileSync(path_1.default.join(this.config.output.path, "package.json"), JSON.stringify(pkg, null, "\t"));
        tar_fs_1.default
            .pack(this.config.output.path)
            .pipe(fs.createWriteStream(path_1.default.resolve(this.config.output.path, `../${pkg.identifier}-${pkg.version}.tar`)));
    }
    verifyPlugin() {
        const pkgPath = path_1.default.join(this.srcPath, "package.json");
        const pkgData = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        const ajv = new ajv_1.default({ removeAdditional: true });
        const validate = ajv.compile(PluginPackageInterface_1.PluginPackageSchema);
        const valid = validate(pkgData);
        if (!valid)
            throw new Error(ajv.errorsText(validate.errors));
        return pkgData;
    }
}
exports.default = PluginBuilder;
//# sourceMappingURL=PluginBuilder.js.map