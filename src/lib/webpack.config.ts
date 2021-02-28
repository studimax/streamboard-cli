import {Configuration} from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

export interface CompilerConfig extends Configuration {
    entry: string;
    output: {
        path: string;
        filename: string;
    }
}

export default (src: string, out: string): CompilerConfig => ({
    context: path.resolve(__dirname),
    mode: "production",
    stats: true,
    entry: path.resolve(src, "./src/index.ts"),
    output: {
        path: out,
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    context: path.resolve(src),
                    from: "assets/",
                    to: "assets/",
                    globOptions: {
                        gitignore: true
                    }
                }
            ]
        })
    ],
    target: "node"
});
