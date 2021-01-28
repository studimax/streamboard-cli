import path from "path";
import {Configuration} from "webpack";
import CopyPlugin from "copy-webpack-plugin";

export interface CompilerConfig extends Configuration {
    output: {
        path: string;
        filename: string;
    }
}

export default {
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
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "assets/",
                    to:"assets/",
                    globOptions: {
                        gitignore: true,
                    }
                },
            ],
        }),
    ],
    target: "node"
} as CompilerConfig;
