"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
exports.default = {
    context: process.cwd(),
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path_1.default.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    plugins: [
        new copy_webpack_plugin_1.default({
            patterns: [
                {
                    from: "assets/",
                    to: "assets/",
                    globOptions: {
                        gitignore: true,
                    }
                },
            ],
        }),
    ],
    target: "node"
};
//# sourceMappingURL=webpack.config.js.map